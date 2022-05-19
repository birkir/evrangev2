import { Position } from "@turf/turf";

export interface Route {
  duration: number;
  distance: number;
  legs: Array<{
    duration: number;
    distance: number;
    steps: Array<{
      duration: number;
      distance: number;
    }>;
  }>;
  coordinates: Position[];
}
