"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inclineConsumption = void 0;
var standardAccelerationDueToGravity = 9.8; // (m/(s^2)i)
var joulesPerWattHour = 3600;
var inclineConsumption = function (inclineInPercent, massOfCarInKg) {
    // Calculating consumption per 1 km
    var heightGainInMPerKm = (inclineInPercent / 100) * 1000; // (m)
    var potentialEnergyPerKm = heightGainInMPerKm * massOfCarInKg * standardAccelerationDueToGravity; // (J)
    var consumptionFromIncline = potentialEnergyPerKm / joulesPerWattHour; // (Wh/km)
    return consumptionFromIncline; // (Wh/km)
};
exports.inclineConsumption = inclineConsumption;
