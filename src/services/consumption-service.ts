import { batteryDischargeConsumption } from "../math/batteryDischargeConsumption";
import { densityOfHumidAir } from "../math/densityOfHumidAir";
import { heaterConsumption } from "../math/heaterConsumption";
import { inclineConsumption } from "../math/inclineConsumption";
import { inverterConsumption } from "../math/inverterConsumption";
import { motorConsumption } from "../math/motorConsumption";
import { motorEfficiency } from "../math/motorEfficiency";
import { rollingResistanceConsumption } from "../math/rollingResistanceConsumption";
import { windDragConsumption } from "../math/windDragConsumption";
import { GeoFeatCollection, WithFeatureCollection } from "../types/utils";
import { CollectionElevationProperties } from "./jawg-elevation";
import { CollectionDirectionsProperties } from "./mapbox-directions";
import { CollectionWeatherProperties } from "./openmeteo-weather";

type SquareMeters = number;
type KilometersPerHour = number;
type Kilograms = number;
type Watts = number;
type Kilowatts = number;

export interface VehicleData {
  mass: Kilograms;
  dragReferenceArea: SquareMeters;
  dragCoefficient: number;
  rollingCoefficient: number;
  heaterAcPower?: Watts;
  availableBatteryCapacity: Watts;
  maximumRegenKilowatts: Kilowatts;
  maximumPowerKilowatts: Kilowatts;
  dcToACInverterEfficiency: number;
  batteryDischargeEfficiency: number;
  motorEfficiencyMax: number;
  motorEfficiencyMin: number;
  maxMotorEfficiencySpeed: KilometersPerHour;
  trailer?: {
    mass: Kilograms;
    dragReferenceArea: SquareMeters;
    dragCoefficient: number;
    rollingCoefficient: number;
    toungeMass?: Kilograms;
    axles: number;
  };
  // overwrites
  speedAdjustment: number;
  headWindAdjustment: number;
}

export type CollectionRequiredConsumptionProperties = CollectionDirectionsProperties &
  CollectionElevationProperties &
  CollectionWeatherProperties;

export interface CollectionConsumptionProperties {
  consumption: {
    windDrag: Watts;
    incline: Watts;
    rollingResistance: Watts;
    motor: Watts;
    inverter: Watts;
    batteryDischarge: Watts;
    heater: Watts;
    watts: Watts;
    total: Watts;
    trailerRollingResistance?: Watts;
    trailerWindDrag?: Watts;
  };
}

export function consumption<
  T extends GeoFeatCollection<CollectionRequiredConsumptionProperties>
>(input: T, vehicle: VehicleData) {
  const collection = input as WithFeatureCollection<
    typeof input,
    Partial<CollectionConsumptionProperties>
  >;
  const results = {
    totalConsumption: 0,
    totalDistance: 0,
    totalDuration: 0,
  };

  collection.features.forEach((feature, i) => {
    const { weather, elevation, directions } = feature.properties!;

    const airDensity = densityOfHumidAir(
      weather.temperature,
      weather.humidity,
      weather.pressure * 100,
      elevation.elevation
    );

    const assumedMotorEfficiency = motorEfficiency(
      vehicle.motorEfficiencyMax,
      vehicle.motorEfficiencyMin,
      vehicle.maxMotorEfficiencySpeed,
      (directions.speed * 3600) / 1000
    );

    const windDrag = windDragConsumption(
      vehicle.dragCoefficient,
      vehicle.dragReferenceArea,
      airDensity,
      directions.speed
    );

    const rollingResistance = rollingResistanceConsumption(
      vehicle.rollingCoefficient,
      vehicle.mass + (vehicle.trailer?.toungeMass ?? 0),
      4
    );

    const motor = motorConsumption(
      rollingResistance,
      windDrag,
      assumedMotorEfficiency
    );

    const inverter = inverterConsumption(
      rollingResistance,
      windDrag,
      motor,
      vehicle.dcToACInverterEfficiency
    );

    const incline = Math.max(
      -vehicle.maximumRegenKilowatts * 1000,
      inclineConsumption(
        elevation.grade * 100,
        vehicle.mass + (vehicle.trailer?.mass ?? 0)
      )
    );

    const batteryDischarge = batteryDischargeConsumption(
      rollingResistance,
      windDrag,
      motor,
      inverter,
      vehicle.batteryDischargeEfficiency
    );

    const heater = heaterConsumption(
      vehicle.heaterAcPower ?? 0,
      directions.speed
    );

    let watts =
      rollingResistance +
      windDrag +
      motor +
      incline +
      inverter +
      batteryDischarge +
      heater;

    feature.properties!.consumption = {
      windDrag,
      incline,
      rollingResistance,
      motor,
      inverter,
      batteryDischarge,
      heater,
      watts,
      total: -1,
    };

    if (vehicle.trailer) {
      const trailerRollingResistance = rollingResistanceConsumption(
        vehicle.trailer.rollingCoefficient,
        vehicle.trailer.mass,
        vehicle.trailer.axles * 2
      );
      const trailerWindDrag = windDragConsumption(
        vehicle.trailer.dragCoefficient,
        vehicle.trailer.dragReferenceArea,
        airDensity,
        directions.speed
      );

      watts += trailerRollingResistance + trailerWindDrag;

      feature.properties!.consumption.trailerRollingResistance =
        trailerRollingResistance;
      feature.properties!.consumption.trailerWindDrag = trailerWindDrag;
    }

    const total = ((watts * directions.distanceDelta) / 1000) || 0;

    feature.properties!.consumption.total = total;

    results.totalConsumption += total;
    results.totalDistance = directions.distance;
    results.totalDuration = directions.duration;
  });

  return {
    collection: collection as WithFeatureCollection<
      typeof input,
      CollectionConsumptionProperties
    >,
    results,
  };
}
