import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Search = require("esri/widgets/Search");

import watchUtils = require("esri/core/watchUtils");

const map = new WebMap({
    portalItem: {
        id: "7d5cdddd1cdf44a2907a1bfd7fdac368"
    }
});
const view = new MapView({
    map: map,
    container: "viewDiv"
});

const search = new Search({
    view
});

view.ui.add(search, "top-left");


view.popup.watch("visible", () => {
    if (view.popup.visible) {
        view.popup.focus();
    } else {
        search.focus();
    }
});