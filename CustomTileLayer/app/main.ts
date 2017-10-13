
import Map = require("esri/Map");
import esriConfig = require("esri/config");
import SceneView = require("esri/views/SceneView");
import TintLayer = require("app/tintlayer");

esriConfig.request.corsEnabledServers.push("http://tile.stamen.com");

const stamenTintLayer = new TintLayer({
  title: "Stamen Toner",
  tint: "#004FBB",
  urlTemplate: "http://tile.stamen.com/toner/{z}/{x}/{y}.png"
});

const map = new Map({
  layers: [stamenTintLayer]
});

const view = new SceneView({
  map: map,
  center: [0, 30] as any,
  zoom: 3,
  container: "viewDiv"
});
