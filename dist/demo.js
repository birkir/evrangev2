"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foo = void 0;
var mapbox_directions_1 = require("./services/mapbox-directions");
exports.foo = 'bar';
(0, mapbox_directions_1.directions)([
    [-21.812941, 64.125721],
    [-21.6845875, 65.7021287],
]).then(function () {
    console.log('done');
});
