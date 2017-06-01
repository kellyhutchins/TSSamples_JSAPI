define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/layers/ElevationLayer"], function (require, exports, Map, SceneView, ElevationLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "topo",
        ground: "world-elevation"
    });
    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [-121.83, 48.279, 1346],
            heading: 300,
            tilt: 60
        }
    });
    var elevationLayer = new ElevationLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/OsoLandslide/OsoLandslide_After_3DTerrain/ImageServer",
        visible: false
    });
    map.ground.layers.add(elevationLayer);
    var landslide = document.getElementById("landslideInput");
    landslide.addEventListener("change", function () {
        // If checkbox is checked use elevation data from after the landslide 
        elevationLayer.visible = landslide.checked;
    });
});
//# sourceMappingURL=main.js.map