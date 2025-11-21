import asyncio
import logging
import csv
from poke_env.player.baselines import MaxBasePowerPlayer, SimpleHeuristicsPlayer, RandomPlayer

logging.basicConfig(level=logging.INFO)

# Offline players: do NOT pass server or account configurations
random_player = RandomPlayer(battle_format="gen9ou", team="random")
maxpower_player = MaxBasePowerPlayer(battle_format="gen9ou", team="random")
heuristic_player = SimpleHeuristicsPlayer(battle_format="gen9ou", team="random")

matchups = [
    (random_player, heuristic_player),
    (random_player, maxpower_player),
    (heuristic_player, maxpower_player),
]

csv_file = "battle_results.csv"

async def run_battles():
    with open(csv_file, mode="w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Player 1", "Player 2", "Player 1 Wins", "Player 2 Wins"])

        for p1, p2 in matchups:
            # Reset wins
            p1.n_won_battles = 0
            p2.n_won_battles = 0

            logging.info(f"Starting battles: {p1.__class__.__name__} vs {p2.__class__.__name__}")

            # Run battles offline
            await p1.battle_against(p2, n_battles=10)

            logging.info(f"Results: {p1.__class__.__name__} won {p1.n_won_battles}/10, "
                         f"{p2.__class__.__name__} won {p2.n_won_battles}/10")

            writer.writerow([p1.__class__.__name__, p2.__class__.__name__,
                             p1.n_won_battles, p2.n_won_battles])

    logging.info(f"All battles completed. Results saved to {csv_file}")

if __name__ == "__main__":
    asyncio.run(run_battles())



