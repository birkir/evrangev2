"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windDragConsumption = void 0;
var dragForce_1 = require("./dragForce");
var s = 1000; // displacement distance (m)
var joulesPerWattHour = 3600; // (J/Wh)
var windDragConsumption = function (dragCoefficient, dragReferenceAreaInSquareMeters, densityOfHumidAir, speedInMperSecond) {
    var Fd = (0, dragForce_1.dragForce)(dragCoefficient, dragReferenceAreaInSquareMeters, densityOfHumidAir, speedInMperSecond); // (N)
    var W = Fd * s; // Work done (J)
    var workInWattHours = W / joulesPerWattHour; // (Wh)
    return workInWattHours;
};
exports.windDragConsumption = windDragConsumption;
