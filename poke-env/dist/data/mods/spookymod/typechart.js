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
var typechart_exports = {};
__export(typechart_exports, {
  TypeChart: () => TypeChart
});
module.exports = __toCommonJS(typechart_exports);
const TypeChart = {
  ark: {
    damageTaken: {
      Bug: 1,
      Dark: 2,
      Dragon: 0,
      Electric: 0,
      Fairy: 1,
      Fighting: 1,
      Fire: 0,
      Flying: 0,
      Ghost: 2,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 3,
      Rock: 0,
      Steel: 0,
      Water: 0
    }
  },
  critcele: {
    damageTaken: {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 1,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 1,
      Ghost: 0,
      Grass: 0,
      Ground: 2,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 1,
      Water: 0
    }
  },
  pdark: {
    damageTaken: {
      Bug: 1,
      Dark: 2,
      Dragon: 0,
      Electric: 0,
      Fairy: 1,
      Fighting: 1,
      Fire: 0,
      Flying: 0,
      Ghost: 2,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 2,
      Psychic: 3,
      Rock: 0,
      Steel: 0,
      Water: 0
    }
  },
  prock: {
    damageTaken: {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 1,
      Fire: 2,
      Flying: 2,
      Ghost: 0,
      Grass: 1,
      Ground: 1,
      Ice: 0,
      Normal: 2,
      Poison: 2,
      Psychic: 2,
      Rock: 0,
      Steel: 1,
      Water: 1
    }
  },
  retaw: {
    damageTaken: {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 2,
      Fairy: 0,
      Fighting: 0,
      Fire: 1,
      Flying: 0,
      Ghost: 0,
      Grass: 2,
      Ground: 0,
      Ice: 1,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 1,
      Water: 1
    }
  }
};
//# sourceMappingURL=typechart.js.map
