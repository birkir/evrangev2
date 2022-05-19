import { Position } from "@turf/turf";

interface ElevationMeta {
  elevation: number;
}

interface DirectionsMeta {
  distance: number;
  duration: number;
}

interface VehicleMeta {
  consumption: number;
  batteryWattHours: number;
}

type RichPositionMeta = {
  vehicle?: VehicleMeta;
} & { elevation?: ElevationMeta } & {
  directions?: DirectionsMeta;
} & Record<string, any>;

export interface RichPosition {
  position: Position;
  meta: RichPositionMeta;
}
