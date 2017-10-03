import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import Color = require("esri/Color");

import FeatureLayer = require("esri/layers/FeatureLayer");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import PointSymbol3D = require("esri/symbols/PointSymbol3D");
import ObjectSymbol3DLayer = require("esri/symbols/ObjectSymbol3DLayer");
import IconSymbol3DLayer = require("esri/symbols/IconSymbol3DLayer");
import TextSymbol3DLayer = require("esri/symbols/TextSymbol3DLayer");
import LabelSymbol3D = require("esri/symbols/LabelSymbol3D");
import LabelClass = require("esri/layers/support/LabelClass");

const map = new Map({
    basemap: "dark-gray" as any
});
// TODO sample sets zoom in camera to 5.8 but that property
// isn't doc'd sent inquiry to team to ask about it 
const view = new SceneView({
    map: map,
    container: "viewDiv",
    camera: {
        position: [-81.76, 16.77, 1932626] as any,
        tilt: 40
    }
});

const iconSymbol = new PointSymbol3D({
    symbolLayers: [new IconSymbol3DLayer({
        size: 12,
        resource: {
            primitive: "square"
        },
        material: {
            color: new Color("#FF4500")
        },
        outline: {
            color: new Color("#fff"),
            size: 1
        }
    })]
});
const iconSymbolRenderer = new SimpleRenderer({
    symbol: iconSymbol
});

const objectSymbol = new PointSymbol3D({
    symbolLayers: [new ObjectSymbol3DLayer({
        width: 70000,
        height: 100000,
        resource: {
            primitive: "cone"
        },
        material: {
            color: new Color("#FFD700")
        }
    })]
});

const objectSymbolRenderer = new SimpleRenderer({
    symbol: objectSymbol
});

const labelClass = new LabelClass({
    symbol: new LabelSymbol3D({
        symbolLayers: [new TextSymbol3DLayer({
            material: {
                color: new Color("#fff")
            },
            size: 10
        })]
    }),
    labelPlacement: "above-right",
    labelExpressionInfo: {
        expression: "$feature.CITY_NAME",
    }
});

const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CITIES_EastUSA_range/FeatureServer/0",
    renderer: iconSymbolRenderer,
    outFields: ["CITY_NAME"],
    maxScale: 0,
    minScale: 0,
    labelsVisible: true,
    labelingInfo: [labelClass]
});
map.add(featureLayer);

document.getElementById("asIcon").addEventListener("click", () => {
    featureLayer.renderer = iconSymbolRenderer;
});
document.getElementById("asObject").addEventListener("click", () => {
    featureLayer.renderer = objectSymbolRenderer;
})