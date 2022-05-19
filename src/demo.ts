// import { elevation } from "./services/jawg-elevation";
import { consumption } from "./services/consumption-service";
import { elevation } from "./services/jawg-elevation";
import { directions } from "./services/mapbox-directions";
import { weather } from "./services/openmeteo-weather";
// import { RichPosition } from "./types/rich-position";
// import * as turf from "@turf/turf";
// import { weather } from "./services/openmeteo-weather";

// export const foo = 'bar';
async function runner() {
  let route = await directions([
    [-21.812941, 64.125721], // Vaettaborgir
    // [-21.1105675, 63.8916566], // Sudurleid
    // [-21.6845875, 65.7021287], // Holmavik
    [-18.0906859,65.6825509], // Akureyri
  ]);
  route = await elevation(route);
  route = await weather(route);

  const x= route.features[0].properties;

  await weather(route);

  // consumption(route, {
  //   mass: 2105,
  //   // batteryCapacity: 77400,
  //   dragCoefficient: 0.28,
  //   rollingCoefficient: 0.0125,
  //   dragReferenceArea: 2.629,
  //   heaterAcPower: 1000,
  //   // trailer: {
  //   //   mass: 1200,
  //   //   axles: 1,
  //   //   dragCoefficient: 0.98,
  //   //   dragReferenceArea: 0.8,
  //   //   rollingCoefficient: 0.014,
  //   // }
  // });
  // console.log(JSON.stringify(route, undefined, 2));

}

try {
  runner();
} catch (err) {
  console.log("error running", err);
}
