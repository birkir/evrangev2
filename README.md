
# Regen
- Ensure maximum regen are in settings.
- This value can almost never be more than the total output in kW.
- Probably some efficiency loss here, 0.9?

# DC to AC Inverter Efficiency
- Standard around 95%
- SiC around 97.5%

# Motor Efficiency
- EPact 84% - 92.5%
- NEMA Premium and Super Premium 86.5% - 94.1%
- Permanent Magnet efficiency = 92% - 97%

# Rolling resistance
- Car tire: 0.010 - 0.015
- Rain on road: 0.02
- Snow on road: 0.05 - 0.075
- Gravel road: 0.020 - 0.035

## Tire contact area


# Heater Consumption

- Calculate watts required to maintain cabin temperature compared to ambient temperature.
- Calculate watts required to maintain battery at 15-35° (20-25°C I think is best)
- Wind chill on cabin?

Heat pumps generally are around 700W - 1000W and will generate heat around 2-3kW

Resistance heat:
  Around 20C - 0W
  Around 10C - 300W
  Around 0C (freezing point) 1000W
  Around -10C - 2000W
  Around -20C - 3000W

With heat pump:
  Around 20C - 0W
  Around 10C - 100W
  Around 0C (freezing point) 200W
  Around -10C - 700W
  Around -20C - 3000W










# Parameters

## Environmental
- Speed (km/h)
- Incline (%)
- Temperature (C°)
- Humidity (%)
- Wind Speed (head, m/s)
- Air Pressure (absolute, pascal)
- Reference height (above sea level, m)

## Vehicle params
- Mass (kg)
- Load (kg)
- Motor (watts)
- Maximum regen (watts)
- Drag coefficient
- Rolling coefficient
  - wheel size, paving type
- Drag reference area (m2)
- DC-AC motor inverter efficiency (%)
  - presets: standard, SiC
- Motor efficiency
  - min (%)
  - max (%)
  - speed at max (km/h)
  - presets: EPact, NEMA, Permanent Magnet
- Heater (watts)
    - heated seats (50W per seat)

## Trailer
- Weight (kg)
- Drag coefficient
- Drag reference area (m2)
