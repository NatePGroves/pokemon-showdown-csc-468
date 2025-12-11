# learning_agent.py

 

import asyncio

import random

from collections import defaultdict
from poke_env.player.baselines import SimpleHeuristicsPlayer, MaxBasePowerPlayer
 

from poke_env import RandomPlayer

from poke_env.player import Player

from poke_env.ps_client.server_configuration import LocalhostServerConfiguration

 

class QLearningPlayer(Player):

    """

    Q-learning agent for Pokémon Showdown via poke-env with simple

    competitive heuristics.

 

    STATE:

        (my_hp_bucket, opp_hp_bucket, my_remaining, opp_remaining)

 

    ACTIONS:

        Index into battle.available_moves (0..len-1)

 

    REWARD:

        (# opponent fainted) - (# my fainted)

 

    POLICY:

        ε-greedy over:

            Q(state, action) + heuristic_bonus(battle, move)

 

        Where heuristic_bonus encodes:

        - Momentum & tempo (U-turn / Volt Switch / Flip Turn)

        - Hazards / status early-game

        - Resource management (limited PP moves)

        - Consistency (avoid low-accuracy moves when ahead)

    """

 

    # --- Move-type knowledge for heuristics ---

    PIVOT_MOVES = {"uturn", "voltswitch", "flipturn", "partingshot", "chillyreception"}

    HAZARD_MOVES = {"stealthrock", "spikes", "toxicspikes", "stickyweb"}

    STATUS_MOVES = {

        "toxic",

        "willowisp",

        "thunderwave",

        "spore",

        "sleeppowder",

        "yawn",

        "glare",

        "stunspore",

    }

    SETUP_MOVES = {"swordsdance", "dragondance", "nastyplot", "calmmind", "bulkup"}

 

    def __init__(

        self,

        epsilon: float = 0.2,   # exploration rate

        alpha: float = 0.3,     # learning rate

        gamma: float = 0.95,    # discount factor

        **kwargs,

    ):

        super().__init__(**kwargs)

        self.epsilon = epsilon

        self.alpha = alpha

        self.gamma = gamma

 

        # Q-table: Q[state][action_index] -> value

        self.q = defaultdict(lambda: defaultdict(float))

 

        # last transition info

        self._last_state = None    # tuple

        self._last_action = None   # int (index into available_moves)

 

    # ---------- State & reward helpers ----------

 

    def _hp_bucket(self, pokemon):

        """Discretize HP into 3 buckets: 2 = healthy, 1 = mid, 0 = low/KO."""

        if pokemon is None:

            return 0

        frac = pokemon.current_hp_fraction  # 0..1

        if frac > 2 / 3:

            return 2

        elif frac > 1 / 3:

            return 1

        else:

            return 0

 

    def embed_battle(self, battle):

        """Map the battle to a compact discrete state."""

        me = battle.active_pokemon

        opp = battle.opponent_active_pokemon

 

        my_hp = self._hp_bucket(me)

        opp_hp = self._hp_bucket(opp)

 

        my_remaining = sum(not p.fainted for p in battle.team.values())

        opp_remaining = sum(not p.fainted for p in battle.opponent_team.values())

 

        return (my_hp, opp_hp, my_remaining, opp_remaining)

 

    def _reward(self, battle):

        """

        Reward = (# opponent fainted) - (# my fainted).

        Positive if we're ahead in KOs.

        """

        my_fainted = sum(p.fainted for p in battle.team.values())

        opp_fainted = sum(p.fainted for p in battle.opponent_team.values())

        return opp_fainted - my_fainted

 

    # ---------- Heuristic layer (meta / tempo / resource mgmt) ----------

 

    def _heuristic_bonus(self, battle, move):

        """

        Small additive bonus/penalty for a move, encoding competitive ideas:

 

        - Early hazards/status

        - Momentum (pivots)

        - Resource management (low PP)

        - Consistency (accuracy, especially when ahead)

        """

        bonus = 0.0

        state = self.embed_battle(battle)

        _, _, my_remaining, opp_remaining = state

        reward = self._reward(battle)

 

        move_id = move.id.lower() if hasattr(move, "id") and move.id else ""

        is_early_game = (my_remaining >= 4 and opp_remaining >= 4)

        is_late_game = (my_remaining <= 2 or opp_remaining <= 2)

 

        # --- Momentum & tempo: value pivots like U-turn / Volt Switch / Flip Turn ---

        if move_id in self.PIVOT_MOVES:

            # Pivots are especially valuable mid-game or when we're slightly behind

            if reward <= 0:

                bonus += 0.6  # help regain / keep momentum

            else:

                bonus += 0.3

 

        # --- Hazards early game ---

        if move_id in self.HAZARD_MOVES and is_early_game:

            # Only really useful if opp has multiple mons left

            if opp_remaining >= 4:

                bonus += 0.5

 

        # --- Status early/mid game: Toxic, Wisp, TWave, Spore, etc. ---

        if move_id in self.STATUS_MOVES and not is_late_game:

            # Status is strong chip over time; better when many turns remain

            bonus += 0.4

 

        # --- Setup moves (Swords Dance, Nasty Plot, etc.) ---

        if move_id in self.SETUP_MOVES:

            # Setup is best early/mid, and when we're not already far behind

            if reward >= -1 and not is_late_game:

                bonus += 0.4

            else:

                # If we're getting crushed or it's late, greedy setup is risky

                bonus -= 0.2

 

        # --- Resource management: avoid burning low PP too early ---

        # (Think Hydro Pump / Fire Blast / Overheat etc.)

        pp = getattr(move, "pp", None)

        max_pp = getattr(move, "max_pp", None)

        if pp is not None and max_pp is not None and max_pp > 0:

            if pp <= 3 and not is_late_game:

                # Don't spam the last few PP of a premium move early

                bonus -= 0.3

 

        # --- Consistency: avoid low accuracy when already winning ---

        accuracy = getattr(move, "accuracy", None)

        if isinstance(accuracy, (int, float)):

            # When we're ahead, be more conservative

            if reward > 0 and accuracy < 90:

                bonus -= 0.4

            # When behind, it's sometimes okay to fish a bit

            elif reward < 0 and accuracy >= 90 and accuracy < 100:

                bonus += 0.1  # small nudge toward "good but not perfect" moves

 

        # --- Small bias toward stronger attacking moves in late game ---

        base_power = getattr(move, "base_power", 0) or 0

        if is_late_game and base_power >= 90:

            bonus += 0.2

 

        return bonus

 

    # ---------- Core Q-learning + policy ----------

 

    def choose_move(self, battle):

        """

        Called by poke-env every turn.

 

        1. Build current state & reward.

        2. TD-update using previous (state, action).

        3. ε-greedy over:

               Q(state, action) + heuristic_bonus(battle, move)

        4. Return a BattleOrder via self.create_order(...).

        """

 

        state = self.embed_battle(battle)

        reward = self._reward(battle)

 

        # ----- TD update from last step -----

        if self._last_state is not None and self._last_action is not None:

            next_q_values = self.q[state]

            best_next_q = max(next_q_values.values()) if next_q_values else 0.0

 

            old_q = self.q[self._last_state][self._last_action]

            new_q = old_q + self.alpha * (

                reward + self.gamma * best_next_q - old_q

            )

            self.q[self._last_state][self._last_action] = new_q

 

        # ----- Forced switch: no moves available -----

        # ----- Forced switch: must switch when available_moves is empty -----
        # Force-switch logic (handles revival blessing desync)
        if battle.force_switch:
            # If poke-env gives us switches, choose one
            if battle.available_switches:
                self._last_state = None
                self._last_action = None
                return self.create_order(random.choice(battle.available_switches))

            # Otherwise: let poke-env handle weird edge cases (Revival Blessing, reviving loops)
            return self.choose_random_move(battle)

 

        # ----- Q-learning + heuristics over attack moves -----

        n_actions = len(battle.available_moves)

        actions = list(range(n_actions))

 

        # Build "augmented" scores = Q + heuristic

        q_state = self.q[state]

        scores = []

        for a in actions:

            move = battle.available_moves[a]

            q_val = q_state[a]

            h_val = self._heuristic_bonus(battle, move)

            scores.append(q_val + h_val)

 

        # ε-greedy selection on *augmented* scores

        if random.random() < self.epsilon:

            action_idx = random.choice(actions)

        else:

            action_idx = max(actions, key=lambda a: scores[a])

 

        self._last_state = state

        self._last_action = action_idx

 

        chosen_move = battle.available_moves[action_idx]

        return self.create_order(chosen_move)

 

# ---------- Training + evaluation loop ----------

 

async def train_and_evaluate():

    # Same server configuration as example_script

    server_cfg = LocalhostServerConfiguration

 

    learner = QLearningPlayer(

        battle_format="gen9randombattle",

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

        epsilon=0.3,   # more exploration during training

    )

    heuristics_opp = SimpleHeuristicsPlayer(

        battle_format="gen9randombattle",

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    max_opp = MaxBasePowerPlayer(

        battle_format="gen9randombattle",

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    random_opp = RandomPlayer(

        battle_format="gen9randombattle",

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    opps = [random_opp, max_opp, heuristics_opp]

    # -------- TRAINING --------
    n_train = 5000
    for opp in opps:
        learner.reset_battles() # just in case we are continuing training
        print(f"Training the learner for {n_train} battles vs {opp.username}...", flush=True)

        await learner.battle_against(opp, n_battles=n_train)

        print("Training finished.", flush=True)

        print(

            f"Training stats: learner wins against {opp.username}"

            f"{learner.n_won_battles}/{learner.n_finished_battles}",

            flush=True

        )
        learner.reset_battles()

 

    # -------- EVALUATION --------

    learner.epsilon = 0.0  # greedy policy, no exploration

 

    learner.reset_battles()   # keep Q-table, reset counters

    random_opp.reset_battles()

 

    n_eval = 100

    print(f"\nEvaluating trained learner for {n_eval} battles vs Random...",

          flush=True)

    await learner.battle_against(random_opp, n_battles=n_eval)

 

    wins = learner.n_won_battles

    losses = random_opp.n_won_battles

    ties = max(n_eval - (wins + losses), 0)

 

    print("\n=== Evaluation Results (QLearning + Heuristics vs Random) ===",

          flush=True)

    print(f"Learner Wins: {wins}  ({wins / n_eval:.2%})", flush=True)

    print(f"Random  Wins: {losses}  ({losses / n_eval:.2%})", flush=True)

    print(f"Ties:         {ties}  ({ties / n_eval:.2%})", flush=True)

 

if __name__ == "__main__":

    asyncio.run(train_and_evaluate())