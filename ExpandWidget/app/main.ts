import EsriMap = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import Expand = require("esri/widgets/Expand");
import BasemapGallery = require("esri/widgets/BasemapGallery");

const map = new EsriMap({
    basemap: "streets" as string as any
});
const view = new SceneView({
    map: map,
    container: "viewDiv"
});

const basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div")
});

const bgExpand = new Expand({
    view: view,
    content: basemapGallery.container,
    expandIconClass: "esri-icon-basemap"
});
view.ui.add(bgExpand, "top-right");