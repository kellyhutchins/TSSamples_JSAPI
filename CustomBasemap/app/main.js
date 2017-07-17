define(["require", "exports", "esri/config", "esri/layers/WebTileLayer", "esri/Map", "esri/core/Collection", "esri/Basemap", "esri/widgets/BasemapToggle", "esri/views/SceneView"], function (require, exports, EsriConfig, WebTileLayer, EsriMap, Collection, Basemap, BasemapToggle, SceneView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    EsriConfig.request.corsEnabledServers.push("a.tile.stamen.com", "b.tile.stamen.com", "c.tile.stamen.com", "d.tile.stamen.com");
    // Create a WebTileLayer with a third-party cached service
    var mapBaseLayer = new WebTileLayer({
        urlTemplate: "http://{subDomain}.tile.stamen.com/terrain/{level}/{col}/{row}.png",
        subDomains: ["a", "b", "c", "d"],
        copyright: "Map tiles by <a href=\"http://stamen.com/\">Stamen Design</a>, " +
            "under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. " +
            "Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>, " +
            "under <a href=\"http://creativecommons.org/licenses/by-sa/3.0\">CC BY SA</a>."
    });
    // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
    // the image in the BasemapToggle widget.
    var layerCollection = new Collection();
    layerCollection.add(mapBaseLayer);
    var bmProps = {
        title: "Terrain",
        id: "terrain",
        thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png",
        baseLayers: layerCollection
    };
    var stamen = new Basemap(bmProps);
    var map = new EsriMap({
        basemap: "satellite",
        ground: "world-elevation"
    });
    var initCamera = {
        heading: 124.7,
        tilt: 82.9,
        position: {
            latitude: 40.713906,
            longitude: -111.848111,
            z: 1990
        }
    };
    var view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: initCamera,
        constraints: {
            altitude: {
                max: 500000
            }
        }
    });
    view.then(function () {
        var toggle = new BasemapToggle({
            titleVisible: true,
            view: view,
            nextBasemap: stamen
        });
        view.ui.add(toggle, "top-right");
    });
});
//# sourceMappingURL=main.js.map