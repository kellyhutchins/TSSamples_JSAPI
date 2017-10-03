import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import esri = __esri;
const map = new Map({
    basemap: "streets" as any,
    ground: "world-elevation" as any
});

const initialViewParams: esri.SceneViewProperties | esri.MapViewProperties = {
    container: "viewDiv",
    map: map,
    zoom: 4,
    center: [15, 65] as any
};

// Add 2d/3d view switch button 
const switcher = document.createElement("button");
switcher.className = "esri-icon-globe esri-widget";
switcher.title = "Change View";
//initialize the app with a 2d view 
let view = createView(initialViewParams, "2d", switcher);

switcher.addEventListener("click", () => {
    const viewpoint = view.viewpoint.clone();
    initialViewParams.viewpoint = viewpoint;
    if (view.type !== "3d") {
        view = createView(initialViewParams, "3d", switcher);
    } else {
        view = createView(initialViewParams, "2d", switcher);
    }
});

function createView(params: object, type: string, btn: HTMLButtonElement) {
    let updatedView;
    const is3D = type === "3d";
    if (is3D) {
        updatedView = new SceneView(params);
    } else {
        updatedView = new MapView(params);
    }
    updatedView.ui.add(btn, "top-left");
    btn.classList.toggle("esri-icon-globe", !is3D);
    btn.classList.toggle("esri-icon-maps", is3D);
    return updatedView;
}



