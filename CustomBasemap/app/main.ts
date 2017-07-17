import EsriConfig = require("esri/config");
import WebTileLayer = require("esri/layers/WebTileLayer");
import EsriMap = require("esri/Map");

import Collection = require("esri/core/Collection");
import Basemap = require("esri/Basemap");
import BasemapToggle = require("esri/widgets/BasemapToggle");

import SceneView = require("esri/views/SceneView");

import BasemapProperties = __esri.BasemapProperties;
import CameraProperties = __esri.CameraProperties;

EsriConfig.request.corsEnabledServers.push("a.tile.stamen.com", "b.tile.stamen.com", "c.tile.stamen.com", "d.tile.stamen.com");

// Create a WebTileLayer with a third-party cached service
const mapBaseLayer = new WebTileLayer({
    urlTemplate: "http://{subDomain}.tile.stamen.com/terrain/{level}/{col}/{row}.png",
    subDomains: ["a", "b", "c", "d"],
    copyright: "Map tiles by <a href=\"http://stamen.com/\">Stamen Design</a>, " +
    "under <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a>. " +
    "Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>, " +
    "under <a href=\"http://creativecommons.org/licenses/by-sa/3.0\">CC BY SA</a>."
});

// Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
// the image in the BasemapToggle widget.

const layerCollection = new Collection();
layerCollection.add(mapBaseLayer);

const bmProps: BasemapProperties = {
    title: "Terrain",
    id: "terrain",
    thumbnailUrl: "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png",
    baseLayers: layerCollection
};

const stamen = new Basemap(bmProps);

const map = new EsriMap({
    basemap: "satellite" as any,
    ground: "world-elevation" as any
});

const initCamera: CameraProperties = {
    heading: 124.7,
    tilt: 82.9,
    position: {
        latitude: 40.713906,
        longitude: -111.848111,
        z: 1990
    }
};
const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: initCamera,
    constraints: {
        altitude: {
            max: 500000
        }
    }
});
view.then(() => {
    var toggle = new BasemapToggle({
        titleVisible: true,
        view: view,
        nextBasemap: stamen
    });
    view.ui.add(toggle, "top-right");
});
