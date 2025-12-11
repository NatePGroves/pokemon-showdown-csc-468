import numpy as np
from gymnasium.spaces import Space, Box
from poke_env.player.player import Player

import asyncio

from poke_env import RandomPlayer
from poke_env.data import GenData

class SimpleRLPlayer(Player):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        low = [-1, -1, -1, -1, 0, 0, 0, 0, 0, 0]
        high = [3, 3, 3, 3, 4, 4, 4, 4, 1, 1]
        self.observation_spaces = Box(
                np.array(low, dtype=np.float32),
                np.array(high, dtype=np.float32),
                dtype=np.float32,
            )


    def calc_reward(self, battle) -> float:
        return self.reward_computing_helper(
            battle, fainted_value=2.0, hp_value=1.0, victory_value=30.0
        )
    
    def choose_move(self, battle):
            if battle.available_moves:
                best_move = max(battle.available_moves, key=lambda move: move.base_power)
                return self.create_order(best_move)
            return self.choose_random_move(battle)

    def embed_battle(self, battle):
        # -1 indicates that the move does not have a base power
        # or is not available
        moves_base_power = -np.ones(4)
        moves_dmg_multiplier = np.ones(4)
        for i, move in enumerate(battle.available_moves):
            moves_base_power[i] = (
                move.base_power / 100
            )  # Simple rescaling to facilitate learning
            if move.type:
                moves_dmg_multiplier[i] = move.type.damage_multiplier(
                    battle.opponent_active_pokemon.type_1,
                    battle.opponent_active_pokemon.type_2,
                )

        # We count how many pokemons have fainted in each team
        fainted_mon_team = len([mon for mon in battle.team.values() if mon.fainted]) / 6
        fainted_mon_opponent = (
            len([mon for mon in battle.opponent_team.values() if mon.fainted]) / 6
        )

        

        # Final vector with 10 components
        final_vector = np.concatenate(
            [
                moves_base_power,
                moves_dmg_multiplier,
                [fainted_mon_team, fainted_mon_opponent],
            ]
        )

        return np.float32(final_vector)
    
from gymnasium.utils.env_checker import check_env
from poke_env.player import RandomPlayer

# opponent = RandomPlayer(battle_format="gen8randombattle")
# test_env = SimpleRLPlayer(
#     battle_format="gen8randombattle", opponent=opponent
# )
import numpy as np
from gymnasium.spaces import Box, Discrete
from poke_env.player import Player
from poke_env.data import GenData


class SimpleRLPlayer(Player):
    """
    A Gymnasium-compatible poke-env Player class
    with state embedding and Q-learning action interface.
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # ---- Observation Space ----
        # 4 base powers, 4 type multipliers, 2 faint counters = 10 features
        self.observation_space = Box(
            low=np.array([-1, -1, -1, -1, 0, 0, 0, 0, 0, 0], dtype=np.float32),
            high=np.array([3, 3, 3, 3, 4, 4, 4, 4, 1, 1], dtype=np.float32),
            dtype=np.float32
        )

        # ---- Action Space ----
        # We force: 0–3 = moves (move slot index),
        #            4   = "random backup" if slot invalid
        self.action_space = Discrete(5)

        # Q-learning parameters (you can overwrite later)
        self.q_table = {}      # dict: {state_tuple: np.array(5)}
        self.epsilon = 0.2
        self.lr = 0.1
        self.gamma = 0.95

        self.last_state = None
        self.last_action = None

    # --------------------------
    # --- Embed battle state ---
    # --------------------------
    def embed_battle(self, battle):
        moves_base_power = -np.ones(4, dtype=np.float32)
        moves_dmg_multiplier = np.ones(4, dtype=np.float32)

        # new type chart lookup
        type_chart = GenData.from_gen(8).type_chart

        for i, move in enumerate(battle.available_moves[:4]):
            moves_base_power[i] = (move.base_power or 0) / 100

            if move.type:
                moves_dmg_multiplier[i] = move.type.damage_multiplier(
                    battle.opponent_active_pokemon.type_1,
                    battle.opponent_active_pokemon.type_2,
                    type_chart=type_chart
                )

        fainted_team = len([m for m in battle.team.values() if m.fainted]) / 6
        fainted_opp = len([m for m in battle.opponent_team.values() if m.fainted]) / 6

        return np.concatenate([
            moves_base_power,
            moves_dmg_multiplier,
            [fainted_team, fainted_opp]
        ]).astype(np.float32)

    # -------------------------
    # --- Reward function -----
    # -------------------------
    def calc_reward(self, battle) -> float:
        return self.reward_computing_helper(
            battle,
            fainted_value=1.0,
            hp_value=0.1,
            victory_value=10.0
        )

    # -------------------------
    # --- Q-learning logic ----
    # -------------------------
    def get_q(self, state):
        key = tuple(state.round(3))  # stable dictionary key
        if key not in self.q_table:
            self.q_table[key] = np.zeros(self.action_space.n)
        return self.q_table[key], key

    def choose_move(self, battle):
        # Convert battle → state
        state = self.embed_battle(battle)
        q_values, key = self.get_q(state)

        # Epsilon-greedy action selection
        if np.random.rand() < self.epsilon:
            action = np.random.randint(self.action_space.n)
        else:
            action = np.argmax(q_values)

        # Convert action into a legal move
        if action < 4 and len(battle.available_moves) > action:
            chosen_move = battle.available_moves[action]
            order = self.create_order(chosen_move)
        else:
            order = self.choose_random_move(battle)

        # Save for Q-learning update later
        self.last_state = key
        self.last_action = action

        return order

    # ----------------------------------------
    # --- Called at end of each battle turn ---
    # ----------------------------------------
    def _handle_reward(self, reward, done):
        # Normal Q-learning update
        if self.last_state is None:
            return

        old_q = self.q_table[self.last_state][self.last_action]

        if not done:
            # Next best Q
            max_next_q = np.max(list(self.q_table.values())[ -1 ])
        else:
            max_next_q = 0

        new_q = old_q + self.lr * (reward + self.gamma * max_next_q - old_q)
        self.q_table[self.last_state][self.last_action] = new_q

import asyncio
from poke_env.player import RandomPlayer

async def main():
    p1 = SimpleRLPlayer(battle_format="gen8randombattle")
    p2 = RandomPlayer(battle_format="gen8randombattle")

    await p1.battle_against(p2, n_battles=300)

    print("Training complete!")
    print("Sample Q-table size:", len(p1.q_table))

if __name__ == "__main__":
    asyncio.run(main())
