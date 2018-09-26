define(["require", "exports", "esri/Map", "esri/layers/FeatureLayer", "esri/views/MapView", "esri/widgets/Feature"], function (require, exports, Map, FeatureLayer, MapView, Feature) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var fLayer = new FeatureLayer({
        portalItem: {
            id: "673e64cb978d4e79ab47f541a7c52d65"
        }
    });
    var map = new Map({
        basemap: "gray-vector",
        layers: [fLayer]
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-80, 40],
        scale: 5000000
    });
    view.when().then(function () {
        var graphic = {
            popupTemplate: {
                content: "Mouse over features to show details..."
            }
        };
        var feature = new Feature({
            graphic: graphic,
            view: view
        });
        view.ui.add(feature, "bottom-left");
        view.whenLayerView(fLayer).then(function (layerView) {
            var highlight;
            view.on("pointer-move", function (event) {
                view.hitTest(event).then(function (event) {
                    var results = event.results.filter(function (result) {
                        var layer = result.graphic.layer;
                        return layer.popupTemplate;
                    });
                    var result = results[0];
                    highlight && highlight.remove();
                    if (result) {
                        feature.graphic = result.graphic;
                        var FLayerView = layerView;
                        highlight = FLayerView.highlight(result.graphic);
                        view.ui.add(feature, "bottom-left");
                    }
                    else {
                        feature.graphic = null;
                    }
                });
            });
        });
    });
});
//# sourceMappingURL=main.js.map