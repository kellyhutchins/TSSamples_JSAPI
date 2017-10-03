import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import Expand = require("esri/widgets/Expand");
import BasemapGallery = require("esri/widgets/BasemapGallery");
import Basemap = require("esri/Basemap");
import WebTileLayer = require("esri/layers/WebTileLayer");
import Collection = require("esri/core/Collection");

const map = new EsriMap({
    basemap: "streets" as any
});
const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-118.244, 34.052] as any,
    zoom: 12
});

// Custom Basemap Layer
var tiledLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tile.stamen.com/toner/{level}/{col}/{row}.png",
    subDomains: ["a", "b", "c", "d"],
    copyright: "Map tiles by <a href=\"http://stamen.com/\">Stamen Design</a>, " +
    "under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. " +
    "Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>, " +
    "under <a href=\"http://creativecommons.org/licenses/by-sa/3.0\">CC BY SA</a>."
});
var basemapLayers = new Collection();
basemapLayers.add(tiledLayer);

var customBasemap = new Basemap({
    title: "Custom Basemap",
    id: "custom",
    baseLayers: basemapLayers,
    thumbnailUrl: "https://developers.arcgis.com/javascript/latest/assets/img/home/homepage-banner-sample.png"
});

var basemaps = new Collection();
basemaps.add(customBasemap);

// add the map's basemap to the collection
basemaps.add(map.basemap);

var gallery = new BasemapGallery({
    view: view,
    source: basemaps as any,
    container: document.createElement("div")
});

var bgExpand = new Expand({
    view: view,
    content: gallery.container,
    expandIconClass: "esri-icon-basemap"
});
view.ui.add(bgExpand, "top-right");