define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/core/Collection"], function (require, exports, WebMap, MapView, Collection) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebMap({
        portalItem: {
            id: "8765c14627064b609de662d13131fa96"
        }
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        popup: {
            dockEnabled: true,
            actions: []
        }
    });
    view.then(disableZooming);
    function disableZooming(view) {
        var _this = this;
        // Dock the popup and remove zoom action 
        view.popup.dockEnabled = true;
        view.popup.actions = new Collection();
        // Remove zoom controls 
        view.ui.components = ["attribution"];
        view.on("mouse-wheel", stopEventPropogation);
        // double-click zoom 
        view.on("double-click", stopEventPropogation);
        // double-click + Ctrl zoom 
        view.on("double-click", ["Control"], stopEventPropogation);
        // pan 
        view.on("drag", stopEventPropogation);
        //zoombox  (shift - drag and shift - control - drag)
        view.on("drag", ["Shift"], stopEventPropogation);
        view.on("drag", ["Shift", "Control"], stopEventPropogation);
        // zoom with + and - keys 
        view.on("key-down", function (evt) {
            var prohibitedKeys = ["+", "-", "Shift", "_", "="];
            var keyPressed = evt.key;
            if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                _this.stopPropogation();
            }
        });
    }
    function stopEventPropogation(evt) {
        evt.stopPropogation();
    }
});
//# sourceMappingURL=main.js.map