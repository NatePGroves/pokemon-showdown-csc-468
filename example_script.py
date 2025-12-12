from poke_env import RandomPlayer
from poke_env.player.baselines import SimpleHeuristicsPlayer, MaxBasePowerPlayer
import asyncio

async def main():
    sh = SimpleHeuristicsPlayer(battle_format="gen5randombattle")
    mbp = MaxBasePowerPlayer(battle_format="gen5randombattle")
    rando = RandomPlayer(battle_format="gen5randombattle")
    players = [sh, mbp, rando]
    
    matchups = [(sh, mbp),
                (sh,rando),
                (mbp, rando)]
    
    for matchup in matchups:

        p1 = matchup[0]
        p2 = matchup[1]
        await p1.battle_against(p2, n_battles=100)
        
        # n_won_battles and n_finished_battles

        print(
            f"Player {p1.username} won {p1.n_won_battles} out of {p1.n_finished_battles} played"
        )
        print(
            f"Player {p2.username} won {p2.n_won_battles} out of {p2.n_finished_battles} played"
        )

    print(f'Player {sh.username} had a win rate of {sh.win_rate}')
    print(f'Player {mbp.username} had a win rate of {mbp.win_rate}')
    print(f'Player {rando.username} had a win rate of {rando.win_rate}')

# Run the async function
if __name__ == "__main__":

    asyncio.run(main())
    