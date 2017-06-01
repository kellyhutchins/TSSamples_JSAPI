define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/layers/SceneLayer", "esri/renderers/SimpleRenderer", "esri/symbols/PointSymbol3D", "esri/symbols/IconSymbol3DLayer"], function (require, exports, Map, SceneView, SceneLayer, SimpleRenderer, PointSymbol3D, IconSymbol3DLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var renderer = new SimpleRenderer({
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
    var sceneLayer = new SceneLayer({
        url: "http://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Airports_PointSceneLayer/SceneServer/layers/0",
        renderer: renderer
    });
    var map = new Map({
        basemap: "dark-gray",
        layers: [sceneLayer]
    });
    var view = new SceneView({
        map: map,
        container: "viewDiv"
    });
});
//# sourceMappingURL=main.js.map