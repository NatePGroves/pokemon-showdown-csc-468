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
var moves_exports = {};
__export(moves_exports, {
  Moves: () => Moves
});
module.exports = __toCommonJS(moves_exports);
const Moves = {
  gearup: {
    inherit: true,
    onHitSide(side, source, move) {
      const targets = side.allies().filter((target) => target.hasAbility(["plus", "minus", "magneticflux"]) && (!target.volatiles["maxguard"] || this.runEvent("TryHit", target, source, move)));
      if (!targets.length) return false;
      let didSomething = false;
      for (const target of targets) {
        didSomething = this.boost({ atk: 1, spa: 1 }, target, source, move, false, true) || didSomething;
      }
      return didSomething;
    }
  },
  magneticflux: {
    inherit: true,
    onHitSide(side, source, move) {
      const targets = side.allies().filter((target) => target.hasAbility(["plus", "minus", "magneticflux"]) && (!target.volatiles["maxguard"] || this.runEvent("TryHit", target, source, move)));
      if (!targets.length) return false;
      let didSomething = false;
      for (const target of targets) {
        didSomething = this.boost({ def: 1, spd: 1 }, target, source, move, false, true) || didSomething;
      }
      return didSomething;
    }
  },
  smackdown: {
    inherit: true,
    condition: {
      noCopy: true,
      onStart(pokemon) {
        let applies = false;
        if (pokemon.hasType("Flying") || pokemon.hasAbility(["levitate", "ionbattery"])) applies = true;
        if (pokemon.hasItem("ironball") || pokemon.volatiles["ingrain"] || this.field.getPseudoWeather("gravity")) applies = false;
        if (pokemon.removeVolatile("fly") || pokemon.removeVolatile("bounce")) {
          applies = true;
          this.queue.cancelMove(pokemon);
          pokemon.removeVolatile("twoturnmove");
        }
        if (pokemon.volatiles["magnetrise"]) {
          applies = true;
          delete pokemon.volatiles["magnetrise"];
        }
        if (pokemon.volatiles["telekinesis"]) {
          applies = true;
          delete pokemon.volatiles["telekinesis"];
        }
        if (!applies) return false;
        this.add("-start", pokemon, "Smack Down");
      },
      onRestart(pokemon) {
        if (pokemon.removeVolatile("fly") || pokemon.removeVolatile("bounce")) {
          this.queue.cancelMove(pokemon);
          pokemon.removeVolatile("twoturnmove");
          this.add("-start", pokemon, "Smack Down");
        }
      }
      // groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
    }
  }
};
//# sourceMappingURL=moves.js.map
