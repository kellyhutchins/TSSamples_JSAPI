define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/views/SceneView"], function (require, exports, Map, MapView, SceneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "streets",
        ground: "world-elevation"
    });
    var initialViewParams = {
        container: "viewDiv",
        map: map,
        zoom: 4,
        center: [15, 65]
    };
    // Add 2d/3d view switch button 
    var switcher = document.createElement("button");
    switcher.className = "esri-icon-globe esri-widget";
    switcher.title = "Change View";
    //initialize the app with a 2d view 
    var view = createView(initialViewParams, "2d", switcher);
    switcher.addEventListener("click", function () {
        var viewpoint = view.viewpoint.clone();
        initialViewParams.viewpoint = viewpoint;
        if (view.type !== "3d") {
            view = createView(initialViewParams, "3d", switcher);
        }
        else {
            view = createView(initialViewParams, "2d", switcher);
        }
    });
    function createView(params, type, btn) {
        var updatedView;
        var is3D = type === "3d";
        if (is3D) {
            updatedView = new SceneView(params);
        }
        else {
            updatedView = new MapView(params);
        }
        updatedView.ui.add(btn, "top-left");
        btn.classList.toggle("esri-icon-globe", !is3D);
        btn.classList.toggle("esri-icon-maps", is3D);
        return updatedView;
    }
});
//# sourceMappingURL=main.js.map