"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motorEfficiency = void 0;
var motorEfficiency = function (motorEfficiencyAtMax, motorEfficiencyAtMin, speedInKmPerHourAtMaxMotorEfficiency, speedInKmPerHour) {
    // Rough approximate symmetric parabolic model for motor efficiency over the range of rpms/speed
    // Going from lowest 85% to highest 96% efficiency. Highest at 90 km/h
    var efficiencyAtMax = motorEfficiencyAtMax;
    var efficiencyAtMin = motorEfficiencyAtMin;
    var speedInKmPerHourAtMaxEfficiency = speedInKmPerHourAtMaxMotorEfficiency;
    var factor = efficiencyAtMax - efficiencyAtMin;
    // -0.11(x/90-1)^2+.96
    return (-1 *
        factor *
        Math.pow(speedInKmPerHour / speedInKmPerHourAtMaxEfficiency - 1, 2) +
        efficiencyAtMax);
};
exports.motorEfficiency = motorEfficiency;
