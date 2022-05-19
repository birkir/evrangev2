"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollingResistanceForce = void 0;
var g = 9.80665; // earth-surface gravitational acceleration (m/(s^2)
var rollingResistanceForce = function (rollingCoefficient, massOfCarInKg, numberOfWheels) {
    if (numberOfWheels === void 0) { numberOfWheels = 4; }
    // rolling resistance coefficient, chose value in the middle of "Ordinary car tires on concrete interval of .01 to 015"
    var m = massOfCarInKg;
    var Cr = rollingCoefficient;
    var Fr = Cr * (m / (4 / numberOfWheels)) * g;
    return Fr;
};
exports.rollingResistanceForce = rollingResistanceForce;
