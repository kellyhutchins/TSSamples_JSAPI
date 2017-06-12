define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/Color", "esri/geometry/Point", "esri/geometry/Polyline", "esri/geometry/Polygon", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/TextSymbol"], function (require, exports, Map, MapView, Graphic, Color, Point, Polyline, Polygon, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, TextSymbol) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "hybrid"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-80, 35],
        zoom: 3
    });
    /**********************
     * Create a point graphic
     * at the location of the Titanic
     **********************/
    var point = new Point({
        longitude: -49.97,
        latitude: 41.73
    });
    var markerSymbol = new SimpleMarkerSymbol({
        color: new Color([226, 119, 40]),
        outline: {
            color: new Color([255, 255, 255]),
            width: 2
        }
    });
    var pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
    });
    /******
     * Add text symbol
     */
    var textSymbol = new TextSymbol({
        color: new Color("#fff"),
        text: "Hello World"
    });
    var textGraphic = new Graphic({
        geometry: point,
        symbol: textSymbol
    });
    /**********************
     * Create a polyline graphic
     * at the location of the Keystone Pipeline
     **********************/
    var polyline = new Polyline({
        paths: [
            [
                [-111.30, 52.68],
                [-98, 49.5],
                [-93.94, 29.89]
            ]
        ]
    });
    var lineSymbol = new SimpleLineSymbol({
        color: new Color([226, 119, 40]),
        width: 4
    });
    var lineAttributes = {
        Name: "Keystone Pipeline",
        Owner: "TransCanada",
        Length: "3,456 km"
    };
    var polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: lineSymbol,
        attributes: lineAttributes,
        popupTemplate: {
            title: "{Name}",
            content: [{
                    type: "fields",
                    fieldInfos: [{
                            fieldName: "Name"
                        }, {
                            fieldName: "Owner"
                        }, {
                            fieldName: "Length"
                        }]
                }]
        }
    });
    /****************
     * Create a polygon graphic
     * **************** */
    var polygon = new Polygon({
        rings: [[
                [-64.78, 32.3],
                [-66.07, 18.45],
                [-80.21, 25.78],
                [-64.78, 32.3]
            ]]
    });
    var fillSymbol = new SimpleFillSymbol({
        color: new Color([227, 139, 79, 0.8]),
        outline: {
            color: new Color([255, 255, 255]),
            width: 1
        }
    });
    var polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol
    });
    view.graphics.addMany([pointGraphic, polylineGraphic, polygonGraphic, textGraphic]);
});
//# sourceMappingURL=main.js.map