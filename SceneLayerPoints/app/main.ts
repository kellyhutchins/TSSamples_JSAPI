import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import SceneLayer = require("esri/layers/SceneLayer");

import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import PointSymbol3D = require("esri/symbols/PointSymbol3D");
import IconSymbol3DLayer = require("esri/symbols/IconSymbol3DLayer");


const renderer = new SimpleRenderer({
    symbol: new PointSymbol3D({
        symbolLayers: [new IconSymbol3DLayer()]
    }),
    visualVariables: [{
        // size each icon based on the airport's elevation
        type: "size",
        field: "elevation_ft",
        stops: [{
            value: 0,
            size: 2
        }, {
            value: 15000,
            size: 35
        }]
    }, {
        // shade each airport a different color based on its type
        type: "color",
        field: "type_airport",
        stops: [{
            value: 1,
            color: [252, 12, 245]
        }, {
            value: 3,
            color: [83, 0, 244]
        }, {
            value: 7,
            color: [4, 245, 248]
        }]
    }]
});

const sceneLayer = new SceneLayer({
    url: "http://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Airports_PointSceneLayer/SceneServer/layers/0",
    renderer: renderer
});

const map = new Map({
    basemap: "dark-gray" as any,
    layers: [sceneLayer]
});

const view = new SceneView({
    map: map,
    container: "viewDiv"
});