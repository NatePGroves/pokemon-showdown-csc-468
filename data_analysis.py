import pandas as pd
import matplotlib.pyplot as plt
import os

# -----------------------------
# Load CSV
# -----------------------------

title = "100 Training Battles Against Each"
csv_title = "short_full_train_battle_results"
df = pd.read_csv(f"{csv_title}.csv")

os.mkdir(csv_title)

# Normalize fields
df["outcome"] = df["outcome"].str.strip().str.capitalize()
df["win"] = (df["outcome"] == "Win").astype(int)

# -----------------------------------
# Create battle-length categories
# -----------------------------------
df["length_category"] = pd.cut(
    df["n_turns"],
    bins=[0, 40, 80, 200],
    labels=["Short", "Medium", "Long"],
    include_lowest=True
)

# -----------------------------
# Group by opponent
# -----------------------------
group_opp = df.groupby("opponent").agg({
    "win": "mean",
    "learner_pokemon_remaining": "mean",
    "opponent_pokemon_remaining": "mean",
    "n_turns": "mean"
})

print("\n=== Win Rate + Pokémon Remaining by Opponent ===\n")
print(group_opp)

# -----------------------------
# Group by opponent AND battle length
# -----------------------------
group_opp_len = df.groupby(["opponent", "length_category"]).agg({
    "win": "mean",
    "learner_pokemon_remaining": "mean",
    "opponent_pokemon_remaining": "mean",
    "n_turns": "mean",
    "win": "count"
}).rename(columns={"win": "count"})

print("\n=== Win Rate & Pokémon Remaining by Opponent × Battle Length ===\n")
print(group_opp_len)

# -----------------------------
# Plot 1: Win rate by opponent
# -----------------------------
plt.figure(figsize=(8, 4))
plt.bar(group_opp.index, group_opp["win"])
plt.title(f"Win Rate by Opponent for {title}")
plt.xlabel("Opponent")
plt.ylabel("Win Rate")
plt.grid(True, axis="y")
plt.tight_layout()
plt.savefig(f"{csv_title}/{title}_1.png")


# -----------------------------
# Plot 2: Pokémon Remaining vs Opponent
# -----------------------------
plt.figure(figsize=(10, 4))
sc = plt.scatter(
    df.index,
    df["learner_pokemon_remaining"],
    marker="o",
    c=df["n_turns"],
    cmap="viridis"
)
plt.title(f"Pokémon Remaining by Opponent for {title}")
plt.xlabel("Opponent")
plt.ylabel("Pokémon Remaining")
plt.legend()
plt.grid(True)
plt.tight_layout()
cbar = plt.colorbar(sc)

cbar.set_label("Battle Length (n_turns)")
plt.savefig(f"{csv_title}/{title}_2.png")


# -----------------------------
# Plot 3: Win rate by Opponent × Battle Length
# -----------------------------
pivot_win = df.pivot_table(
    index="opponent",
    columns="length_category",
    values="win",
    aggfunc="mean"
)

pivot_win.plot(kind="bar", figsize=(10, 5))
plt.title(f"Win Rate by Opponent × Battle Length for {title}")
plt.xlabel("Opponent")
plt.ylabel("Win Rate")
plt.grid(True, axis="y")
plt.tight_layout()
plt.savefig(f"{csv_title}/{title}_3.png")


# -----------------------------
# Plot 4: Learner Pokémon Remaining by Opponent × Battle Length
# -----------------------------
pivot_learner = df.pivot_table(
    index="opponent",
    columns="length_category",
    values="learner_pokemon_remaining",
    aggfunc="mean"
)

pivot_learner.plot(kind="bar", figsize=(10, 5))
plt.title(f"Learner Pokémon Remaining by Opponent × Battle Length for {title}")
plt.xlabel("Opponent")
plt.ylabel("Pokémon Remaining")
plt.grid(True, axis="y")
plt.tight_layout()
plt.savefig(f"{csv_title}/{title}_4.png")


# -----------------------------
# Plot 5: Opponent Pokémon Remaining by Opponent × Battle Length
# -----------------------------
pivot_opp = df.pivot_table(
    index="opponent",
    columns="length_category",
    values="opponent_pokemon_remaining",
    aggfunc="mean"
)

pivot_opp.plot(kind="bar", figsize=(10, 5))
plt.title(f"Opponent Pokémon Remaining by Opponent × Battle Length for {title}")
plt.xlabel("Opponent")
plt.ylabel("Pokémon Remaining")
plt.grid(True, axis="y")
plt.tight_layout()
plt.savefig(f"{csv_title}/{title}_5.png")


# -----------------------------
# Plot 6: Outcome By Battle Length
# -----------------------------

plt.figure(figsize=(8, 5))
df.boxplot(column="n_turns", by="outcome")

plt.title(f"Battle Length Distribution: Wins vs Losses for {title}")
plt.suptitle("")  # Remove the default subtitle
plt.xlabel("Outcome")
plt.ylabel("Number of Turns")
plt.grid(True, axis="y")
plt.savefig(f"{csv_title}/{title}_6.png")


print("\nAnalysis complete.")