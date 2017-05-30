define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/widgets/Expand", "esri/widgets/BasemapGallery", "esri/Basemap", "esri/layers/WebTileLayer", "esri/core/Collection"], function (require, exports, EsriMap, MapView, Expand, BasemapGallery, Basemap, WebTileLayer, Collection) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "streets"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-118.244, 34.052],
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
        source: basemaps,
        container: document.createElement("div")
    });
    var bgExpand = new Expand({
        view: view,
        content: gallery.container,
        expandIconClass: "esri-icon-basemap"
    });
    view.ui.add(bgExpand, "top-right");
});
//# sourceMappingURL=main.js.map