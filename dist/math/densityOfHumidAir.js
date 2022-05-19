"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.densityOfHumidAir = void 0;
var Rd = 287.058; // Specific gas constant for dry air (J/(kg*K))
var Rv = 461.495; // Specific gas constant for water vapor (J/(kg*K))
var Md = 0.028964; // Molar mass of dry air (kg/mol)
var Mv = 0.018016; // Molar mass of water vapor (kg/mol)
var R = 8.31447; // udeal universal gas constant (J/(mol*K))
var L = 0.0065; // Temperature lapse rate (K/m)
var g = 9.80665; // earth-surface gravitational acceleration (m/(s^2)
var pressureWithDeltaHeight = function (p0, T0, M, h) {
    var p = p0 * Math.pow(1 - (L * h) / T0, (g * M) / (R * L));
    return p;
};
var temperatureInKelvin = function (temperatureInCelcius) {
    return temperatureInCelcius + 273.15;
};
var densityOfHumidAir = function (temperatureInCelcius, relativeHumidity, absoluteAirPressureInPascal, heightAboveReference) {
    // https://en.wikipedia.org/wiki/Density_of_air
    var Tcelsius = temperatureInCelcius;
    var T = temperatureInKelvin(temperatureInCelcius);
    // const psat = 6.1078 * 10^(7.5 * Tcelsius / (Tcelsius + 237.3)) * 100; // Saturation vapor pressure of water (Pa)
    var psat = 6.1078 * Math.pow(10, (7.5 * Tcelsius) / (Tcelsius + 237.3)) * 100; // Saturation vapor pressure of water (Pa)
    var phi = relativeHumidity / 100; // Get ration instead of %
    var pv = phi * psat; // Vapor pressure of water
    var p = absoluteAirPressureInPascal; // Absolute air pressure (Pa)
    var pd = p - pv; // Partial pressure of dry air (Pa)
    var h = heightAboveReference;
    var pdAtHeight = pressureWithDeltaHeight(pd, T, Md, h);
    var pvAtHeight = pressureWithDeltaHeight(pv, T, Mv, h);
    var densityOfHumidAirAdjustedForHeight = pdAtHeight / (Rd * T) + pvAtHeight / (Rv * T);
    return densityOfHumidAirAdjustedForHeight;
};
exports.densityOfHumidAir = densityOfHumidAir;
