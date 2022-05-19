"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardinalDirection = void 0;
var cardinalDirection = function (a, b) {
    var dLon = (b[1] - a[1]);
    var y = Math.sin(dLon) * Math.cos(b[0]);
    var x = Math.cos(a[0]) * Math.sin(b[0]) - Math.sin(a[0]) * Math.cos(b[0]) * Math.cos(dLon);
    var brng = Math.atan2(y, x);
    return (brng > 0 ? brng : (2 * Math.PI + brng)) * 360 / (2 * Math.PI);
};
exports.cardinalDirection = cardinalDirection;
