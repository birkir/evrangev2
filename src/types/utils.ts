import { FeatureCollection, Geometry, Properties } from "@turf/turf";

export type GeoFeatCollection<P extends Properties> = FeatureCollection<
  Geometry,
  P
>;
export type WithFeatureCollection<
  A extends FeatureCollection<Geometry, Properties>,
  B = Properties
> = GeoFeatCollection<A["features"][0]["properties"] & B>;
