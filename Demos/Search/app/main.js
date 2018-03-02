define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/widgets/Search"], function (require, exports, WebMap, MapView, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebMap({
        portalItem: {
            id: "7d5cdddd1cdf44a2907a1bfd7fdac368"
        }
    });
    var view = new MapView({
        map: map,
        container: "viewDiv"
    });
    var search = new Search({
        view: view
    });
    view.ui.add(search, "top-left");
    view.popup.watch("visible", function () {
        if (view.popup.visible) {
            view.popup.focus();
        }
        else {
            search.focus();
        }
    });
});
//# sourceMappingURL=main.js.map