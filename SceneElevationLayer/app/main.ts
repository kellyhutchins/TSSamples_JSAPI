import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import ElevationLayer = require("esri/layers/ElevationLayer");

const map = new Map({
    basemap: "topo" as any,
    ground: "world-elevation" as any
});
const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
        position: [-121.83, 48.279, 1346] as any,
        heading: 300,
        tilt: 60
    }
});

const elevationLayer = new ElevationLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/OsoLandslide/OsoLandslide_After_3DTerrain/ImageServer",
    visible: false
});
map.ground.layers.add(elevationLayer);

const landslide = document.getElementById("landslideInput") as HTMLInputElement;
landslide.addEventListener("change", () => {
    // If checkbox is checked use elevation data from after the landslide 
    elevationLayer.visible = landslide.checked;
});