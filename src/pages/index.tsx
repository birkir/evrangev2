import type { NextPage } from "next";
import { linear } from "everpolate";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  Table,
  Container,
  Card,
  Title,
  Grid,
  Slider,
  Switch,
  NativeSelect,
  Stack,
  Text,
  Autocomplete,
  Loader,
  CardSection,
  LoadingOverlay,
} from "@mantine/core";
import { SpotlightProvider } from "@mantine/spotlight";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import React, { useEffect, useRef, useState } from "react";
import { directions } from "../services/mapbox-directions";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import * as turf from "@turf/turf";
import { elevation } from "../services/jawg-elevation";
import { weather } from "../services/openmeteo-weather";
import {
  CardinalDirection,
  cardinalFromDegree,
  CardinalSubset,
} from "cardinal-direction";
import {
  CollectionConsumptionProperties,
  CollectionRequiredConsumptionProperties,
  consumption,
} from "../services/consumption-service";
import { GeoFeatCollection } from "../types/utils";
import { Location, Search } from "tabler-icons-react";
import useSWR from "swr";
import Map, { Layer, MapRef, Source, useMap } from "react-map-gl";
import { Params } from "../components/params";
import { vehiclesActions } from "../utils/cars";

const ACCESS_TOKEN =
  "pk.eyJ1Ijoic29saWRyNTMiLCJhIjoiY2sxa3QybXd5MG83NjNvcDdvbHhub2Z3MCJ9.821Ad9_hAdHVatpXsrnIbg";

const displayMeter = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "meter",
  unitDisplay: "short",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const displayKilometer = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "short",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const displayKilometerPerHour = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "kilometer-per-hour",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

const displayGrade = new Intl.NumberFormat("de-DE", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const displayTemperature = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "celsius",
  unitDisplay: "short",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const displayMetersPerSecond = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "meter-per-second",
  unitDisplay: "short",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const displayDirection = new Intl.NumberFormat("de-DE", {
  style: "unit",
  unit: "degree",
  unitDisplay: "short",
  maximumFractionDigits: 0,
});

const displayWatts = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0,
});

const displayKiloWatts = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1,
});

const displayPressure = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 0,
});

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

const ResultTable = React.memo(
  function ResultTable({
    steps,
    params,
  }: {
    steps: FeatureStep[];
    params: any;
  }) {
    const [visible, setVisible] = useState(false);
    return (
      <>
        <Card>
          <Group>
            <Title order={4}>Show Results</Title>
            <Switch
              checked={visible}
              onChange={(e) => setVisible(e.currentTarget.checked)}
            />
          </Group>
          {visible && (
            <Table>
              <thead>
                <tr>
                  <th>Coordinate</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Speed</th>
                  <th>Elevation</th>
                  <th>Grade</th>
                  <th>Humidity</th>
                  <th>Temp</th>
                  <th>Pressure</th>
                  <th>Wind Sp</th>
                  <th>Wind Dr</th>
                  <th>Consumption</th>
                </tr>
              </thead>
              <tbody>
                {steps.map(
                  (
                    {
                      geometry,
                      properties: {
                        directions,
                        elevation,
                        weather,
                        consumption,
                      },
                    },
                    i
                  ) => (
                    <tr key={i}>
                      <td>
                        {geometry.coordinates[1]}, {geometry.coordinates[0]}
                      </td>
                      <td>
                        {new Date(
                          Date.now() + directions.duration * 1000
                        ).toLocaleTimeString()}
                        <br />+{directions.durationDelta}s
                      </td>
                      <td>
                        {displayKilometer.format(directions.distance / 1000)}
                        <br />+{directions.distanceDelta}m
                      </td>
                      <td>
                        {displayKilometerPerHour.format(directions.speed * 3.6)}
                      </td>
                      <td>{displayMeter.format(elevation.elevation)}</td>
                      <td>{displayGrade.format(elevation.grade)}</td>
                      <td>{displayGrade.format(weather.humidity / 100)}</td>
                      <td>{displayTemperature.format(weather.temperature)}</td>
                      <td>{displayPressure.format(weather.pressure)} hPa</td>
                      <td>
                        {displayMetersPerSecond.format(weather.windSpeed)}
                      </td>
                      <td>
                        {displayDirection.format(weather.windDirection)}{" "}
                        {cardinalFromDegree(
                          weather.windDirection,
                          CardinalSubset.Intercardinal
                        )}
                      </td>
                      <td>
                        {displayWatts.format(
                          (consumption.total / directions.distanceDelta) * 1000
                        )}{" "}
                        Wh/km
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </>
    );
  },
  (prev, next) => {
    return prev.params === next.params && prev.steps === next.steps;
  }
);

const rgba = (v: number) => {
  const steps = [-400, 0, 450];
  const [r] = linear(v, steps, [0, 0, 255]);
  const [g] = linear(v, steps, [128, 255, 0]);
  const [b] = linear(v, steps, [255, 0, 0]);
  return `rgb(${[r, g, b].map((y) => Math.min(255, y)).join(",")})`;
};

const RouteMap = ({
  features,
  params,
}: {
  features: FeatureStep[];
  params: any;
}) => {
  const ref = useRef<MapRef>(null);
  const map = ref.current;
  const [line, setLine] = useState<
    turf.Feature<turf.LineString, { gradient: any; id: string }>
  >({
    type: "Feature",
    geometry: { coordinates: [], type: "LineString" },
    properties: { gradient: [], id: "" },
  });

  useEffect(() => {
    try {
      const line = turf.lineString(
        features.map((f: any) => f.geometry.coordinates),
        {
          id: [
            features.length,
            features?.[0]?.properties?.consumption?.total,
          ].join("-"),
          gradient: features.reduce((acc, f, i, arr) => {
            acc.push(i / arr.length, rgba(f.properties.consumption.watts));
            return acc;
          }, [] as Array<string | number>),
        }
      );
      setLine(line);
    } catch (err) {
      // noop
      console.log("failure", err);
    }
  }, [features, params]);

  useEffect(() => {
    if (line && line.geometry.coordinates.length) {
      const bbox = turf.bbox(line);
      map?.fitBounds(bbox as [number, number, number, number], {
        padding: { top: 50, bottom: 50, left: 100, right: 100 },
      });
    }
  }, [line, map]);

  return (
    <Card
      mb="xl"
      style={{ padding: 0, overflow: "hidden" }}
      shadow="md"
      radius="md"
    >
      <Map
        ref={ref}
        mapboxAccessToken={ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        initialViewState={{
          longitude: -20,
          latitude: 65,
          zoom: 4.5,
        }}
        style={{
          height: "60vh",
          width: "100%",
        }}
      >
        <Source id="route" type="geojson" data={line} lineMetrics />
        <Layer
          id="route-layer"
          source="route"
          {...{
            type: "line",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-gradient": [
                "interpolate",
                ["linear"],
                ["line-progress"],
                ...line.properties.gradient,
              ],
              "line-width": 4,
              "line-opacity": 1,
            },
          }}
        />
      </Map>
    </Card>
  );
};

type FeatureStep = turf.Feature<
  turf.Geometry,
  CollectionRequiredConsumptionProperties & CollectionConsumptionProperties
>;

const fetcher = (query: string) =>
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      query
    )}.json?access_token=${ACCESS_TOKEN}`
  ).then((r) => r.json());

interface AutocompleteFeature {
  center: [number, number];
  id: string;
  place_name: string;
  relevance: number;
  text: string;
  type: "Feature";
}

interface AutocompleteValue {
  lat: number;
  lon: number;
  title: string;
}

function LocationAutocomplete({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue: AutocompleteValue;
  onChange(c: AutocompleteValue): void;
}) {
  const [value, setValue] = useState(defaultValue.title ?? "");
  const [query] = useDebouncedValue(value, 1_000);
  const { data, error } = useSWR<{ features: AutocompleteFeature[] }>(
    query.length < 3 ? null : query,
    fetcher
  );
  return (
    <Autocomplete
      value={value}
      onChange={setValue}
      onItemSubmit={(item: any) =>
        onChange({
          lat: item.center[1],
          lon: item.center[0],
          title: item.place_name,
        })
      }
      label={label}
      data={
        data?.features?.map((f: any) => ({ ...f, value: f.place_name })) ?? []
      }
      icon={
        query.length > 3 && !data && !error ? (
          <Loader size={16} />
        ) : (
          <Location size={16} />
        )
      }
    />
  );
}

const Home: NextPage = () => {
  const [routeParams, setRouteParams] = useLocalStorage({
    key: "route_params",
    defaultValue: {
      from: {
        lat: 64.125556,
        lon: -21.848726,
        title: "Reykjavík, Capital, Iceland",
      },
      to: {
        lat: 65.678424,
        lon: -18.106565,
        title: "Akureyri, Northeastern, Iceland",
      },
    },
  });

  const form = useForm({
    initialValues: {
      from: routeParams.from,
      to: routeParams.to,
      departure: new Date(),
    },
  });

  const [params, setParams] = useState<any>({});
  const [results, setResults] = useState<any>();
  const [route, setRoute] =
    useState<GeoFeatCollection<CollectionRequiredConsumptionProperties>>();
  const [features, setFeatures] = useState<FeatureStep[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: typeof form.values) => {
    setRouteParams(form.values);
    setLoading(true);
    (window as any).gtag?.("event", "submit_route", {
      event_category: "route",
      event_label: "Submit route",
    });
    if (values.from && values.to) {
      const rt0 = await directions(
        [
          [values.from.lon, values.from.lat],
          [values.to.lon, values.to.lat],
        ],
        values.departure
      );
      const rt1 = await elevation(rt0);
      const rt2 = await weather(rt1);
      // @todo calculate consumption, do another directions with charging stations.
      setRoute(rt2);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!route) {
      return;
    }
    const res = consumption(route, params);
    setFeatures(res.collection.features);
    setResults(res.results);
  }, [route, params]);

  return (
    <Container size="xl" mt="lg">
      <Title mb="xl">EV Range (v2)</Title>
      <Grid mb="lg">
        <Grid.Col md={12} lg={4}>
          <Card style={{ height: "100%" }}>
            <LoadingOverlay visible={loading} />
            <Title order={4}>Route</Title>
            {route ? (
              <div>
                <Text mt="md" mb="xs">
                  From
                </Text>
                <Title order={4}>{form.values.from?.title}</Title>
                <Text>to</Text>
                <Title order={4}>{form.values.to?.title}</Title>
                <Text mt="xs" mb="xl">
                  Departure at{" "}
                  {form.values.departure.toISOString().substring(16, 11)}
                </Text>
                <Button
                  onClick={() => {
                    setRoute(undefined);
                    setFeatures([]);
                    setResults(undefined);
                  }}
                >
                  Change route
                </Button>
              </div>
            ) : (
              <form onSubmit={form.onSubmit(onSubmit)}>
                <LocationAutocomplete
                  label="From"
                  defaultValue={form.values.from}
                  onChange={(v) => {
                    form.setFieldValue("from", v);
                  }}
                />
                <LocationAutocomplete
                  label="To"
                  defaultValue={form.values.to}
                  onChange={(v) => {
                    form.setFieldValue("to", v);
                  }}
                />
                <TimeInput
                  label="Departure"
                  mb="xs"
                  {...form.getInputProps("departure")}
                />
                <Group position="right" mt="md">
                  <Button type="submit">Submit</Button>
                </Group>
              </form>
            )}
          </Card>
        </Grid.Col>
        <Grid.Col md={12} lg={4}>
          <Params onChange={setParams} enabled={!!results} />
        </Grid.Col>
        <Grid.Col md={12} lg={4}>
          <Card style={{ height: "100%" }}>
            <Title order={4} mb="sm">
              Results
            </Title>
            {results && (
              <Stack>
                <Card.Section>
                  <Text component="span" size="sm" weight={700}>
                    Total Consumption
                  </Text>
                  <Text>
                    {displayKiloWatts.format(results?.totalConsumption / 1000)}{" "}
                    kWh
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text component="span" size="sm" weight={700}>
                    Average Consumption
                  </Text>
                  <Text>
                    {displayWatts.format(
                      (results?.totalConsumption / results?.totalDistance) *
                        1000
                    )}{" "}
                    Wh/km
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text component="span" size="sm" weight={700}>
                    Battery usage
                  </Text>
                  <Text>
                    {displayWatts.format(
                      (results?.totalConsumption /
                        params.availableBatteryCapacity) *
                        100
                    )}
                    <Text component="span" color="gray" size="sm">
                      {" "}
                      %
                    </Text>
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text component="span" size="sm" weight={700}>
                    Total Distance
                  </Text>
                  <Text>
                    {displayKilometer.format(results?.totalDistance / 1000)}
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text component="span" size="sm" weight={700}>
                    Total Duration
                  </Text>
                  <Text>{formatDuration(results?.totalDuration)}</Text>
                </Card.Section>
              </Stack>
            )}
          </Card>
        </Grid.Col>
      </Grid>
      <RouteMap features={features} params={params} />
      {/* <ResultTable steps={features} params={params} /> */}
    </Container>
  );
};

export default Home;
