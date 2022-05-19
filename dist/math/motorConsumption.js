"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motorConsumption = void 0;
var motorConsumption = function (consumptionFromRollingResistance, consumptionFromWindDrag, motorEfficiency) {
    var consumptionFromDragAndTyres = consumptionFromRollingResistance + consumptionFromWindDrag;
    var consumptionFromMotor = consumptionFromDragAndTyres / motorEfficiency - consumptionFromDragAndTyres;
    return consumptionFromMotor; // (Wh/km)
};
exports.motorConsumption = motorConsumption;
