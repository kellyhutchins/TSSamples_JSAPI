import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import Graphic = require("esri/Graphic");
import Color = require("esri/Color");

import Point = require("esri/geometry/Point");
import Polyline = require("esri/geometry/Polyline");
import Polygon = require("esri/geometry/Polygon");

import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol");
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol");
import TextSymbol = require("esri/symbols/TextSymbol");

import esri = __esri;

const map = new Map({
    basemap: "hybrid" as any
});
const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-80, 35] as any,
    zoom: 3
});

/**********************
 * Create a point graphic
 * at the location of the Titanic 
 **********************/


const point = new Point({
    longitude: -49.97,
    latitude: 41.73
});

const markerSymbol = new SimpleMarkerSymbol({
    color: new Color([226, 119, 40]),
    outline: {
        color: new Color([255, 255, 255]),
        width: 2
    }
});

const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol
});


/******
 * Add text symbol 
 */
const textSymbol = new TextSymbol({
    color: new Color("#fff"),
    text: "Hello World"
});
const textGraphic = new Graphic({
    geometry: point,
    symbol: textSymbol
})

/**********************
 * Create a polyline graphic
 * at the location of the Keystone Pipeline
 **********************/
const polyline = new Polyline({
    paths: [
        [
            [-111.30, 52.68],
            [-98, 49.5],
            [-93.94, 29.89]
        ]
    ]
});

const lineSymbol = new SimpleLineSymbol({
    color: new Color([226, 119, 40]),
    width: 4
});

const lineAttributes = {
    Name: "Keystone Pipeline",
    Owner: "TransCanada",
    Length: "3,456 km"
};

const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: lineSymbol,
    attributes: lineAttributes,
    popupTemplate: {
        title: "{Name}",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "Name"
            }, {
                fieldName: "Owner"
            }, {
                fieldName: "Length"
            }]
        }]
    }
});

/****************
 * Create a polygon graphic
 * **************** */

const polygon = new Polygon({
    rings: [[
        [-64.78, 32.3],
        [-66.07, 18.45],
        [-80.21, 25.78],
        [-64.78, 32.3]
    ]]
});

const fillSymbol = new SimpleFillSymbol({
    color: new Color([227, 139, 79, 0.8]),
    outline: {
        color: new Color([255, 255, 255]),
        width: 1
    }
});

const polygonGraphic = new Graphic({
    geometry: polygon,
    symbol: fillSymbol
});

view.graphics.addMany([pointGraphic, polylineGraphic, polygonGraphic, textGraphic]);