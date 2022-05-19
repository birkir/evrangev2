"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inverterConsumption = void 0;
var inverterConsumption = function (consumptionFromRollingResistance, consumptionFromWindDrag, consumptionFromMotor, dcToACInverterEfficiency) {
    if (dcToACInverterEfficiency === void 0) { dcToACInverterEfficiency = 0.95; }
    var consumptionFromDragTyresAndMotor = consumptionFromRollingResistance +
        consumptionFromWindDrag +
        consumptionFromMotor;
    var consumptionFromDCToAcInverter = consumptionFromDragTyresAndMotor / dcToACInverterEfficiency -
        consumptionFromDragTyresAndMotor;
    return consumptionFromDCToAcInverter; // (Wh/km)
};
exports.inverterConsumption = inverterConsumption;
