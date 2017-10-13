define(["require", "exports", "esri/Map", "esri/config", "esri/views/SceneView", "app/tintlayer"], function (require, exports, Map, esriConfig, SceneView, TintLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    esriConfig.request.corsEnabledServers.push("http://tile.stamen.com");
    var stamenTintLayer = new TintLayer.TintLayer({
        title: "Stamen Toner",
        tint: "#004FBB",
        urlTemplate: "http://tile.stamen.com/toner/{z}/{x}/{y}.png"
    });
    var map = new Map({
        layers: [stamenTintLayer]
    });
    var view = new SceneView({
        map: map,
        center: [0, 30],
        zoom: 3,
        container: "viewDiv"
    });
});
//# sourceMappingURL=main.js.map