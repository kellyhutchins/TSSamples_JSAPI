import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import watchUtils = require("esri/core/watchUtils");
import Graphic = require("esri/Graphic");

createView(new WebMap({
    portalItem: {
        id: "ba69233e666a4e249be6d2c72e4136c7"
    }
}));

async function createView(map: WebMap) {
    const view = new MapView({
        map,
        container: "viewDiv"
    });

    await view.when();
    const layer = view.map.layers.getItemAt(0) as FeatureLayer;

    view.whenLayerView(layer).then((layerView: FeatureLayerView) => {
        watchUtils.once(layerView, "updating", () => {
            queryFeatures(layerView, view);
        });
    });
}

async function queryFeatures(layerView: FeatureLayerView, view: MapView) {

    const results = await layerView.queryFeatures();

    const select = document.createElement("select");
    select.innerHTML = results.map((result: Graphic) => {

        return `<option value=${result.attributes.OBJECTID_1}>
            ${result.attributes.ZIP} (${result.attributes.PO_NAME})
            </option>`

    }).sort().join(" ");
    view.ui.add(select, "top-right");

    select.addEventListener("change", () => {
        const feature = results[select.value];
        if (feature) {
            view.goTo(feature);
            view.popup.open({
                features: [feature],
                location: feature.geometry.centroid
            });
        }


    });
}
