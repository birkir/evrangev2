"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batteryDischargeConsumption = void 0;
// Discharge efficiency. Rouch guess inspired of https://batteryuniversity.com/learn/article/bu_808c_coulombic_and_energy_efficiency_with_the_battery
var batteryDischargeConsumption = function (consumptionFromRollingResistance, consumptionFromWindDrag, consumptionFromMotor, consumptionFromDCToAcInverter, batteryDischargeEfficiency) {
    if (batteryDischargeEfficiency === void 0) { batteryDischargeEfficiency = 0.9; }
    var consumptionFromDragTyresMotorAndInverter = consumptionFromRollingResistance +
        consumptionFromWindDrag +
        consumptionFromMotor +
        consumptionFromDCToAcInverter;
    var consumptionFromBatteryDischarge = consumptionFromDragTyresMotorAndInverter / batteryDischargeEfficiency -
        consumptionFromDragTyresMotorAndInverter;
    return consumptionFromBatteryDischarge; // (Wh/km)
};
exports.batteryDischargeConsumption = batteryDischargeConsumption;
