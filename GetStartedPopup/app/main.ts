import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import Locator = require("esri/tasks/Locator");

const locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
});

const map = new EsriMap({
    basemap: "streets-navigation-vector" as string as any
});
const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-116.3031, 43.6088] as number[] as any,
    zoom: 12
});

view.on("click", function (event) {
    event.stopPropagation();
    const lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    const lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
    view.popup.open({
        title: "Reverse geocode [" + lon + ", " + lat + "]",
        location: event.mapPoint
    });

    locatorTask.locationToAddress(event.mapPoint).then((response) => {
        view.popup.content = response.attributes.Match_addr;
    }, () => {
        view.popup.content = "No address found for this location";
    });

});