define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/WMSLayer", "esri/config", "esri/widgets/ScaleBar", "esri/widgets/Search"], function (require, exports, Map, MapView, WMSLayer, esriConfig, Scalebar, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    esriConfig.request.corsEnabledServers.push("mesonet.agron.iastate.edu");
    var layer = new WMSLayer({
        url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi"
    });
    var map = new Map({
        layers: [layer]
    });
    var view = new MapView({
        map: map,
        container: "viewDiv"
    });
    view.then(function () {
        view.extent = layer.fullExtent;
        var search = new Search({
            view: view
        });
        view.ui.add(search, "top-right");
        var scalebar = new Scalebar({
            view: view
        });
        view.ui.add(scalebar, "bottom-left");
    });
});
//# sourceMappingURL=main.js.map