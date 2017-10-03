define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Legend"], function (require, exports, Map, MapView, FeatureLayer, Legend) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var layer = new FeatureLayer({
        portalItem: {
            id: "ece283e7378c4cd4954c36fa92826d10"
        },
        outFields: ["COUNTY", "STATE", "TOTPOP_CY"]
    });
    var map = new Map({
        layers: [layer]
    });
    var mainView = new MapView({
        map: map,
        container: "mainViewDiv",
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false,
                position: "top-right"
            }
        },
        extent: {
            xmin: -3071992.803,
            ymin: -458793.154,
            xmax: 2775529.196,
            ymax: 3319990.676,
            spatialReference: {
                wkid: 5070
            }
        },
        spatialReference: {
            wkid: 5070
        }
    });
    mainView.ui.add(new Legend({
        view: mainView
    }), "bottom-right");
    var akView = new MapView({
        container: "akViewDiv",
        map: map,
        extent: {
            xmin: 396381,
            ymin: -2099670,
            xmax: 3393803,
            ymax: 148395,
            spatialReference: {
                wkid: 5936
            }
        },
        spatialReference: {
            wkid: 5936
        },
        ui: {
            components: []
        }
    });
    mainView.ui.add(akView.container, "bottom-left");
    var hiView = new MapView({
        container: "hiViewDiv",
        map: map,
        extent: {
            xmin: -342537,
            ymin: 655453,
            xmax: 231447,
            ymax: 1023383,
            spatialReference: {
                wkid: 102007
            }
        },
        spatialReference: {
            wkid: 102007
        },
        ui: {
            components: []
        }
    });
    mainView.ui.add(hiView.container, "bottom-left");
    mainView
        .then(disableNavigation)
        .then(disablePopupOnClick)
        .then(enableHighlightOnPointerMove);
    akView
        .then(disableNavigation)
        .then(disablePopupOnClick)
        .then(enableHighlightOnPointerMove);
    hiView
        .then(disableNavigation)
        .then(disablePopupOnClick)
        .then(enableHighlightOnPointerMove);
    var highlight = null;
    function enableHighlightOnPointerMove(view) {
        view.whenLayerView(layer).then(function (layerView) {
            view.on("pointer-move", function (event) {
                view.hitTest(event).then(function (r) {
                    // Remove existing highlight 
                    if (highlight) {
                        highlight.remove();
                        highlight = null;
                    }
                    if (r.results.length && r.results.length > 0) {
                        var feature = r.results[0].graphic;
                        feature.popupTemplate = layer.popupTemplate;
                        var id = feature.attributes.OBJECTID;
                        highlight = layerView.highlight([id]);
                        var selectionId = mainView.popup.selectedFeature ? mainView.popup.selectedFeature.attributes.OBJECTID : null;
                        if (highlight && (id !== selectionId)) {
                            mainView.popup.open({
                                features: [feature],
                                updateLocationEnabled: true
                            });
                        }
                    }
                    else {
                        if (mainView.popup.visible) {
                            mainView.popup.close();
                            mainView.popup.clear();
                        }
                    }
                });
            });
        });
        return view;
    }
    function disableNavigation(view) {
        view.popup.dockEnabled = true;
        // remove zoom action 
        view.popup.actions = [];
        // disable mouse nav 
        view.on("mouse-wheel", function (e) {
            e.stopPropagation();
        });
        view.on("double-click", function (e) {
            e.stopPropagation();
        });
        view.on("double-click", function (e) {
            e.stopPropagation();
        });
        view.on("drag", function (e) {
            e.stopPropagation();
        });
        view.on("drag", ["Shift"], function (e) {
            e.stopPropagation();
        });
        view.on("drag", ["Shift", "Control"], function (e) {
            e.stopPropagation();
        });
        view.on("key-down", function (e) {
            var prohibtedKeys = ["+", "-", "Shift", "_", "="];
            var keyPressed = e.key;
            if (prohibtedKeys.indexOf(keyPressed) !== -1) {
                e.stopPropagation();
            }
        });
        return view;
    }
    function disablePopupOnClick(view) {
        view.on("click", function (e) {
            e.stopPropagation();
        });
        return view;
    }
});
//# sourceMappingURL=main.js.map