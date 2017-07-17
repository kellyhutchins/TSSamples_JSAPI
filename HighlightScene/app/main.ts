import WebScene = require("esri/WebScene");
import Color = require("esri/Color");
import Search = require("esri/widgets/Search");
import SceneView = require("esri/views/SceneView");


const map = new WebScene({
    portalItem: {
        id: "646f2077af3143c78ab80c33c608cbf0"
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
    console.log("map", map.layers);
    const officeSceneLayer = map.layers.find((layer) => {
        return layer.title === "Floor 1";
    });
    console.log(officeSceneLayer.layers);
    // Setup search to find a room 
    if (officeSceneLayer) {
        const searchWidget = new Search({
            view: view,
            allPlaceholder: "Search for room",
            sources: [{
                featureLayer: officeSceneLayer.layers[0],
                searchFields: []
            }]
        });
    }


});