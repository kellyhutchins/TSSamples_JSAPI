define(["require", "exports", "esri/WebScene", "esri/Color", "esri/tasks/support/Query", "esri/views/SceneView", "esri/widgets/Legend"], function (require, exports, WebScene, Color, Query, SceneView, Legend) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebScene({
        portalItem: {
            id: "fbbc829fa7d342e7ae8d18c54a5eab37"
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
        var officeSceneLayer;
        map.allLayers.some(function (layer) {
            if (layer.title === "Esri Offices") {
                officeSceneLayer = layer;
                return true;
            }
        });
        var container = document.getElementById("roomsList");
        view.whenLayerView(officeSceneLayer).then(function (officeLayerView) {
            officeLayerView.watch("updating", function (val) {
                var query = new Query({
                    outFields: ["*"]
                });
                officeLayerView.queryFeatures(query).then(function (results) {
                    container.innerHTML = "";
                    results.features.forEach(function (feature) {
                        var attributes = feature.attributes;
                        if (attributes.SPACETYPE === "Office") {
                            var li = document.createElement("li");
                            li.setAttribute("class", "panel-result");
                            li.innerHTML = "Room " + attributes.ROOMNUMBER;
                            li.addEventListener("click", function (evt) {
                                var queryExent = new Query({
                                    objectIds: [feature.attributes.OBJECTID]
                                });
                                officeLayerView.queryExtent(queryExent).then(function (result) {
                                    view.goTo(result.extent.expand(7), {
                                        speedFactor: 0.5
                                    });
                                    if (highlight) {
                                        highlight.remove();
                                    }
                                    highlight = officeLayerView.highlight([feature.attributes.OBJECTID]);
                                });
                            });
                            container.appendChild(li);
                        }
                    });
                });
            });
        });
        var legend = new Legend({
            view: view
        });
        view.ui.empty("top-left");
        view.ui.add(legend, "bottom-left");
    });
});
//# sourceMappingURL=main.js.map