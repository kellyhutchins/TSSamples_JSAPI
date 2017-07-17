define(["require", "exports", "esri/WebScene", "esri/Color", "esri/widgets/Search", "esri/views/SceneView"], function (require, exports, WebScene, Color, Search, SceneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebScene({
        portalItem: {
            id: "646f2077af3143c78ab80c33c608cbf0"
        }
    });
    var view = new SceneView({
        map: map,
        container: "viewDiv",
        qualityProfile: "high",
        environment: {
            lighting: {
                directShadowsEnabled: false,
                ambientOcclusionEnabled: true
            }
        }, highlightOptions: {
            color: new Color([0.255, 255]),
            fillOpacity: 0.6
        }
    });
    var highlight;
    view.then(function () {
        var officeSceneLayer = map.layers.find(function (layer) {
            return layer.title === "Floor 1";
        });
        console.log(officeSceneLayer.layers);
        // Setup search to find a room 
        if (officeSceneLayer) {
            var searchWidget = new Search({
                view: view,
                allPlaceholder: "Search for room",
                sources: [{
                        featureLayer: officeSceneLayer.layers[0],
                        searchFields: []
                    }]
            });
        }
    });
});
//# sourceMappingURL=main.js.map