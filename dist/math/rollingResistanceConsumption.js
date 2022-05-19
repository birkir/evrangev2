"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollingResistanceConsumption = void 0;
var rollingResistanceForce_1 = require("./rollingResistanceForce");
var s = 1000; // displacement distance (m)
var joulesPerWattHour = 3600; // (J/Wh)
var rollingResistanceConsumption = function (rollingResistanceCoefficient, massOfCarInKg) {
    var Fr = (0, rollingResistanceForce_1.rollingResistanceForce)(rollingResistanceCoefficient, massOfCarInKg);
    var W = Fr * s; // Work done (J)
    var workInWattHours = W / joulesPerWattHour; // (Wh)
    return workInWattHours;
};
exports.rollingResistanceConsumption = rollingResistanceConsumption;
