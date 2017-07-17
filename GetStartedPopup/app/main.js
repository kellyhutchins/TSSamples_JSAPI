define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/tasks/Locator"], function (require, exports, EsriMap, MapView, Locator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
    var map = new EsriMap({
        basemap: "streets-navigation-vector"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-116.3031, 43.6088],
        zoom: 12
    });
    view.on("click", function (event) {
        event.stopPropagation();
        var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
        var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
        view.popup.open({
            title: "Reverse geocode [" + lon + ", " + lat + "]",
            location: event.mapPoint
        });
        locatorTask.locationToAddress(event.mapPoint).then(function (response) {
            view.popup.content = response.attributes.Match_addr;
        }, function () {
            view.popup.content = "No address found for this location";
        });
    });
});
//# sourceMappingURL=main.js.map