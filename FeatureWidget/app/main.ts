import Map = require("esri/Map");
import FeatureLayer = require("esri/layers/FeatureLayer");
import MapView = require("esri/views/MapView");
import Feature = require("esri/widgets/Feature");

const fLayer = new FeatureLayer({
    portalItem: {
        id: "673e64cb978d4e79ab47f541a7c52d65"
    }
});
const map = new Map({
    basemap: "gray-vector",
    layers: [fLayer]
});
const view = new MapView({
    map,
    container: "viewDiv",
    center: [-80, 40],
    scale: 5000000
});

view.when().then(() => {
    const graphic = {
        popupTemplate: {
            content: "Mouse over features to show details..."
        }
    };

    const feature = new Feature({
        graphic,
        view
    });
    view.ui.add(feature, "bottom-left");

    view.whenLayerView(fLayer).then((layerView) => {
        let highlight: any;
        view.on("pointer-move", (event) => {
            view.hitTest(event).then((event) => {
                const results = event.results.filter((result) => {

                    const layer = result.graphic.layer as FeatureLayer;
                    return layer.popupTemplate;

                });
                const result = results[0];
                highlight && highlight.remove();
                if (result) {
                    feature.graphic = result.graphic;
                    const FLayerView: __esri.FeatureLayerView = layerView as __esri.FeatureLayerView;
                    highlight = FLayerView.highlight(result.graphic);
                    view.ui.add(feature, "bottom-left");
                } else {
                    feature.graphic = null;
                }
            });
        });
    });
});