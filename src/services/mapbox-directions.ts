import * as turf from "@turf/turf";
import axios from "axios";
import polyline from "@mapbox/polyline";
import { FeatureCollection, Geometry, Point } from "@turf/turf";

export interface Leg {
  via_waypoints: any[];
  admins: Array<{
    iso_3166_1_alpha3: string;
    iso_3166_1: string;
  }>;
  annotation: Record<string, number[]>;
  weight_typical: number;
  duration_typical: number;
  weight: number;
  duration: number;
  steps: any[];
  distance: number;
  summary: string;
}

export interface MapboxRoute {
  country_crossed: boolean;
  weight_typical: number;
  duration_typical: number;
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: string;
}

export interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

export interface MapboxResponse {
  routes: MapboxRoute[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface CollectionDirectionsProperties {
  directions: {
    duration: number;
    distance: number;
    speed: number;
    durationDelta: number;
    distanceDelta: number;
  };
}

const ACCESS_TOKEN =
  "pk.eyJ1Ijoic29saWRyNTMiLCJhIjoiY2sxa3QybXd5MG83NjNvcDdvbHhub2Z3MCJ9.821Ad9_hAdHVatpXsrnIbg";
const REQUEST_URL = "https://api.mapbox.com/directions/v5";

export async function directions(
  waypoints: turf.Position[],
  depart_at: Date
): Promise<FeatureCollection<Geometry, CollectionDirectionsProperties>> {
  const coordinates = waypoints.map(([lat, lng]) => `${lat},${lng}`).join(";");
  const result = await axios.get<MapboxResponse>(
    `${REQUEST_URL}/mapbox/driving-traffic/${encodeURIComponent(
      coordinates
    )}?access_token=${ACCESS_TOKEN}&steps=true&geometries=geojson&annotations=speed,duration,distance&depart_at=${depart_at
      .toISOString()
      .substring(0, 16)}`
  );
  const routes = result.data.routes;
  const [firstLeg] = routes[0].legs;
  const features: turf.Feature<turf.Point, CollectionDirectionsProperties>[] =
    [];
  const properties = Object.keys(firstLeg.annotation);
  for (const route of routes) {
    for (const leg of route.legs) {
      const steps = [];
      for (const step of leg.steps) {
        if (typeof step.geometry === "string") {
          const geom = polyline.decode(step.geometry);
          steps.push(...geom);
        } else {
          steps.push(...step.geometry.coordinates);
        }
      }
      for (let i = 0; i < leg.annotation.distance.length; i++) {
        const last = features[features.length - 1];
        const directions: CollectionDirectionsProperties["directions"] =
          {} as any;
        if (properties.includes("duration")) {
          directions.duration =
            leg.annotation.duration[i] +
            (last?.properties?.directions?.duration ?? 0);
          directions.durationDelta = leg.annotation.duration[i];
        }
        if (properties.includes("distance")) {
          directions.distance =
            leg.annotation.distance[i] +
            (last?.properties?.directions?.distance ?? 0);
          directions.distanceDelta = leg.annotation.distance[i];
        }
        if (properties.includes("speed")) {
          directions.speed = leg.annotation.speed[i];
        }
        features.push(turf.point(steps[i], { directions }));
      }
    }
  }

  return turf.featureCollection(features);
}
