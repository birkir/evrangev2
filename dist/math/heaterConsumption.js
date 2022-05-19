"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heaterConsumption = void 0;
var joulesPerWattHour = 3600; // (J/Wh)
var heaterConsumption = function (heaterAcPower, speedInMperSecond) {
    var secondsForOneKm = 1000 / speedInMperSecond; // (s)
    var joulesForOneKm = heaterAcPower * secondsForOneKm; // (J/km)
    var consumption = joulesForOneKm / joulesPerWattHour; // (Wh/km);
    return consumption || 0;
};
exports.heaterConsumption = heaterConsumption;
