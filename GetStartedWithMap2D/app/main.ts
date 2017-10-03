import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
const map = new EsriMap({
    basemap: "streets" as any
});
const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [15, 65] as any,
    zoom: 4
});