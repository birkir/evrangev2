"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dragForce = void 0;
var dragForce = function (dragCoefficient, dragReferenceAreaInSquareMeters, densityOfHumidAir, speedInMperSecond) {
    // https://en.wikipedia.org/wiki/Drag_coefficient
    var cd = dragCoefficient;
    var A = dragReferenceAreaInSquareMeters;
    var Fd = 0.5 * cd * densityOfHumidAir * Math.pow(speedInMperSecond, 2) * A;
    return Fd;
};
exports.dragForce = dragForce;
