import asyncio
from poke_env.player.baselines import SimpleHeuristicsPlayer, MaxBasePowerPlayer
from poke_env.player import RandomPlayer
from poke_env.player import Player
from poke_env.ps_client.server_configuration import LocalhostServerConfiguration
from q_v1 import QLearningPlayer
import os
import csv

async def battle_and_log(learner, opponent, csv_file, n_eval):
    """Run a single battle and log results."""
    # Run just one battle
    await learner.battle_against(opponent, n_battles=n_eval)
    
    # Access the last finished battle
    battles = [b for b in learner._battles.values()]  # _battles stores Battle objects
    
    rows = []
    for b in battles:

        rows.append({
        "battle_tag": b.battle_tag,
        "learner": learner.username,
        "opponent": opponent.username,
        "outcome": "Loss" if not b.won else "Win",
        "n_turns": b.turn,
        "learner_pokemon_remaining": sum([i.fainted for i in b.team.values()]),
        "opponent_pokemon_remaining": sum([i.fainted for i in b.opponent_team.values()])
        })
    
    # Write to CSV
    write_header = not os.path.exists(csv_file)
    with open(csv_file, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        if write_header:
            writer.writeheader()
        for row in rows:
            writer.writerow(row)

# ---------- Training + evaluation loop ----------

 

async def train_and_evaluate(learner: Player, battle_format:str, n_train: int, n_eval: int):

    # Same server configuration as example_script

    server_cfg = LocalhostServerConfiguration

 

    learner = QLearningPlayer(

        battle_format=battle_format,

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

        epsilon=0.3,   # more exploration during training

    )

    heuristics_opp = SimpleHeuristicsPlayer(

        battle_format=battle_format,

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    max_opp = MaxBasePowerPlayer(

        battle_format=battle_format,

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    random_opp = RandomPlayer(

        battle_format=battle_format,

        server_configuration=server_cfg,

        start_timer_on_battle_start=False,

    )

    training_opps = [random_opp, max_opp, heuristics_opp]
    testing_opps = [random_opp, max_opp, heuristics_opp]

    # -------- TRAINING --------
    n_train = n_train
    for opp in training_opps:
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
    for opp in testing_opps:
        learner.epsilon = 0.0  # greedy policy, no exploration

    

        learner.reset_battles()   # keep Q-table, reset counters

        opp.reset_battles()

    

        n_eval = n_eval

        
        print(f"\nEvaluating trained learner for {n_eval} battles vs {opp.username}...",

            flush=True)
        
        
        await battle_and_log(learner, opp, "long_full_train_battle_results.csv", n_eval = 100)

    

        wins = learner.n_won_battles

        losses = random_opp.n_won_battles

        ties = max(n_eval - (wins + losses), 0)

        print(f"\n=== Evaluation Results (QLearning + {opp.username} ===",

            flush=True)

        print(f"Learner Wins: {wins}  ({wins / n_eval:.2%})", flush=True)

        print(f"Random  Wins: {losses}  ({losses / n_eval:.2%})", flush=True)

        print(f"Ties:         {ties}  ({ties / n_eval:.2%})", flush=True)

if __name__ == "__main__":

    asyncio.run(train_and_evaluate(QLearningPlayer, "gen9randombattle", 1000, 100))  