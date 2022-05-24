import allCars from "../data/new-vehicles.json";
import { openSpotlight, useSpotlight } from "@mantine/spotlight";
import {
  TextInput,
  Button,
  Group,
  Card,
  Title,
  Grid,
  Switch,
  NativeSelect,
  Select,
  Avatar,
  Text,
  SelectItemProps,
  Divider,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { forwardRef, useEffect, useState } from "react";
import { vehiclesActions } from "../utils/cars";
import { estimateReferenceArea } from "../math/frontalArea";

interface ItemProps extends SelectItemProps {
  image: string;
  description: string;
}

const cars = allCars
  .filter((f: any) => !!f.dragCoefficient)
  .map((n) => ({
    id: [
      n.make.toLowerCase(),
      n.model.toLowerCase(),
      n.trim,
      n.batteryCapacity,
    ].join(":"),
    ...n,
  }));

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function SelectItem(
  { image, label, description, ...others }: ItemProps,
  ref
) {
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        {/* <Avatar src={`http://www.regcheck.org.uk/image.aspx/@${btoa(label)}`} /> */}
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  );
});

const trailers = [
  {
    value: "",
    label: "No trailer",
  },
  {
    value: "tent-camper-small",
    label: "Tent camper",
    params: {
      mass: 500,
      dragCoefficient: 0.75,
      rollingCoefficient: 0.0125,
      frontalArea: estimateReferenceArea(1710, 1000, 75, [155, 65, 13]),
      axles: 1,
      toungMass: 125,
    },
  },
  {
    value: "popup-camper-small",
    label: "Pop-up camper",
    params: {
      mass: 1300,
      dragCoefficient: 0.75,
      rollingCoefficient: 0.0125,
      frontalArea: estimateReferenceArea(2300, 2400, 75, [185, 50, 14]),
      axles: 1,
      toungMass: 125,
    },
  },
  {
    value: "teardrop-camper",
    label: "Teardrop camper",
    params: {
      mass: 1300,
      dragCoefficient: 0.75,
      rollingCoefficient: 0.0125,
      frontalArea: estimateReferenceArea(2300, 2400, 75, [185, 50, 14]),
      axles: 1,
      toungMass: 125,
    },
  },
  {
    value: "caravan-small",
    label: "Caravan small",
    params: {
      mass: 1300,
      dragCoefficient: 0.75,
      rollingCoefficient: 0.0125,
      frontalArea: estimateReferenceArea(2300, 2400, 75, [185, 50, 14]),
      axles: 1,
      toungMass: 125,
    },
  },
  {
    value: "caravan-large",
    label: "Caravan large",
    params: {
      mass: 1600,
      dragCoefficient: 0.65,
      rollingCoefficient: 0.0125,
      frontalArea: estimateReferenceArea(2500, 2600, 100, [185, 50, 16]),
      axles: 2,
      toungMass: 150,
    },
  },
];

export function Params({
  onChange,
  enabled = true,
}: {
  onChange: any;
  enabled: boolean;
}) {
  const [vehicle, setVehicle] = useState<string | null>(null);
  const [trailer, setTrailer] = useState<string | null>("");

  const form = useForm({
    initialValues: {
      mass: 2105,
      dragCoefficient: 0.28,
      rollingCoefficient: 0.0125,
      dragReferenceArea: 2.629,
      heaterAcPower: 1000,
      availableBatteryCapacity: 72500,
      maximumRegenKilowatts: 225,
      maximumPowerKilowatts: 239,
      dcToACInverterEfficiency: 0.95,
      batteryDischargeEfficiency: 0.9,
      motorEfficiencyMax: 0.96,
      motorEfficiencyMin: 0.85,
      maxMotorEfficiencySpeed: 90,
      "trailer.enabled": false,
      "trailer.mass": 1200,
      "trailer.dragCoefficient": 0.85,
      "trailer.rollingCoefficient": 0.0125,
      "trailer.dragReferenceArea": 2.85,
      "trailer.axles": 1,
      "trailer.toungeMass": 75,
    },
  });

  const onSubmit = (values: typeof form.values) => {
    onChange({
      mass: Number(values.mass),
      dragCoefficient: Number(values.dragCoefficient),
      rollingCoefficient: Number(values.rollingCoefficient),
      dragReferenceArea: Number(values.dragReferenceArea),
      heaterAcPower: Number(values.heaterAcPower),
      availableBatteryCapacity: Number(values.availableBatteryCapacity),
      maximumRegenKilowatts: Number(values.maximumRegenKilowatts),
      maximumPowerKilowatts: Number(values.maximumPowerKilowatts),
      dcToACInverterEfficiency: Number(values.dcToACInverterEfficiency),
      batteryDischargeEfficiency: Number(values.batteryDischargeEfficiency),
      motorEfficiencyMax: Number(values.motorEfficiencyMax),
      motorEfficiencyMin: Number(values.motorEfficiencyMin),
      maxMotorEfficiencySpeed: Number(values.maxMotorEfficiencySpeed),
      trailer: values["trailer.enabled"]
        ? {
            mass: Number(values["trailer.mass"]),
            dragCoefficient: Number(values["trailer.dragCoefficient"]),
            rollingCoefficient: Number(values.rollingCoefficient),
            dragReferenceArea: Math.max(
              0.5,
              Number(values["trailer.dragReferenceArea"]) -
                Number(values.dragReferenceArea) * 0.5
            ),
            axles: Number(values["trailer.axles"]),
            toungeMass: Number(values["trailer.toungeMass"]),
          }
        : undefined,
    });
  };

  useEffect(() => {
    onSubmit(form.values);
  }, [form.values]);

  const car = cars.find((c) => c.id === vehicle);

  return (
    <Card style={{ height: "100%" }}>
      <Title order={4} mb="sm">
        Parameters
      </Title>
      <form
        onSubmit={form.onSubmit(onSubmit)}
        style={{ opacity: enabled ? 1 : 0.25 }}
      >
        <Select
          label="Select vehicle"
          mb="sm"
          nothingFound="No vehicles"
          searchable
          itemComponent={SelectItem}
          data={cars.map((item) => ({
            value: item.id,
            label: `${item.make} ${item.model}`,
            description: `${item.trim ? `${item.trim}, ` : ""}${
              item.batteryCapacity
            } kWh ${item.drive}`,
          }))}
          placeholder="Custom params"
          value={vehicle}
          onChange={(id) => {
            (window as any).gtag?.("event", "select_vehicle", {
              event_category: "params",
              event_label: "Select Vehicle",
              value: id,
            });
            setVehicle(id);
            const item = cars.find((n) => n.id === id);
            if (item) {
              form.setFieldValue("mass", item.weight!);
              form.setFieldValue(
                "dragCoefficient",
                (item as any).dragCoefficient!
              );
              if ((item as any).frontalArea) {
                form.setFieldValue(
                  "dragReferenceArea",
                  (item as any).frontalArea!
                );
              } else if (item.bodyWidth && item.bodyHeight) {
                // calculate frontal area
                form.setFieldValue(
                  "dragReferenceArea",
                  estimateReferenceArea(item.bodyWidth!, item.bodyHeight!)
                );
              } else {
                form.setFieldValue("dragReferenceArea", 2.5);
              }
              form.setFieldValue(
                "availableBatteryCapacity",
                item.batteryCapacity!
              );
            }
          }}
        />
        <Divider mb="sm" />
        <Grid>
          <Grid.Col span={6}>
            <Tooltip
              label="Total weight of the vehicle with passengers and luggage"
              width={160}
              wrapLines
              withArrow
              position="right"
            >
              <TextInput
                required
                size="xs"
                label="Mass"
                type="number"
                step="50"
                rightSection="kg"
                {...form.getInputProps("mass")}
              />
            </Tooltip>
            <TextInput
              required
              size="xs"
              type="number"
              step="0.01"
              label="Drag Coefficient"
              {...form.getInputProps("dragCoefficient")}
            />
            <TextInput
              required
              size="xs"
              type="number"
              step="0.01"
              label="Drag Reference Area"
              rightSection="m²"
              {...form.getInputProps("dragReferenceArea")}
            />
            <TextInput
              required
              size="xs"
              type="number"
              step="0.001"
              label="Rolling Coefficient"
              {...form.getInputProps("rollingCoefficient")}
            />
            <TextInput
              required
              size="xs"
              type="number"
              step="250"
              label="Heater AC Power"
              rightSection="W"
              {...form.getInputProps("heaterAcPower")}
            />
            <TextInput
              required
              size="xs"
              type="number"
              step="250"
              label="Target indoor temp"
              rightSection="°C"
              disabled
              value="20"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Select trailer"
              size="xs"
              data={trailers}
              value={trailer}
              onChange={(id) => {
                setTrailer(id);
                const trailer = trailers.find((n) => n.value === id);
                form.setFieldValue("trailer.enabled", id !== "");
                if (trailer?.params) {
                  (window as any).gtag?.("event", "select_trailer", {
                    event_category: "params",
                    event_label: "Select Trailer",
                    value: id,
                  });
                  form.setFieldValue("trailer.axles", trailer.params.axles);
                  form.setFieldValue(
                    "trailer.dragCoefficient",
                    trailer.params.dragCoefficient
                  );
                  form.setFieldValue(
                    "trailer.dragReferenceArea",
                    trailer.params.frontalArea
                  );
                  form.setFieldValue("trailer.mass", trailer.params.mass);
                  form.setFieldValue(
                    "trailer.rollingCoefficient",
                    trailer.params.rollingCoefficient
                  );
                  form.setFieldValue(
                    "trailer.toungeMass",
                    trailer.params.toungMass
                  );
                }
              }}
            />
            <TextInput
              required
              size="xs"
              label="Mass"
              rightSection="kg"
              type="number"
              step="10"
              disabled={!form.values["trailer.enabled"]}
              {...form.getInputProps("trailer.mass")}
            />
            <TextInput
              required
              size="xs"
              label="Drag Coefficient"
              type="number"
              step="0.01"
              disabled={!form.values["trailer.enabled"]}
              {...form.getInputProps("trailer.dragCoefficient")}
            />
            <TextInput
              required
              size="xs"
              label="Frontal Area"
              rightSection="m²"
              type="number"
              step="0.01"
              disabled={!form.values["trailer.enabled"]}
              {...form.getInputProps("trailer.dragReferenceArea")}
            />
            <TextInput
              type="number"
              step="10"
              required
              size="xs"
              label="Tounge mass"
              rightSection="kg"
              disabled={!form.values["trailer.enabled"]}
              {...form.getInputProps("trailer.toungeMass")}
            />
            <NativeSelect
              size="xs"
              label="Axles"
              disabled={!form.values["trailer.enabled"]}
              data={[
                { value: "1", label: "1 axle" },
                { value: "2", label: "2 axles" },
              ]}
              {...form.getInputProps("trailer.axles")}
            />
          </Grid.Col>
        </Grid>
      </form>
    </Card>
  );
}
