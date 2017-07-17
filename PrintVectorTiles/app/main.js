define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/widgets/Print", "esri/layers/VectorTileLayer"], function (require, exports, Map, MapView, Print, VectorTileLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tileLayer = new VectorTileLayer({
        url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_Childrens_Map/VectorTileServer/resources/styles/root.json"
    });
    var map = new Map({
        layers: [tileLayer]
    });
    var view = new MapView({
        center: [-98.57, 39.82],
        zoom: 3,
        container: "viewDiv",
        map: map
    });
    view.then(function () {
        var print = new Print({
            view: view,
            printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        });
        view.ui.add(print, "top-right");
    });
});
//# sourceMappingURL=main.js.map