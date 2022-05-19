import polyline from "@mapbox/polyline";
import * as turf from "@turf/turf";
import axios from "axios";
import { linear } from "everpolate";
import { GeoFeatCollection, WithFeatureCollection } from "../types/utils";
import { CollectionDirectionsProperties } from "./mapbox-directions";

interface ElevationItem {
  elevation: number;
  location: { lat: number; lng: number };
  resolution: number;
}

export interface CollectionElevationProperties {
  elevation: {
    elevation: number;
    resolution?: number;
    grade: number;
  };
}

export async function elevation<
  T extends GeoFeatCollection<CollectionDirectionsProperties>
>(
  collection: T
): Promise<WithFeatureCollection<T, CollectionElevationProperties>> {
  const samples = 100;
  const line = turf.lineString(
    collection.features.map((f) => f.geometry.coordinates as turf.Position)
  );
  const meters = turf.length(line, { units: "meters" });
  const metersPerSample = meters / samples;
  const points: any[] = [];
  for (let i = 0; i < samples; i++) {
    const offset = turf.along(line, metersPerSample * i, {
      units: "meters",
    });
    const pt = turf.pointOnLine(line, offset);
    if (pt.properties.index) {
      points.push(collection.features[pt.properties.index]);
    }
  }

  const knots: number[][] = [[], []];

  try {
    const result = await axios.get<ElevationItem[]>(
      `/api/elevation?path=${encodeURIComponent(
        polyline.encode(
          points.map((point) => [
            point.geometry.coordinates[1],
            point.geometry.coordinates[0],
          ])
        )
      )}&samples=${samples}`
    );

    for (let i = 0; i < samples; i++) {
      const sample = result.data[i];
      const feature = points[i];
      if (sample && feature) {
        feature.properties!.elevation = {
          elevation: sample.elevation,
          resolution: sample.resolution,
        };
        knots[0].push(feature.properties!.directions.distance);
        knots[1].push(sample.elevation);
      }
    }
  } catch (err) {
    console.log("err", err);
  }

  const updated = collection as unknown as WithFeatureCollection<typeof collection, CollectionElevationProperties>;

  updated.features.forEach((feature, i, arr) => {
    if (!feature.properties!.elevation) {
      feature.properties.elevation = {
        elevation: linear(
          feature.properties.directions.distance,
          knots[0],
          knots[1]
        )[0],
        grade: 0,
      };
    }
  });

  updated.features.forEach((feature, i, arr) => {
    if (i === 0) {
      feature.properties!.elevation.grade = 0;
    } else {
      const prev = arr[i - 1];
      const rise =
        prev.properties!.elevation.elevation -
        feature.properties!.elevation.elevation;
      const delta =
        prev.properties!.directions.distance -
        feature.properties!.directions.distance;
      const grade = rise / delta;
      feature.properties!.elevation.grade = grade || 0;
    }
  });

  return updated;
}
