import Map = require("esri/Map");
import WebScene = require("esri/WebScene");
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import watchUtils = require("esri/core/watchUtils");
import Home = require("esri/widgets/Home");
import FullScreen = require("esri/widgets/Fullscreen");

import Point = require("esri/geometry/Point");
import Graphic = require("esri/Graphic");

createView(new WebScene({
    portalItem: {
        id: "53ed0a887ec7409692a7d1c6ba0e6763"
    },
    ground: "world-elevation"
}));

async function createView(map: WebScene) {
    const view = new SceneView({
        map,
        container: "viewDiv"
    });
    await view.when();
    addWidgets(view);

}
async function addWidgets(view: SceneView) {

    view.ui.add(new Home({ view }), "top-left");

    /* Create an overview map and add it to the lower left corner 
    when the scene view is modified udpate overview map */
    const insetDiv = document.createElement("div");
    insetDiv.classList.add("inset-map");
    const insetView = new MapView({
        map: view.map,
        center: view.center,
        scale: view.scale * 2 * Math.max(view.width / 250, view.height / 250),
        container: insetDiv,
        constraints: {
            rotationEnabled: false,
            snapToZoom: false
        },
        ui: {
            components: []
        }
    });

    view.ui.add(insetView.container, "bottom-left");
    insetView.ui.add(new FullScreen({ view: insetView }), "bottom-left");

    await insetView.when();

    updateGraphic(view, insetView);
    let viewHandle: IHandle, scheduleId: Number;
    view.watch("interacting,animation", async () => {
        if (viewHandle || scheduleId) { return }
        scheduleId = setTimeout(() => {
            scheduleId = null;
            viewHandle = view.watch("viewpoint", () => {
                // update overview 
                if (view && view.center) {
                    insetView.goTo({
                        center: view.center as any,
                        scale: view.scale * 2 * Math.max(view.width / insetView.width, view.height / insetView.height)
                    });
                    updateGraphic(view, insetView);
                }
            });
        });

    });
    view.watch("stationary", () => {
        viewHandle = null;
        scheduleId = null;
    });
    insetView.on("click", async (e) => {
        const result = await view.map.ground.queryElevation(e.mapPoint);
        view.goTo(result.geometry);
        updateGraphic(view, insetView)
    });

}
function updateGraphic(view: SceneView, insetView: MapView) {
    insetView.graphics.removeAll();

    const location = new Graphic({
        geometry: view.center,
        symbol: {
            type: "text",
            color: "#FFFF00",
            text: "\ue688",
            angle: view.camera.heading,
            font: {
                size: 22,
                family: "CalciteWebCoreIcons"
            }
        }
    });
    insetView.graphics.add(location);
}



