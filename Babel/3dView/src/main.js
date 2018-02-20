import Map from "esri/Map";
import WebScene from "esri/WebScene";
import MapView from "esri/views/MapView";
import SceneView from "esri/views/SceneView";

import Home from "esri/widgets/Home";
import FullScreen from "esri/widgets/Fullscreen";

import Point from "esri/geometry/Point";
import Graphic from "esri/Graphic";

const view = new SceneView({
    map: new WebScene({
        portalItem: {
            id: "91b46c2b162c48dba264b2190e1dbcff"
        }
    }),
    container: "viewDiv"
});

var homeBtn = new Home({
    view: view
});
view.ui.add(homeBtn, "top-left");

view.when(() => {
    /* Create an overview map and add it to the lower left corner 
    when the scene view is modifie udpate overview map */
    const insetDiv = document.createElement("div");
    insetDiv.classList.add("inset-map");
    const insetView = new MapView({
        map: new Map({
            basemap: "topo-vector",
            ground: "world-elevation"
        }),
        center: view.center,
        scale: view.scale * 2 * Math.max(view.width / 250, view.height / 250),
        container: insetDiv,
        constraints: {
            rotationEnabled: false
        },
        ui: {
            components: []
        }
    });
    view.ui.add(insetView.container, "bottom-left");


    var fullScreen = new FullScreen({
        view: insetView
    });
    insetView.ui.add(fullScreen, "bottom-left");

    insetView.when(() => {

        view.watch("stationary", updateOverview);
        insetView.on("click", insetMapClicked);
    });

    function insetMapClicked(e) {
        // 2d map clicked - navigate to location on 3d map 
        insetView.map.ground.queryElevation(e.mapPoint).then((result) => {
            view.goTo(result.geometry);
            updateGraphic();
        });
    }

    function updateGraphic() {

        insetView.graphics.removeAll();

        const location = new Graphic({
            geometry: view.center,
            symbol: {
                type: "text",
                color: "#FFFF00",
                text: "\ue688",
                angle: view.camera.heading,
                font: {
                    size: 26,
                    family: "CalciteWebCoreIcons"
                }
            }
        });
        insetView.graphics.add(location);

    }

    function updateOverview() {
        if (view && view.center) {
            insetView.goTo({
                center: view.center,
                scale: view.scale * 2 * Math.max(view.width / insetView.width, view.height / insetView.height)
            }).then(() => {
                updateGraphic();
            });
        }

    }

});