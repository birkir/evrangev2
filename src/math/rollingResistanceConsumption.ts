import { rollingResistanceForce } from './rollingResistanceForce';

const s = 1000; // displacement distance (m)
const joulesPerWattHour = 3600; // (J/Wh)

export const rollingResistanceConsumption = (
  rollingResistanceCoefficient: number,
  massOfCarInKg: number,
  numberOfWheels?: number,
) => {
  const Fr = rollingResistanceForce(
    rollingResistanceCoefficient,
    massOfCarInKg,
    numberOfWheels,
  );
  const W = Fr * s; // Work done (J)
  const workInWattHours = W / joulesPerWattHour; // (Wh)
  return workInWattHours;
};
