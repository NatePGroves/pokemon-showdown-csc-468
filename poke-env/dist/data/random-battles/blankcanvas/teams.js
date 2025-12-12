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
var teams_exports = {};
__export(teams_exports, {
  RandomBLCTeams: () => RandomBLCTeams,
  default: () => teams_default
});
module.exports = __toCommonJS(teams_exports);
var import_teams = require("../gen9/teams");
const RECOVERY_MOVES = [
  "healorder",
  "milkdrink",
  "moonlight",
  "morningsun",
  "recover",
  "roost",
  "shoreup",
  "slackoff",
  "softboiled",
  "strengthsap",
  "synthesis"
];
const PHYSICAL_SETUP = [
  "bellydrum",
  "bulkup",
  "coil",
  "curse",
  "dragondance",
  "honeclaws",
  "howl",
  "meditate",
  "poweruppunch",
  "swordsdance",
  "tidyup",
  "victorydance",
  "filletaway"
];
const SPECIAL_SETUP = [
  "calmmind",
  "chargebeam",
  "geomancy",
  "nastyplot",
  "quiverdance",
  "tailglow",
  "takeheart",
  "torchsong",
  "filletaway"
];
const SPEED_SETUP = [
  "agility",
  "autotomize",
  "flamecharge",
  "rockpolish",
  "trailblaze"
];
const SETUP = [
  "acidarmor",
  "agility",
  "autotomize",
  "bellydrum",
  "bulkup",
  "calmmind",
  "clangoroussoul",
  "coil",
  "cosmicpower",
  "curse",
  "dragondance",
  "filletaway",
  "flamecharge",
  "growth",
  "honeclaws",
  "howl",
  "irondefense",
  "meditate",
  "nastyplot",
  "noretreat",
  "poweruppunch",
  "quiverdance",
  "rockpolish",
  "shellsmash",
  "shiftgear",
  "swordsdance",
  "tailglow",
  "takeheart",
  "tidyup",
  "trailblaze",
  "trickroom",
  "workup",
  "victorydance"
];
const SPEED_CONTROL = [
  "electroweb",
  "glare",
  "icywind",
  "lowsweep",
  "quash",
  "stringshot",
  "tailwind",
  "thunderwave",
  "trickroom"
];
const HAZARDS = [
  "spikes",
  "stealthrock",
  "stickyweb",
  "toxicspikes"
];
const PROTECT_MOVES = [
  "banefulbunker",
  "burningbulwark",
  "protect",
  "silktrap",
  "spikyshield"
];
const PIVOT_MOVES = [
  "chillyreception",
  "flipturn",
  "partingshot",
  "shedtail",
  "teleport",
  "uturn",
  "voltswitch"
];
const MOVE_PAIRS = [
  ["lightscreen", "reflect"],
  ["sleeptalk", "rest"],
  ["protect", "wish"],
  ["leechseed", "protect"],
  ["leechseed", "substitute"],
  ["leechseed", "burningbulwark"]
];
const PRIORITY_POKEMON = [
  "breloom",
  "brutebonnet",
  "cacturne",
  "honchkrow",
  "mimikyu",
  "ragingbolt",
  "scizor"
];
const NO_LEAD_POKEMON = [
  "Zacian",
  "Zamazenta"
];
const DOUBLES_NO_LEAD_POKEMON = [
  "Basculegion",
  "Houndstone",
  "Iron Bundle",
  "Roaring Moon",
  "Zacian",
  "Zamazenta"
];
class RandomBLCTeams extends import_teams.RandomTeams {
  constructor() {
    super(...arguments);
    this.randomSets = require("./random-sets.json");
  }
  cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (moves.size + movePool.length <= this.maxMoveCount) return;
    if (moves.size === this.maxMoveCount - 2) {
      const unpairedMoves = [...movePool];
      for (const pair of MOVE_PAIRS) {
        if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
          this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
          this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
        }
      }
      if (unpairedMoves.length === 1) {
        this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
      }
    }
    if (moves.size === this.maxMoveCount - 1) {
      for (const pair of MOVE_PAIRS) {
        if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
          this.fastPop(movePool, movePool.indexOf(pair[0]));
          this.fastPop(movePool, movePool.indexOf(pair[1]));
        }
      }
    }
    const statusMoves = this.cachedStatusMoves;
    if (teamDetails.screens) {
      if (movePool.includes("auroraveil")) this.fastPop(movePool, movePool.indexOf("auroraveil"));
      if (movePool.length >= this.maxMoveCount + 2) {
        if (movePool.includes("reflect")) this.fastPop(movePool, movePool.indexOf("reflect"));
        if (movePool.includes("lightscreen")) this.fastPop(movePool, movePool.indexOf("lightscreen"));
      }
    }
    if (teamDetails.stickyWeb) {
      if (movePool.includes("stickyweb")) this.fastPop(movePool, movePool.indexOf("stickyweb"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.stealthRock) {
      if (movePool.includes("stealthrock")) this.fastPop(movePool, movePool.indexOf("stealthrock"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.defog || teamDetails.rapidSpin) {
      if (movePool.includes("defog")) this.fastPop(movePool, movePool.indexOf("defog"));
      if (movePool.includes("rapidspin")) this.fastPop(movePool, movePool.indexOf("rapidspin"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.toxicSpikes) {
      if (movePool.includes("toxicspikes")) this.fastPop(movePool, movePool.indexOf("toxicspikes"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.spikes && teamDetails.spikes >= 2) {
      if (movePool.includes("spikes")) this.fastPop(movePool, movePool.indexOf("spikes"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.statusCure) {
      if (movePool.includes("healbell")) this.fastPop(movePool, movePool.indexOf("healbell"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (isDoubles) {
      const doublesIncompatiblePairs = [
        // In order of decreasing generalizability
        [SPEED_CONTROL, SPEED_CONTROL],
        [HAZARDS, HAZARDS],
        ["rockslide", "stoneedge"],
        [SETUP, ["fakeout", "helpinghand"]],
        [PROTECT_MOVES, "wideguard"],
        [["fierydance", "fireblast"], "heatwave"],
        ["dazzlinggleam", ["fleurcannon", "moonblast"]],
        ["poisongas", ["toxicspikes", "willowisp"]],
        [RECOVERY_MOVES, ["healpulse", "lifedew"]],
        ["healpulse", "lifedew"],
        ["haze", "icywind"],
        [["hydropump", "muddywater"], ["muddywater", "scald"]],
        ["disable", "encore"],
        ["freezedry", "icebeam"],
        ["energyball", "leafstorm"],
        ["earthpower", "sandsearstorm"],
        ["coaching", ["helpinghand", "howl"]]
      ];
      for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
      if (role !== "Offensive Protect") this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ["flipturn", "uturn"]);
    }
    const incompatiblePairs = [
      // These moves don't mesh well with other aspects of the set
      [statusMoves, ["healingwish", "switcheroo", "trick"]],
      [SETUP, PIVOT_MOVES],
      [SETUP, HAZARDS],
      [SETUP, ["defog", "nuzzle", "toxic", "yawn", "haze"]],
      [PHYSICAL_SETUP, PHYSICAL_SETUP],
      [SPECIAL_SETUP, "thunderwave"],
      ["substitute", PIVOT_MOVES],
      [SPEED_SETUP, ["aquajet", "rest", "trickroom"]],
      ["curse", ["irondefense", "rapidspin"]],
      ["dragondance", "dracometeor"],
      ["yawn", "roar"],
      ["trick", "uturn"],
      // These attacks are redundant with each other
      [["psychic", "psychicnoise"], ["psyshock", "psychicnoise"]],
      ["surf", ["hydropump", "scald"]],
      ["liquidation", "wavecrash"],
      ["aquajet", "flipturn"],
      ["gigadrain", "leafstorm"],
      ["powerwhip", "hornleech"],
      ["airslash", "hurricane"],
      ["knockoff", "foulplay"],
      ["throatchop", ["crunch", "lashout"]],
      ["doubleedge", ["bodyslam", "headbutt"]],
      [["fireblast", "magmastorm"], ["fierydance", "flamethrower", "lavaplume"]],
      ["thunderpunch", "wildcharge"],
      ["thunderbolt", "discharge"],
      ["gunkshot", ["direclaw", "poisonjab", "sludgebomb"]],
      ["aurasphere", "focusblast"],
      ["closecombat", "drainpunch"],
      [["dragonpulse", "spacialrend"], "dracometeor"],
      ["heavyslam", "flashcannon"],
      ["alluringvoice", "dazzlinggleam"],
      ["defog", "rapidspin"],
      // These status moves are redundant with each other
      ["taunt", "disable"],
      [["thunderwave", "toxic"], ["thunderwave", "willowisp"]],
      [["thunderwave", "toxic", "willowisp"], "toxicspikes"],
      // This space reserved for assorted hardcodes that otherwise make little sense out of context
      // Landorus and Thundurus
      ["nastyplot", ["rockslide", "knockoff"]],
      // Persian
      ["switcheroo", "fakeout"],
      // Amoonguss, though this can work well as a general rule later
      ["toxic", "clearsmog"],
      // Chansey and Blissey
      ["healbell", "stealthrock"],
      // Araquanid and Magnezone
      ["mirrorcoat", ["hydropump", "bodypress"]],
      // Plasmage
      ["electroshot", "psychoboost"],
      // Seaode
      ["stoneedge", "stoneaxe"],
      // Geigeramp
      ["willowisp", "nuzzle"],
      // Martorse
      ["willowisp", "encore"],
      // Faeruin
      ["substitute", "rapidspin"],
      // Geoporka
      ["toxic", "stunspore"],
      // Blobbiam
      ["spiritbreak", "playrough"]
    ];
    for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
    if (!types.includes("Ice")) this.incompatibleMoves(moves, movePool, "icebeam", "icywind");
    if (!isDoubles) this.incompatibleMoves(moves, movePool, "taunt", "encore");
    if (!types.includes("Dark") && teraType !== "Dark") this.incompatibleMoves(moves, movePool, "knockoff", "suckerpunch");
    if (!abilities.includes("Prankster")) this.incompatibleMoves(moves, movePool, "thunderwave", "yawn");
    if (species.id === "barraskewda") {
      this.incompatibleMoves(moves, movePool, ["psychicfangs", "throatchop"], ["poisonjab", "throatchop"]);
    }
    if (species.id === "quagsire") this.incompatibleMoves(moves, movePool, "spikes", "icebeam");
    if (species.id === "cyclizar") this.incompatibleMoves(moves, movePool, "taunt", "knockoff");
    if (species.id === "camerupt") this.incompatibleMoves(moves, movePool, "roar", "willowisp");
    if (species.id === "coalossal") this.incompatibleMoves(moves, movePool, "flamethrower", "overheat");
  }
  randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role) {
    const moves = /* @__PURE__ */ new Set();
    let counter = this.queryMoves(moves, species, teraType, abilities);
    this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);
    if (movePool.length <= this.maxMoveCount) {
      for (const moveid of movePool) {
        moves.add(moveid);
      }
      return moves;
    }
    const runEnforcementChecker = (checkerName) => {
      if (!this.moveEnforcementCheckers[checkerName]) return false;
      return this.moveEnforcementCheckers[checkerName](
        movePool,
        moves,
        abilities,
        types,
        counter,
        species,
        teamDetails,
        isLead,
        isDoubles,
        teraType,
        role
      );
    };
    if (role === "Tera Blast user") {
      counter = this.addMove(
        "terablast",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (species.requiredMove) {
      const move = this.dex.moves.get(species.requiredMove).id;
      counter = this.addMove(
        move,
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (movePool.includes("facade") && abilities.includes("Guts")) {
      counter = this.addMove(
        "facade",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    for (const moveid of ["nightshade", "revelationdance", "revivalblessing", "stickyweb"]) {
      if (movePool.includes(moveid)) {
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (movePool.includes("trickroom") && role === "Doubles Wallbreaker") {
      counter = this.addMove(
        "trickroom",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (role === "Bulky Support" && !teamDetails.defog && !teamDetails.rapidSpin) {
      if (movePool.includes("rapidspin")) {
        counter = this.addMove(
          "rapidspin",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
      if (movePool.includes("defog")) {
        counter = this.addMove(
          "defog",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!isDoubles && types.length === 1 && (types.includes("Normal") || types.includes("Fighting"))) {
      if (movePool.includes("knockoff")) {
        counter = this.addMove(
          "knockoff",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (types.length === 1 && types.includes("Water") && role === "Wallbreaker" && movePool.includes("flipturn")) {
      counter = this.addMove(
        "flipturn",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (species.id === "smeargle") {
      if (movePool.includes("spore")) {
        counter = this.addMove(
          "spore",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (species.id === "fausteil") {
      if (movePool.includes("roost")) {
        counter = this.addMove(
          "roost",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (species.id === "cottentration") {
      if (movePool.includes("sunnyday")) {
        counter = this.addMove(
          "sunnyday",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (species.id === "reversadusa") {
      if (movePool.includes("superpower")) {
        counter = this.addMove(
          "superpower",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (species.id === "ironcrest") {
      if (movePool.includes("closecombat")) {
        counter = this.addMove(
          "closecombat",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (isDoubles) {
      const doublesEnforcedMoves = ["auroraveil", "mortalspin", "spore"];
      for (const moveid of doublesEnforcedMoves) {
        if (movePool.includes(moveid)) {
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
      if (movePool.includes("fakeout") && species.baseStats.spe <= 50) {
        counter = this.addMove(
          "fakeout",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
      if (movePool.includes("tailwind") && (abilities.includes("Prankster") || abilities.includes("Gale Wings"))) {
        counter = this.addMove(
          "tailwind",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
      if (movePool.includes("thunderwave") && abilities.includes("Prankster")) {
        counter = this.addMove(
          "thunderwave",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (["Bulky Attacker", "Bulky Setup", "Wallbreaker", "Doubles Wallbreaker"].includes(role) || PRIORITY_POKEMON.includes(species.id)) {
      const priorityMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (types.includes(moveType) && (move.priority > 0 || moveid === "grassyglide" && abilities.includes("Grassy Surge")) && (move.basePower || move.basePowerCallback)) {
          priorityMoves.push(moveid);
        }
      }
      if (priorityMoves.length) {
        const moveid = this.sample(priorityMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (species.id === "moltres") {
      const typeToEnforce = this.randomChance(1, 2) ? "Fire" : "Flying";
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && typeToEnforce === moveType) {
          stabMoves.push(moveid);
        }
      }
      while (runEnforcementChecker(typeToEnforce)) {
        if (!stabMoves.length) break;
        const moveid = this.sampleNoReplace(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    for (const type of types) {
      if (species.id === "moltres") break;
      if (species.id === "meowscarada") break;
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
          stabMoves.push(moveid);
        }
      }
      while (runEnforcementChecker(type)) {
        if (!stabMoves.length) break;
        const moveid = this.sampleNoReplace(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!counter.get("stabtera") && !["Bulky Support", "Doubles Support"].includes(role) && !abilities.includes("Protean")) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
          stabMoves.push(moveid);
        }
      }
      if (stabMoves.length) {
        const moveid = this.sample(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!counter.get("stab") && !abilities.includes("Protean")) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
          stabMoves.push(moveid);
        }
      }
      if (stabMoves.length) {
        const moveid = this.sample(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (["Bulky Support", "Bulky Attacker", "Bulky Setup"].includes(role)) {
      const recoveryMoves = movePool.filter((moveid) => RECOVERY_MOVES.includes(moveid));
      if (recoveryMoves.length) {
        const moveid = this.sample(recoveryMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (role.includes("Setup") || role === "Tera Blast user") {
      const nonSpeedSetupMoves = movePool.filter((moveid) => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
      if (nonSpeedSetupMoves.length) {
        const moveid = this.sample(nonSpeedSetupMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      } else {
        const setupMoves = movePool.filter((moveid) => SETUP.includes(moveid));
        if (setupMoves.length) {
          const moveid = this.sample(setupMoves);
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    if (role === "Doubles Support") {
      for (const moveid of ["fakeout", "followme", "ragepowder"]) {
        if (movePool.includes(moveid)) {
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    if (role.includes("Protect")) {
      const protectMoves = movePool.filter((moveid) => PROTECT_MOVES.includes(moveid));
      if (protectMoves.length) {
        const moveid = this.sample(protectMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!counter.damagingMoves.size) {
      const attackingMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        if (!this.noStab.includes(moveid) && move.category !== "Status") attackingMoves.push(moveid);
      }
      if (attackingMoves.length) {
        const moveid = this.sample(attackingMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!["AV Pivot", "Fast Support", "Bulky Support", "Bulky Protect", "Doubles Support"].includes(role)) {
      if (counter.damagingMoves.size === 1) {
        const currentAttackType = counter.damagingMoves.values().next().value.type;
        const coverageMoves = [];
        for (const moveid of movePool) {
          const move = this.dex.moves.get(moveid);
          const moveType = this.getMoveType(move, species, abilities, teraType);
          if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
            if (currentAttackType !== moveType) coverageMoves.push(moveid);
          }
        }
        if (coverageMoves.length) {
          const moveid = this.sample(coverageMoves);
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    while (moves.size < this.maxMoveCount && movePool.length) {
      if (moves.size + movePool.length <= this.maxMoveCount) {
        for (const moveid2 of movePool) {
          moves.add(moveid2);
        }
        break;
      }
      const moveid = this.sample(movePool);
      counter = this.addMove(
        moveid,
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
      for (const pair of MOVE_PAIRS) {
        if (moveid === pair[0] && movePool.includes(pair[1])) {
          counter = this.addMove(
            pair[1],
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
        if (moveid === pair[1] && movePool.includes(pair[0])) {
          counter = this.addMove(
            pair[0],
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    return moves;
  }
  getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (!isDoubles) {
      if (role === "Fast Bulky Setup" && (ability === "Quark Drive" || ability === "Protosynthesis")) {
        return "Booster Energy";
      }
      if (species.id === "lokix") {
        return role === "Fast Attacker" ? "Silver Powder" : "Life Orb";
      }
    }
    if (species.requiredItems) {
      if (species.baseSpecies === "Arceus") {
        return species.requiredItems[0];
      }
      return this.sample(species.requiredItems);
    }
    if (role === "AV Pivot") return "Assault Vest";
    if (species.id === "badjur") return "Toxic Orb";
    if (species.id === "vipult" && role === "Bulky Support") return this.sample(["Black Sludge", "Heavy-Duty Boots"]);
    if (species.id === "lundicare" && role === "Fast Bulky Setup" && moves.has("stuffcheeks") || species.id === "devestial" && role === "Bulky Setup") {
      return "Petaya Berry";
    }
    if ([
      "goblantern",
      "lavalisk",
      "eolikopter",
      "scarachnid",
      "bugswarm",
      "leechmonner",
      "hebicikuga",
      "socknbuskn",
      "fausteil",
      "deadward",
      "borealis",
      "flarenheit"
    ].includes(species.id) || species.id === "searytch" && role === "Bulky Attacker" || species.id === "monmothra" && role === "Bulky Support" || ["crystuit", "pinaturbo"].includes(species.id) && role === "Fast Support") {
      return "Heavy-Duty Boots";
    }
    if (["dastard", "geigeramp", "arsenstorm", "jokerpent", "geoporka"].includes(species.id) || species.id === "maldractice" && role === "Bulky Support") {
      return "Black Sludge";
    }
    if (counter.get("skilllink") && ability !== "Skill Link") return "Loaded Dice";
    if (ability === "Sand Stream") return "Smooth Rock";
    if (ability === "Drought" && role !== "Setup Sweeper") return "Heat Rock";
    if (moves.has("meteorbeam") || moves.has("electroshot") && !teamDetails.rain) return "Power Herb";
    if (moves.has("sunnyday") || ["piss", "sculptera"].includes(species.id)) return "Life Orb";
    if (species.id === "plasmage" && moves.has("psychoboost") && role === "Setup Sweeper") return "Eject Pack";
    if (["craggon", "jackoswarm"].includes(species.id)) return this.sample(["Rocky Helmet", "Leftovers"]);
    if (species.id === "thaumaton") return moves.has("steelbeam") ? "Sitrus Berry" : "Air Balloon";
    if (species.id === "kadraoke" && role === "Setup Sweeper") return "Throat Spray";
    if (species.id === "sylravage") return this.sample(["Choice Band", "Choice Scarf"]);
    if (species.id === "capricorrie") return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    if (species.id === "maldractice" && role === "Wallbreaker") {
      return moves.has("dragondance") ? "Black Sludge" : "Choice Band";
    }
    if (species.id === "snabterra" && role === "Wallbreaker") return "Choice Band";
    if (species.id === "snabterra" && role === "Bulky Attacker") return "Heavy-Duty Boots";
    if (species.id === "snabterra" && role === "Bulky Setup") return this.sample(["Leftovers", "Sitrus Berry"]);
    if (species.id === "searytch") return role === "Bulky Support" ? "Leftovers" : "Heavy-Duty Boots";
    if (species.id === "lundicare" && role === "Fast Attacker") return this.sample(["Leftovers", "Earth Plate"]);
    if (species.id === "tryonite" && ability === "Sturdy") return "Leftovers";
    if (species.id === "tryonite" && role === "Setup Sweeper") return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    if (species.id === "ironcrest" && role === "Setup Sweeper") return "White Herb";
    if (species.id === "seaode") return this.sample(["Heavy-Duty Boots", "Life Orb", "Choice Band", "Choice Scarf"]);
    if (["serpvoltidae", "twinkaton", "devestial"].includes(species.id) && role === "Bulky Support") return "Leftovers";
    if (species.id === "serpvoltidae" && role === "Bulky Attacker" && !moves.has("shoreup")) {
      return this.sample(["Choice Specs", "Life Orb"]);
    }
    if (species.id === "serpvoltidae" && role === "Bulky Attacker" && moves.has("shoreup")) return "Life Orb";
    if (species.id === "sheepquake") return this.sample(["Leftovers", "Life Orb"]);
    if (ability === "Flare Boost") return "Flame Orb";
    if (species.id === "sorrowcean" && ability !== "Flare Boost") return "Leftovers";
    if (species.id === "blobbiam" && role === "Bulky Attacker") {
      return this.sample(["Heavy-Duty Boots", "Choice Band", "Choice Scarf"]);
    }
    if (["blobbiam", "massassin", "martorse"].includes(species.id) && role === "Bulky Support" || ["mohawtter", "arachnode", "porcupyre", "bazhigangquan", "actaniathan"].includes(species.id)) {
      return this.sample(["Heavy-Duty Boots", "Leftovers"]);
    }
    if (species.id === "hippaint" && !moves.has("calmmind")) return this.sample(["Choice Specs", "Life Orb"]);
    if (species.id === "hippaint" && moves.has("calmmind")) return "Life Orb";
    if (species.id === "parasike") return this.sample(["Heavy-Duty Boots", "Choice Band", "Silver Powder"]);
    if (species.id === "llanfairwyrm" && role === "Bulky Support") return this.sample(["Rocky Helmet", "Leftovers"]);
    if (species.id === "llanfairwyrm" && role === "Bulky Setup") return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    if (species.id === "karmalice") {
      return moves.has("fakeout") || role === "Fast Support" ? "Heavy-Duty Boots" : "Choice Specs";
    }
    if (species.id === "reversadusa" && !moves.has("substitute")) return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    if (species.id === "reversadusa" && moves.has("substitute")) return "Leftovers";
    if (species.id === "primordialith" && ability === "Vital Spirit") return "Leftovers";
    if (["frostengu", "monmothra", "drakkannon"].includes(species.id) && role === "Fast Attacker") {
      return this.sample(["Choice Specs", "Choice Scarf"]);
    }
    if (species.id === "frostengu" && role === "Wallbreaker") return this.sample(["Choice Band", "Choice Scarf"]);
    if (species.id === "sleetshell" && role === "Fast Attacker") return this.sample(["Choice Band", "Choice Scarf"]);
    if (["martorse", "faeruin"].includes(species.id) && role === "Fast Support") {
      return this.sample(["Heavy-Duty Boots", "Leftovers"]);
    }
    if (species.id === "martorse" && role === "Fast Attacker") return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    if (species.id === "freightmare") return role === "Fast Support" ? "Leftovers" : "Life Orb";
    if (species.id === "faeruin" && role === "Setup Sweeper" && !moves.has("substitute")) {
      return this.sample(["Heavy-Duty Boots", "Life Orb"]);
    }
    if (species.id === "faeruin" && role === "Setup Sweeper" && moves.has("substitute")) return "Leftovers";
    if (species.id === "haarstorm") {
      if (role === "Fast Attacker") return "Choice Scarf";
      if (role === "Bulky Support") return "Leftovers";
      if (role === "Fast Support") return "Life Orb";
    }
    if (species.id === "bulionage") return this.sample(["Leftovers", "Clear Amulet"]);
    if (["fettogre", "copperhead", "psyllapse", "obaki"].includes(species.id)) return "Leftovers";
    if (species.id === "crystuit" && role === "Fast Attacker") return this.sample(["Choice Specs", "Choice Scarf"]);
    if (species.id === "odonata") return this.sample(["Heavy-Duty Boots", "Lum Berry"]);
    if (species.id === "yamateraph") return this.sample(["Leftovers", "Lum Berry"]);
    if (species.id === "wizhazard") {
      if (role === "Wallbreaker") return "Choice Specs";
      if (role === "Bulky Setup") return "Leftovers";
    }
    if (species.id === "groundead") return role === "Wallbreaker" ? "Choice Band" : "Leftovers";
    if (species.id === "bellolysk") {
      if (role === "Bulky Setup" || role === "Bulky Support") return "Leftovers";
      if (role === "Wallbreaker") return "Life Orb";
    }
    if (species.id === "bufferfly" && role === "Bulky Setup") return "Leftovers";
    if (species.id === "versalyre") return "Choice Scarf";
    if (species.id === "pinaturbo" && role === "Wallbreaker") return "Life Orb";
    if (species.id === "brasspecter") {
      if (role === "Bulky Attacker") return "Choice Band";
      if (role === "Bulky Setup") return "Leftovers";
    }
    if (species.id === "cottentration" && role !== "Wallbreaker") return "Leftovers";
    if ((ability === "Guts" || moves.has("facade")) && !moves.has("sleeptalk")) {
      return types.includes("Fire") || ability === "Toxic Boost" || ability === "Poison Heal" ? "Toxic Orb" : "Flame Orb";
    }
    if (ability === "Magic Guard" || ability === "Sheer Force" && counter.get("sheerforce")) return "Life Orb";
    if (["healingwish", "switcheroo", "trick"].some((m) => moves.has(m))) {
      if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && role !== "Wallbreaker" && role !== "Doubles Wallbreaker" && !counter.get("priority")) {
        return "Choice Scarf";
      } else {
        return counter.get("Physical") > counter.get("Special") ? "Choice Band" : "Choice Specs";
      }
    }
    if (role === "Wallbreaker" && counter.get("Physical") > counter.get("Special") && !counter.get("Status")) {
      return "Choice Band";
    }
    if (role === "Wallbreaker" && counter.get("Physical") < counter.get("Special") && !counter.get("Status")) {
      return "Choice Specs";
    }
    if (ability === "Poison Heal" || ability === "Quick Feet") return "Toxic Orb";
    if (moves.has("acrobatics") && ability !== "Quark Drive" && ability !== "Protosynthesis") return "";
    if (moves.has("auroraveil") || moves.has("lightscreen") && moves.has("reflect")) return "Light Clay";
    if (ability === "Gluttony") return `${this.sample(["Aguav", "Figy", "Iapapa", "Mago", "Wiki"])} Berry`;
    if (["Cheek Pouch", "Cud Chew", "Harvest", "Ripen"].some((m) => ability === m) || moves.has("bellydrum") || moves.has("filletaway")) {
      return "Sitrus Berry";
    }
    if (this.dex.getEffectiveness("Rock", species) >= 2) return "Heavy-Duty Boots";
    if (species.nfe) return "Eviolite";
  }
  randomSet(s, teamDetails = {}, isLead = false, isDoubles = false) {
    const species = this.dex.species.get(s);
    const forme = this.getForme(species);
    const sets = this.randomSets[species.id]["sets"];
    const possibleSets = [];
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    for (const set2 of sets) {
      const abilities2 = set2.abilities;
      if (isLead && (abilities2.includes("Protosynthesis") || abilities2.includes("Quark Drive")) && set2.role === "Fast Bulky Setup") continue;
      if ((teamDetails.teraBlast || ruleTable.has("terastalclause")) && set2.role === "Tera Blast user") {
        continue;
      }
      possibleSets.push(set2);
    }
    const set = this.sampleIfArray(possibleSets);
    const role = set.role;
    const movePool = [];
    for (const movename of set.movepool) {
      movePool.push(this.dex.moves.get(movename).id);
    }
    const teraTypes = set.teraTypes;
    let teraType = this.sampleIfArray(teraTypes);
    let ability = "";
    let item = void 0;
    const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
    const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    const types = species.types;
    const abilities = set.abilities;
    const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
    const counter = this.queryMoves(moves, species, teraType, abilities);
    ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);
    item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
    if (item === void 0) {
      if (isDoubles) {
        item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
      } else {
        item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
      }
    }
    const level = this.getLevel(species, isDoubles);
    const srImmunity = ability === "Magic Guard" || item === "Heavy-Duty Boots";
    let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness("Rock", species);
    if (["axekick", "highjumpkick", "jumpkick"].some((m) => moves.has(m))) srWeakness = 2;
    while (evs.hp > 1) {
      const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
      if (moves.has("substitute") && ["Sitrus Berry", "Salac Berry"].includes(item)) {
        if (hp % 4 === 0) break;
      } else if ((moves.has("bellydrum") || moves.has("filletaway")) && (item === "Sitrus Berry" || ability === "Gluttony")) {
        if (hp % 2 === 0) break;
      } else if (moves.has("substitute") && moves.has("endeavor")) {
        if (hp % 4 > 0) break;
      } else {
        if (srWeakness <= 0 || ability === "Regenerator" || ["Leftovers", "Life Orb", "Eviolite"].includes(item)) break;
        if (item !== "Sitrus Berry" && hp % (4 / srWeakness) > 0) break;
        if (item === "Sitrus Berry" && hp % (4 / srWeakness) === 0) break;
      }
      evs.hp -= 4;
    }
    const noAttackStatMoves = [...moves].every((m) => {
      const move = this.dex.moves.get(m);
      if (move.damageCallback || move.damage) return true;
      if (move.id === "shellsidearm") return false;
      if (move.id === "terablast" && (species.id === "porygon2" || moves.has("shiftgear") || species.baseStats.atk > species.baseStats.spa)) return false;
      return move.category !== "Physical" || move.id === "bodypress" || move.id === "foulplay";
    });
    if (noAttackStatMoves && !moves.has("transform") && this.format.mod !== "partnersincrime" && species.id !== "illumise") {
      evs.atk = 0;
      ivs.atk = 0;
    }
    if (this.forceTeraType) teraType = this.forceTeraType;
    const shuffledMoves = Array.from(moves);
    this.prng.shuffle(shuffledMoves);
    return {
      name: species.baseSpecies,
      species: forme,
      gender: species.baseSpecies === "Greninja" ? "M" : species.gender || (this.random(2) ? "F" : "M"),
      shiny: this.randomChance(1, 1024),
      level,
      moves: shuffledMoves,
      ability,
      evs,
      ivs,
      item,
      teraType,
      role
    };
  }
  randomBLCTeam() {
    this.enforceNoDirectCustomBanlistChanges();
    const seed = this.prng.getSeed();
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    const pokemon = [];
    const isMonotype = !!this.forceMonotype || ruleTable.has("sametypeclause");
    const isDoubles = this.format.gameType !== "singles";
    const typePool = this.dex.types.names().filter((name) => name !== "Stellar");
    const type = this.forceMonotype || this.sample(typePool);
    const baseFormes = {};
    const typeCount = {};
    const typeComboCount = {};
    const typeWeaknesses = {};
    const typeDoubleWeaknesses = {};
    const teamDetails = {};
    let numMaxLevelPokemon = 0;
    const pokemonList = Object.keys(this.randomSets);
    const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
    let leadsRemaining = this.format.gameType === "doubles" ? 2 : 1;
    while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
      const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
      const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
      if (!species.exists) continue;
      if (baseFormes[species.baseSpecies]) continue;
      if (["ogerpon", "ogerponhearthflame", "terapagos"].includes(species.id) && teamDetails.teraBlast) continue;
      if (species.baseSpecies === "Sorrowcean" && pokemon.length >= this.maxTeamSize - 1) continue;
      const types = species.types;
      const typeCombo = types.slice().sort().join();
      const weakToFreezeDry = this.dex.getEffectiveness("Ice", species) > 0 || this.dex.getEffectiveness("Ice", species) > -2 && types.includes("Water");
      const limitFactor = Math.round(this.maxTeamSize / 6) || 1;
      if (!isMonotype && !this.forceMonotype) {
        let skip = false;
        for (const typeName of types) {
          if (typeCount[typeName] >= 2 * limitFactor) {
            skip = true;
            break;
          }
        }
        if (skip) continue;
        for (const typeName of this.dex.types.names()) {
          if (this.dex.getEffectiveness(typeName, species) > 0) {
            if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
            if (typeWeaknesses[typeName] >= 3 * limitFactor) {
              skip = true;
              break;
            }
          }
          if (this.dex.getEffectiveness(typeName, species) > 1) {
            if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
            if (typeDoubleWeaknesses[typeName] >= 1 * Number(limitFactor)) {
              skip = true;
              break;
            }
          }
        }
        if (skip) continue;
        if (this.dex.getEffectiveness("Fire", species) === 0 && Object.values(species.abilities).filter((a) => ["Dry Skin", "Fluffy"].includes(a)).length) {
          if (!typeWeaknesses["Fire"]) typeWeaknesses["Fire"] = 0;
          if (typeWeaknesses["Fire"] >= 3 * limitFactor) continue;
        }
        if (weakToFreezeDry) {
          if (!typeWeaknesses["Freeze-Dry"]) typeWeaknesses["Freeze-Dry"] = 0;
          if (typeWeaknesses["Freeze-Dry"] >= 4 * limitFactor) continue;
        }
        if (!this.adjustLevel && this.getLevel(species, isDoubles) === 100 && numMaxLevelPokemon >= limitFactor) {
          continue;
        }
      }
      if (!this.forceMonotype && isMonotype && typeComboCount[typeCombo] >= 3 * limitFactor) continue;
      let set;
      if (leadsRemaining) {
        if (isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) || !isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)) {
          if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
          set = this.randomSet(species, teamDetails, false, isDoubles);
          pokemon.push(set);
        } else {
          set = this.randomSet(species, teamDetails, true, isDoubles);
          pokemon.unshift(set);
          leadsRemaining--;
        }
      } else {
        set = this.randomSet(species, teamDetails, false, isDoubles);
        pokemon.push(set);
      }
      if (pokemon.length === this.maxTeamSize) break;
      baseFormes[species.baseSpecies] = 1;
      for (const typeName of types) {
        if (typeName in typeCount) {
          typeCount[typeName]++;
        } else {
          typeCount[typeName] = 1;
        }
      }
      if (typeCombo in typeComboCount) {
        typeComboCount[typeCombo]++;
      } else {
        typeComboCount[typeCombo] = 1;
      }
      for (const typeName of this.dex.types.names()) {
        if (this.dex.getEffectiveness(typeName, species) > 0) {
          typeWeaknesses[typeName]++;
        }
        if (this.dex.getEffectiveness(typeName, species) > 1) {
          typeDoubleWeaknesses[typeName]++;
        }
      }
      if (["Dry Skin", "Fluffy"].includes(set.ability) && this.dex.getEffectiveness("Fire", species) === 0) {
        typeWeaknesses["Fire"]++;
      }
      if (weakToFreezeDry) typeWeaknesses["Freeze-Dry"]++;
      if (set.level === 100) numMaxLevelPokemon++;
      if (set.ability === "Drizzle" || set.moves.includes("raindance")) teamDetails.rain = 1;
      if (set.ability === "Drought" || set.ability === "Orichalcum Pulse" || set.moves.includes("sunnyday")) {
        teamDetails.sun = 1;
      }
      if (set.ability === "Sand Stream") teamDetails.sand = 1;
      if (set.ability === "Snow Warning" || set.moves.includes("snowscape") || set.moves.includes("chillyreception")) {
        teamDetails.snow = 1;
      }
      if (set.moves.includes("healbell")) teamDetails.statusCure = 1;
      if (set.moves.includes("spikes") || set.moves.includes("ceaselessedge")) {
        teamDetails.spikes = (teamDetails.spikes || 0) + 1;
      }
      if (set.moves.includes("toxicspikes") || set.ability === "Toxic Debris") teamDetails.toxicSpikes = 1;
      if (set.moves.includes("stealthrock") || set.moves.includes("stoneaxe")) teamDetails.stealthRock = 1;
      if (set.moves.includes("stickyweb")) teamDetails.stickyWeb = 1;
      if (set.moves.includes("defog")) teamDetails.defog = 1;
      if (set.moves.includes("rapidspin") || set.moves.includes("mortalspin")) teamDetails.rapidSpin = 1;
      if (set.moves.includes("auroraveil") || set.moves.includes("reflect") && set.moves.includes("lightscreen")) {
        teamDetails.screens = 1;
      }
      if (set.role === "Tera Blast user" || species.baseSpecies === "Ogerpon" || species.baseSpecies === "Terapagos") {
        teamDetails.teraBlast = 1;
      }
    }
    if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
      throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
    }
    return pokemon;
  }
}
var teams_default = RandomBLCTeams;
//# sourceMappingURL=teams.js.map
