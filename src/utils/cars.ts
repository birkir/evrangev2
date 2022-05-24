import allCars from "../data/new-vehicles.json";
import { VehicleData } from "../services/consumption-service";

export const makes = Array.from(new Set(allCars.map((item) => item.make)));

export function modelsByMake(make: string) {
  return Array.from(
    new Set(
      allCars.filter((item) => item.make === make).map((item) => item.model)
    )
  );
}

export function trimsByMakeModel(make: string, model: string) {
  return Array.from(
    new Set(
      allCars
        .filter((item) => item.make === make && item.model === model)
        .map((item) => item.trim)
    )
  );
}

export const vehiclesActions = allCars.map(item => ({
  title: `${item.make} ${item.model}`,
  description: `${item.trim}`,
  onTrigger() {
    // noop
  },
}))
