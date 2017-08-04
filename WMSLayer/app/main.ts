import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import WMSLayer = require("esri/layers/WMSLayer");
import esriConfig = require("esri/config");
import Scalebar = require("esri/widgets/ScaleBar");
import Search = require("esri/widgets/Search");

esriConfig.request.corsEnabledServers.push("mesonet.agron.iastate.edu");

const layer = new WMSLayer({
    url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/goes/conus_ir.cgi"
});

const map = new Map({
    layers: [layer]
});
const view = new MapView({
    map: map,
    container: "viewDiv"
});
view.then(function () {
    view.extent = layer.fullExtent;

    const search = new Search({
        view: view
    });
    view.ui.add(search, "top-right");

    const scalebar = new Scalebar({
        view: view
    });
    view.ui.add(scalebar, "bottom-left");

});