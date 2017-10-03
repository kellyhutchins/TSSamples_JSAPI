define(["require", "exports", "esri/Map", "esri/views/MapView"], function (require, exports, EsriMap, MapView) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new EsriMap({
        basemap: "streets"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [15, 65],
        zoom: 4
    });
});
//# sourceMappingURL=main.js.map