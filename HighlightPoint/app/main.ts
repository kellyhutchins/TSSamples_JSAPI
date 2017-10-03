import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");
import Color = require("esri/Color");
import Graphic = require("esri/Graphic");
import FeatureSet = require("esri/tasks/support/FeatureSet");
import esri = __esri;

const webscene = new WebScene({
    portalItem: {
        id: "475a7161ed194460b5b52654e29581a2"
    }
});
const view = new SceneView({
    map: webscene,
    container: "viewDiv",
    highlightOptions: {
        color: new Color([255, 242, 58]),
        fillOpacity: 0.4,
        haloOpacity: 0.25
    }
});

webscene.load().then(() => {
    // Get layer from scene view
    const stationLayer = webscene.layers.getItemAt(1) as esri.FeatureLayer;
    // highlight is set on the layerview so we need to detect
    // when the layer view is ready
    view.whenLayerView(stationLayer).then(lyrView => {

        const queryStations = stationLayer.createQuery();
        const filterButtons = document.querySelectorAll("button");
        let handler: any = null;
        [...document.querySelectorAll("button")].forEach(filterButton => {
            filterButton.addEventListener("click", (event) => {
                queryStations.where = `nom = '${filterButton.innerHTML}'`
                stationLayer.queryFeatures(queryStations).then((result: FeatureSet) => {

                    const feature: Graphic = result.features[0];
                    // Highlight feature using the objectid  then center the view
                    if (handler) {
                        handler.remove();
                    }
                    const flayerView = lyrView as esri.FeatureLayerView;
                    handler = flayerView.highlight(feature.attributes["OBJECTID"]);

                    view.goTo({
                        target: feature.geometry,
                        tilt: 70
                    }), {
                            duration: 2000,
                            easing: "in-out-expo"
                        }
                });

            });
        });
    });
});

