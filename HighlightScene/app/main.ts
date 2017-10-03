import WebScene = require("esri/WebScene");
import Color = require("esri/Color");
import Query = require("esri/tasks/support/Query");
import SceneView = require("esri/views/SceneView");
import Legend = require("esri/widgets/Legend");

import esri = __esri;

const map = new WebScene({
    portalItem: {
        id: "fbbc829fa7d342e7ae8d18c54a5eab37"
    }
});
const view = new SceneView({
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

let highlight: IHandle;
view.then(() => {
    let officeSceneLayer;
    map.allLayers.some((layer) => {
        if (layer.title === "Esri Offices") {
            officeSceneLayer = layer;
            return true;
        }
    });

    const container = document.getElementById("roomsList");
    view.whenLayerView(officeSceneLayer).then((officeLayerView: esri.FeatureLayerView) => {
        officeLayerView.watch("updating", (val) => {
            const query = new Query({
                outFields: ["*"]
            });
            officeLayerView.queryFeatures(query).then((results: any) => {
                container.innerHTML = "";
                results.features.forEach((feature: esri.Graphic) => {
                    const attributes = feature.attributes;
                    if (attributes.SPACETYPE === "Office") {
                        const li = document.createElement("li");
                        li.setAttribute("class", "panel-result");
                        li.innerHTML = `Room ${attributes.ROOMNUMBER}`;
                        li.addEventListener("click", (evt) => {
                            const queryExent = new Query({
                                objectIds: [feature.attributes.OBJECTID]
                            });
                            officeLayerView.queryExtent(queryExent).then((result) => {
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
    const legend = new Legend({
        view: view
    });
    view.ui.empty("top-left");
    view.ui.add(legend, "bottom-left");
});