import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import Print = require("esri/widgets/Print");
import VectorTileLayer = require("esri/layers/VectorTileLayer");

const tileLayer = new VectorTileLayer({
    url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_Childrens_Map/VectorTileServer/resources/styles/root.json"
});
const map = new Map({
    layers: [tileLayer]
});

const view = new MapView({
    center: [-98.57, 39.82] as any,
    zoom: 3,
    container: "viewDiv",
    map: map
});

view.then(() => {
    const print = new Print({
        view: view,
        printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });
    view.ui.add(print, "top-right");
});