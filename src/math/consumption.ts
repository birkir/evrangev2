import { batteryDischargeConsumption } from './batteryDischargeConsumption';
import { densityOfHumidAir } from './densityOfHumidAir';
import { heaterConsumption } from './heaterConsumption';
import { inclineConsumption } from './inclineConsumption';
import { inverterConsumption } from './inverterConsumption';
import { motorConsumption } from './motorConsumption';
import { motorEfficiency } from './motorEfficiency';
import { rollingResistanceConsumption } from './rollingResistanceConsumption';
import { windDragConsumption } from './windDragConsumption';

export interface ConsumptionInput {
  speedInKmPerHour: number;
  inclineInPercent: number;
  heaterAcPower: number;
  cardinalDirection: number;

  // weather
  temperatureInCelcius: number;
  relativeHumidity: number;
  absoluteAirPressureInPascal: number;
  heightAboveReference: number;
  windSpeed: number;
  windDirection: number;

  // vehicle paramteres
  massOfVehicleInKg: number;
  dragCoefficient: number;
  rollingCoefficient: number;
  dragReferenceAreaInSquareMeters: number;

  // assumed constants
  dcToACInverterEfficiency: number;
  batteryDischargeEfficiency: number;
  motorEfficiencyAtMax: number;
  motorEfficiencyAtMin: number;
  speedInKmPerHourAtMaxMotorEfficiency: number;
}

export function calculateConsumption(input: ConsumptionInput) {
  const speedInMsec = (input.speedInKmPerHour * 1000) / 3600;

  const airDensity = densityOfHumidAir(
    input.temperatureInCelcius,
    input.relativeHumidity,
    input.absoluteAirPressureInPascal,
    input.heightAboveReference
  );

  const calculatedMotorEfficiency = motorEfficiency(
    input.motorEfficiencyAtMax,
    input.motorEfficiencyAtMin,
    input.speedInKmPerHourAtMaxMotorEfficiency,
    input.speedInKmPerHour
  );

  const calculatedRollingResistanceConsumption = rollingResistanceConsumption(
    input.rollingCoefficient,
    input.massOfVehicleInKg
  );

  const angle = (input.cardinalDirection - input.windDirection) % 360;
  const x = Math.cos((Math.PI * 2 * angle) / 360);
  const angleWindSpeed = x * input.windSpeed;
  const adjustedWindSpeed = speedInMsec - angleWindSpeed;
  const calculatedWindDragConsumption = windDragConsumption(
    input.dragCoefficient,
    input.dragReferenceAreaInSquareMeters,
    airDensity,
    adjustedWindSpeed
  );

  const calculatedMotorConsumption = motorConsumption(
    calculatedRollingResistanceConsumption,
    calculatedWindDragConsumption,
    calculatedMotorEfficiency
  );

  const calculatedInverterConsumption = inverterConsumption(
    calculatedRollingResistanceConsumption,
    calculatedWindDragConsumption,
    calculatedMotorConsumption,
    input.dcToACInverterEfficiency
  );

  const calculatedBatteryDischarge = batteryDischargeConsumption(
    calculatedRollingResistanceConsumption,
    calculatedWindDragConsumption,
    calculatedMotorConsumption,
    calculatedInverterConsumption,
    input.batteryDischargeEfficiency
  );

  const calculatedInclineConsumption = inclineConsumption(
    input.inclineInPercent,
    input.massOfVehicleInKg
  );

  const calculatedHeaterConsumption = heaterConsumption(
    input.heaterAcPower,
    speedInMsec
  );

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

  const consumption =
    calculatedRollingResistanceConsumption +
    calculatedWindDragConsumption +
    calculatedMotorConsumption +
    calculatedInverterConsumption +
    calculatedBatteryDischarge +
    calculatedInclineConsumption +
    calculatedHeaterConsumption;

  return consumption;
}
