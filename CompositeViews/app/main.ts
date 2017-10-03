import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import Legend = require("esri/widgets/Legend");

const layer = new FeatureLayer({
    portalItem: {
        id: "ece283e7378c4cd4954c36fa92826d10"
    },
    outFields: ["COUNTY", "STATE", "TOTPOP_CY"]
});


const map = new Map({
    layers: [layer]
});

const mainView = new MapView({
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

const akView = new MapView({
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

const hiView = new MapView({
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

let highlight: any = null;


function enableHighlightOnPointerMove(view: MapView) {
    view.whenLayerView(layer).then((layerView: FeatureLayerView) => {
        view.on("pointer-move", (event) => {
            view.hitTest(event).then((r) => {
                // Remove existing highlight 
                if (highlight) {
                    highlight.remove();
                    highlight = null;
                }

                if (r.results.length && r.results.length > 0) {
                    const feature = r.results[0].graphic;
                    feature.popupTemplate = layer.popupTemplate;
                    const id = feature.attributes.OBJECTID;
                    highlight = layerView.highlight([id]);
                    const selectionId = mainView.popup.selectedFeature ? mainView.popup.selectedFeature.attributes.OBJECTID : null;
                    if (highlight && (id !== selectionId)) {
                        mainView.popup.open({
                            features: [feature],
                            updateLocationEnabled: true
                        });
                    }
                } else {
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
function disableNavigation(view: MapView) {
    view.popup.dockEnabled = true;
    // remove zoom action 
    view.popup.actions = [] as any;

    // disable mouse nav 
    view.on("mouse-wheel", (e) => {
        e.stopPropagation();
    });
    view.on("double-click", (e) => {
        e.stopPropagation();
    });
    view.on("double-click", (e) => {
        e.stopPropagation();
    });
    view.on("drag", (e) => {
        e.stopPropagation();
    });
    view.on("drag", ["Shift"], (e) => {
        e.stopPropagation();
    });
    view.on("drag", ["Shift", "Control"], (e) => {
        e.stopPropagation();
    });
    view.on("key-down", (e) => {
        const prohibtedKeys = ["+", "-", "Shift", "_", "="];
        const keyPressed = e.key;
        if (prohibtedKeys.indexOf(keyPressed) !== -1) {
            e.stopPropagation();
        }
    });
    return view;
}
function disablePopupOnClick(view: MapView) {
    view.on("click", (e) => {
        e.stopPropagation();
    });
    return view
}