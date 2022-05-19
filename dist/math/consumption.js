"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateConsumption = void 0;
var batteryDischargeConsumption_1 = require("./batteryDischargeConsumption");
var densityOfHumidAir_1 = require("./densityOfHumidAir");
var heaterConsumption_1 = require("./heaterConsumption");
var inclineConsumption_1 = require("./inclineConsumption");
var inverterConsumption_1 = require("./inverterConsumption");
var motorConsumption_1 = require("./motorConsumption");
var motorEfficiency_1 = require("./motorEfficiency");
var rollingResistanceConsumption_1 = require("./rollingResistanceConsumption");
var windDragConsumption_1 = require("./windDragConsumption");
function calculateConsumption(input) {
    var speedInMsec = (input.speedInKmPerHour * 1000) / 3600;
    var airDensity = (0, densityOfHumidAir_1.densityOfHumidAir)(input.temperatureInCelcius, input.relativeHumidity, input.absoluteAirPressureInPascal, input.heightAboveReference);
    var calculatedMotorEfficiency = (0, motorEfficiency_1.motorEfficiency)(input.motorEfficiencyAtMax, input.motorEfficiencyAtMin, input.speedInKmPerHourAtMaxMotorEfficiency, input.speedInKmPerHour);
    var calculatedRollingResistanceConsumption = (0, rollingResistanceConsumption_1.rollingResistanceConsumption)(input.rollingCoefficient, input.massOfVehicleInKg);
    var angle = (input.cardinalDirection - input.windDirection) % 360;
    var x = Math.cos((Math.PI * 2 * angle) / 360);
    var angleWindSpeed = x * input.windSpeed;
    var adjustedWindSpeed = speedInMsec - angleWindSpeed;
    var calculatedWindDragConsumption = (0, windDragConsumption_1.windDragConsumption)(input.dragCoefficient, input.dragReferenceAreaInSquareMeters, airDensity, adjustedWindSpeed);
    var calculatedMotorConsumption = (0, motorConsumption_1.motorConsumption)(calculatedRollingResistanceConsumption, calculatedWindDragConsumption, calculatedMotorEfficiency);
    var calculatedInverterConsumption = (0, inverterConsumption_1.inverterConsumption)(calculatedRollingResistanceConsumption, calculatedWindDragConsumption, calculatedMotorConsumption, input.dcToACInverterEfficiency);
    var calculatedBatteryDischarge = (0, batteryDischargeConsumption_1.batteryDischargeConsumption)(calculatedRollingResistanceConsumption, calculatedWindDragConsumption, calculatedMotorConsumption, calculatedInverterConsumption, input.batteryDischargeEfficiency);
    var calculatedInclineConsumption = (0, inclineConsumption_1.inclineConsumption)(input.inclineInPercent, input.massOfVehicleInKg);
    var calculatedHeaterConsumption = (0, heaterConsumption_1.heaterConsumption)(input.heaterAcPower, speedInMsec);
    // console.log({
    //   speedInMsec,
    //   adjustedWindSpeed,
    //   airDensity,
    //   calculatedRollingResistanceConsumption,
    //   calculatedWindDragConsumption,
    //   calculatedMotorConsumption,
    //   calculatedInverterConsumption,
    //   calculatedBatteryDischarge,
    //   calculatedInclineConsumption,
    //   calculatedHeaterConsumption,
    // })
    var consumption = calculatedRollingResistanceConsumption +
        calculatedWindDragConsumption +
        calculatedMotorConsumption +
        calculatedInverterConsumption +
        calculatedBatteryDischarge +
        calculatedInclineConsumption +
        calculatedHeaterConsumption;
    return consumption;
}
exports.calculateConsumption = calculateConsumption;
