import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import Search = require("esri/widgets/Search");

const map = new Map({
    basemap: "dark-gray" as any
});
const view = new SceneView({
    map: map,
    container: "viewDiv",
    center: [-106.45, 31.76] as any,
    zoom: 16
});

// Create a logo image 
const logo = document.createElement("img");
logo.src = "https://placeholdit.imgix.net/~text?bg=000&txtclr=e8117f&txtsize=48&txt=logo&w=100&h=80";
logo.title = "Logo";

const search = new Search({
    view: view
});

view.ui.add(logo, "bottom-right");
view.ui.add(search, "top-right");