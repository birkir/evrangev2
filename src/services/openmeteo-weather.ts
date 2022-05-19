import * as turf from "@turf/turf";
import axios from "axios";
import { Geometry } from "@turf/turf";
import { linear } from "everpolate";
import { GeoFeatCollection, WithFeatureCollection } from "../types/utils";
import { CollectionDirectionsProperties } from "./mapbox-directions";

interface WeatherResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  utc_offset_seconds: number;
  generationtime_ms: number;
  hourly_units: {
    windspeed_10m: "km/h";
    pressure_msl: "hPa";
    relativehumidity_2m: "%";
    time: "iso8601";
    winddirection_10m: "°";
    temperature_2m: "°C";
    precipitation: "mm";
    snow_depth: "m";
  };
  hourly: {
    windspeed_10m: number[];
    pressure_msl: number[];
    relativehumidity_2m: number[];
    time: string[];
    temperature_2m: number[];
    winddirection_10m: number[];
    precipitation: number[];
    snow_depth: number[];
  };
}

export interface CollectionWeatherProperties {
  weather: {
    date?: Date;
    index?: number;
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    precipitation: number;
    snowDepth: number;
  };
}

export async function weather<
  T extends GeoFeatCollection<CollectionDirectionsProperties>
>(
  input: T,
  startDate: Date = new Date(),
  samples: number = 3
): Promise<WithFeatureCollection<T, CollectionWeatherProperties>> {
  const collection = input as WithFeatureCollection<typeof input, Partial<CollectionWeatherProperties>>;

  // @todo sample more than 2 locations from precision
  const features = [
    collection.features[0],
    collection.features[Math.round(collection.features.length / 2)],
    collection.features[collection.features.length - 1],
  ];

  const interpolatedProps = [
    "temperature",
    "humidity",
    "windSpeed",
    "windDirection",
    "pressure",
    "precipitation",
    "snowDepth",
  ];
  const knots: Record<string, number[]> = { distance: [] };

  for (const feature of features) {
    const position = feature.geometry.coordinates;
    const { data: weather } = await axios.get<WeatherResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${position[1]}&longitude=${position[0]}&hourly=temperature_2m,windspeed_10m,winddirection_10m,pressure_msl,relativehumidity_2m,precipitation,snow_depth`
    );
    if (feature) {
      // @todo move to directions side
      const ms =
        startDate.getTime() + feature.properties.directions.duration * 1000;
      const date = new Date();
      date.setTime(ms);
      date.setMinutes(0);
      date.setMilliseconds(0);
      date.setSeconds(0);
      const weatherIndex = weather.hourly.time.findIndex(
        (t) => new Date(t) >= date
      );
      if (weatherIndex >= 0) {
        knots.distance.push(feature.properties.directions.distance);
        const attrs = {
          temperature: weather.hourly.temperature_2m[weatherIndex],
          humidity: weather.hourly.relativehumidity_2m[weatherIndex],
          windSpeed: weather.hourly.windspeed_10m[weatherIndex],
          windDirection: weather.hourly.winddirection_10m[weatherIndex],
          pressure: weather.hourly.pressure_msl[weatherIndex],
          precipitation: weather.hourly.precipitation[weatherIndex],
          snowDepth: weather.hourly.snow_depth[weatherIndex],
        };
        Object.entries(attrs).forEach(([key, value]) => {
          knots[key] = knots[key] || [];
          knots[key].push(value);
        });
        feature.properties.weather = {
          date,
          index: weatherIndex,
          ...attrs,
        };
      }
    }
  }

  const updated = collection as WithFeatureCollection<typeof collection, CollectionWeatherProperties>

  updated.features.forEach((feature) => {
    if (!feature.properties.weather) {
      feature.properties.weather = interpolatedProps.reduce((acc: any, propName) => {
        acc[propName] = linear(
          feature.properties.directions.distance,
          knots.distance,
          knots[propName]
        )[0];
        return acc;
      }, {});
    }
  });

  return updated;
}
