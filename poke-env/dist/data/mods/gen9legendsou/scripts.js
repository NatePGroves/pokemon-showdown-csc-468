"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var scripts_exports = {};
__export(scripts_exports, {
  Scripts: () => Scripts
});
module.exports = __toCommonJS(scripts_exports);
const Scripts = {
  gen: 9,
  inherit: "gen9legends",
  init() {
    const legalItems = [
      "assaultvest",
      "bigroot",
      "blackbelt",
      "blackglasses",
      "charcoal",
      "dragonfang",
      "eviolite",
      "expertbelt",
      "fairyfeather",
      "focusband",
      "focussash",
      "hardstone",
      "kingsrock",
      "leftovers",
      "lifeorb",
      "lightball",
      "magnet",
      "metalcoat",
      "miracleseed",
      "muscleband",
      "mysticwater",
      "nevermeltice",
      "normalgem",
      "poisonbarb",
      "poweranklet",
      "powerband",
      "powerbelt",
      "powerbracer",
      "powerlens",
      "powerweight",
      "quickclaw",
      "rockyhelmet",
      "scopelens",
      "sharpbeak",
      "shellbell",
      "silkscarf",
      "silverpowder",
      "softsand",
      "spelltag",
      "twistedspoon",
      "weaknesspolicy",
      "whiteherb",
      "wiseglasses",
      "bottlecap",
      "goldbottlecap",
      "dawnstone",
      "duskstone",
      "firestone",
      "galaricacuff",
      "galaricawreath",
      "icestone",
      "leafstone",
      "moonstone",
      "sachet",
      "shinystone",
      "sunstone",
      "thunderstone",
      "waterstone",
      "whippeddream",
      "bignugget"
    ];
    const legalBerries = [
      "aspearberry",
      "babiriberry",
      "chartiberry",
      "cheriberry",
      "chestoberry",
      "chilanberry",
      "chopleberry",
      "cobaberry",
      "colburberry",
      "grepaberry",
      "habanberry",
      "hondewberry",
      "kasibberry",
      "kebiaberry",
      "kelpsyberry",
      "lumberry",
      "occaberry",
      "oranberry",
      "passhoberry",
      "payapaberry",
      "pechaberry",
      "persimberry",
      "pomegberry",
      "qualotberry",
      "rawstberry",
      "rindoberry",
      "roseliberry",
      "shucaberry",
      "sitrusberry",
      "tamatoberry",
      "tangaberry",
      "wacanberry",
      "yacheberry"
    ];
    const votedLegalitems = [
      "heavydutyboots",
      "choiceband",
      "choicescarf",
      "choicespecs"
    ];
    for (const i in this.data.Items) {
      if (this.data.Items[i].isNonstandard === "CAP" || this.data.Items[i].isNonstandard === "Custom") continue;
      if ([...legalItems, ...votedLegalitems, ...legalBerries].includes(i) || this.data.Items[i].megaStone) {
        if (["blazikenite", "swampertite", "sceptilite"].includes(i)) continue;
        this.modData("Items", i).isNonstandard = null;
      } else {
        this.modData("Items", i).isNonstandard = "Past";
      }
    }
    for (const i in this.data.Moves) {
      if (this.data.Moves[i].isNonstandard !== "Past") continue;
      this.modData("Moves", i).isNonstandard = null;
    }
  },
  pokemon: {
    isGrounded(negateImmunity = false) {
      if ("gravity" in this.battle.field.pseudoWeather) return true;
      if ("ingrain" in this.volatiles && this.battle.gen >= 4) return true;
      if ("smackdown" in this.volatiles) return true;
      const item = this.ignoringItem() ? "" : this.item;
      if (item === "ironball") return true;
      if (!negateImmunity && this.hasType("Flying") && !(this.hasType("???") && "roost" in this.volatiles)) return false;
      if (this.hasAbility(["levitate", "ionbattery"]) && !this.battle.suppressingAbility(this)) return null;
      if ("magnetrise" in this.volatiles) return false;
      if ("telekinesis" in this.volatiles) return false;
      return item !== "airballoon";
    }
  },
  actions: {
    canMegaEvo(pokemon) {
      const species = pokemon.baseSpecies;
      const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
      const item = pokemon.getItem();
      if ((this.battle.gen <= 7 || this.battle.ruleTable.has("+pokemontag:past") || this.battle.ruleTable.has("+pokemontag:future")) && altForme?.isMega && altForme?.requiredMove && pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
        return altForme.name;
      }
      if (item.megaEvolves === species.name) {
        return item.megaStone;
      }
      return null;
    },
    runMegaEvo(pokemon) {
      const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
      if (!speciesid) return false;
      pokemon.formeChange(speciesid, pokemon.getItem(), true);
      const wasMega = pokemon.canMegaEvo;
      for (const ally of pokemon.side.pokemon) {
        if (wasMega) {
          ally.canMegaEvo = false;
        } else {
          ally.canUltraBurst = null;
        }
      }
      if (speciesid === "Zygarde-Mega") {
        const coreEnforcer = pokemon.moveSlots.findIndex((x) => x.id === "coreenforcer");
        if (coreEnforcer >= 0) {
          const nihilLight = this.battle.dex.moves.get("nihillight");
          pokemon.moveSlots[coreEnforcer] = pokemon.baseMoveSlots[coreEnforcer] = {
            id: nihilLight.id,
            move: nihilLight.name,
            pp: pokemon.moveSlots[coreEnforcer].pp,
            maxpp: pokemon.moveSlots[coreEnforcer].maxpp,
            disabled: false,
            used: false
          };
        }
      }
      this.battle.runEvent("AfterMega", pokemon);
      return true;
    },
    modifyDamage(baseDamage, pokemon, target, move, suppressMessages = false) {
      const tr = this.battle.trunc;
      if (!move.type) move.type = "???";
      const type = move.type;
      baseDamage += 2;
      if (move.spreadHit) {
        const spreadModifier = this.battle.gameType === "freeforall" ? 0.5 : 0.75;
        this.battle.debug(`Spread modifier: ${spreadModifier}`);
        baseDamage = this.battle.modify(baseDamage, spreadModifier);
      } else if (move.multihitType === "parentalbond" && move.hit > 1) {
        const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
        this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
        baseDamage = this.battle.modify(baseDamage, bondModifier);
      } else if (move.multihitType === "brassbond" && move.hit > 1) {
        const bondModifier = 0.15;
        this.battle.debug(`Brass Bond modifier: ${bondModifier}`);
        baseDamage = this.battle.modify(baseDamage, bondModifier);
      }
      baseDamage = this.battle.runEvent("WeatherModifyDamage", pokemon, target, move, baseDamage);
      const isCrit = target.getMoveHitData(move).crit;
      if (isCrit) {
        baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
      }
      baseDamage = this.battle.randomizer(baseDamage);
      if (type !== "???") {
        let stab = 1;
        const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
        if (isSTAB) {
          stab = 1.5;
        }
        if (pokemon.terastallized === "Stellar") {
          if (!pokemon.stellarBoostedTypes.includes(type) || move.stellarBoosted) {
            stab = isSTAB ? 2 : [4915, 4096];
            move.stellarBoosted = true;
            if (pokemon.species.name !== "Terapagos-Stellar") {
              pokemon.stellarBoostedTypes.push(type);
            }
          }
        } else {
          if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
            stab = 2;
          }
          stab = this.battle.runEvent("ModifySTAB", pokemon, target, move, stab);
        }
        baseDamage = this.battle.modify(baseDamage, stab);
      }
      let typeMod = target.runEffectiveness(move);
      typeMod = this.battle.clampIntRange(typeMod, -6, 6);
      target.getMoveHitData(move).typeMod = typeMod;
      if (typeMod > 0) {
        if (!suppressMessages) this.battle.add("-supereffective", target);
        for (let i = 0; i < typeMod; i++) {
          baseDamage *= 2;
        }
      }
      if (typeMod < 0) {
        if (!suppressMessages) this.battle.add("-resisted", target);
        for (let i = 0; i > typeMod; i--) {
          baseDamage = tr(baseDamage / 2);
        }
      }
      if (isCrit && !suppressMessages) this.battle.add("-crit", target);
      if (pokemon.status === "brn" && move.category === "Physical" && !pokemon.hasAbility("guts")) {
        if (this.battle.gen < 6 || move.id !== "facade") {
          baseDamage = this.battle.modify(baseDamage, 0.5);
        }
      }
      if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;
      baseDamage = this.battle.runEvent("ModifyDamage", pokemon, target, move, baseDamage);
      if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
        baseDamage = this.battle.modify(baseDamage, 0.25);
        this.battle.add("-zbroken", target);
      }
      if (this.battle.gen !== 5 && !baseDamage) return 1;
      return tr(baseDamage, 16);
    }
  }
};
//# sourceMappingURL=scripts.js.map
