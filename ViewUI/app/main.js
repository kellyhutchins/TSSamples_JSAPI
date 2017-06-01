define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/widgets/Search"], function (require, exports, Map, SceneView, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "dark-gray"
    });
    var view = new SceneView({
        map: map,
        container: "viewDiv",
        center: [-106.45, 31.76],
        zoom: 16
    });
    // Create a logo image 
    var logo = document.createElement("img");
    logo.src = "https://placeholdit.imgix.net/~text?bg=000&txtclr=e8117f&txtsize=48&txt=logo&w=100&h=80";
    logo.title = "Logo";
    var search = new Search({
        view: view
    });
    view.ui.add(logo, "bottom-right");
    view.ui.add(search, "top-right");
});
//# sourceMappingURL=main.js.map