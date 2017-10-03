define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/Color", "esri/layers/FeatureLayer", "esri/renderers/SimpleRenderer", "esri/symbols/PointSymbol3D", "esri/symbols/ObjectSymbol3DLayer", "esri/symbols/IconSymbol3DLayer", "esri/symbols/TextSymbol3DLayer", "esri/symbols/LabelSymbol3D", "esri/layers/support/LabelClass"], function (require, exports, Map, SceneView, Color, FeatureLayer, SimpleRenderer, PointSymbol3D, ObjectSymbol3DLayer, IconSymbol3DLayer, TextSymbol3DLayer, LabelSymbol3D, LabelClass) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "dark-gray"
    });
    // TODO sample sets zoom in camera to 5.8 but that property
    // isn't doc'd sent inquiry to team to ask about it 
    var view = new SceneView({
        map: map,
        container: "viewDiv",
        camera: {
            position: [-81.76, 16.77, 1932626],
            tilt: 40
        }
    });
    var iconSymbol = new PointSymbol3D({
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
    var iconSymbolRenderer = new SimpleRenderer({
        symbol: iconSymbol
    });
    var objectSymbol = new PointSymbol3D({
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
    var objectSymbolRenderer = new SimpleRenderer({
        symbol: objectSymbol
    });
    var labelClass = new LabelClass({
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
    var featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CITIES_EastUSA_range/FeatureServer/0",
        renderer: iconSymbolRenderer,
        outFields: ["CITY_NAME"],
        maxScale: 0,
        minScale: 0,
        labelsVisible: true,
        labelingInfo: [labelClass]
    });
    map.add(featureLayer);
    document.getElementById("asIcon").addEventListener("click", function () {
        featureLayer.renderer = iconSymbolRenderer;
    });
    document.getElementById("asObject").addEventListener("click", function () {
        featureLayer.renderer = objectSymbolRenderer;
    });
});
//# sourceMappingURL=main.js.map