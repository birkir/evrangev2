const g = 9.80665; // earth-surface gravitational acceleration (m/(s^2)

export const rollingResistanceForce = (
  rollingCoefficient: number,
  massOfCarInKg: number,
  numberOfWheels: number = 4
) => {
  // rolling resistance coefficient, chose value in the middle of "Ordinary car tires on concrete interval of .01 to 015"
  const m = massOfCarInKg;
  const Cr = rollingCoefficient;
  const Fr = Cr * (m / (4 / numberOfWheels)) * g;
  return Fr;
};
