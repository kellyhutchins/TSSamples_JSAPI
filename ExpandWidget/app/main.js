define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/widgets/Expand", "esri/widgets/BasemapGallery"], function (require, exports, EsriMap, SceneView, Expand, BasemapGallery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "streets"
    });
    var view = new SceneView({
        map: map,
        container: "viewDiv"
    });
    var basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
    });
    var bgExpand = new Expand({
        view: view,
        content: basemapGallery.container,
        expandIconClass: "esri-icon-basemap"
    });
    view.ui.add(bgExpand, "top-right");
});
//# sourceMappingURL=main.js.map