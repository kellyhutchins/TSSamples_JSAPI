/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  subclass,
  declared,
  property
} from "esri/core/accessorSupport/decorators";

import Map = require("esri/Map");
import Color = require("esri/Color");
import esriConfig = require("esri/config");
import esriRequest = require("esri/request");
import SceneView = require("esri/views/SceneView");
import BaseTileLayer = require("esri/layers/BaseTileLayer");

import BaseTileLayerProperties = __esri.BaseTileLayerProperties;

interface TintLayerProperties extends BaseTileLayerProperties {
  urlTemplate: string;
  tint: string | Color;
}

@subclass("esri.layers.TintLayer")
class TintLayer extends declared(BaseTileLayer) {

  constructor(params?: TintLayerProperties) {
    super();
  }

  @property()
  urlTemplate: string;

  @property({ type: Color })
  tint: Color;

  getTileUrl(level: number, row: number, col: number): string {
    return this.urlTemplate.replace("{z}", `${level}`).replace("{x}", `${col}`).replace("{y}", `${row}`);
  }

  fetchTile(level: number, row: number, col: number): IPromise<HTMLCanvasElement> {
    const url = this.getTileUrl(level, row, col);

    return esriRequest(url, {
      responseType: "image",
      allowImageDataAccess: true
    })
      .then((response: any) => {
        const image = response.data;
        const [size] = this.tileInfo.size;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        // apply the tint color
        if (this.tint) {
          context.fillStyle = this.tint.toCss();
          context.fillRect(0, 0, size, size);

          // Apply difference blending operation
          context.globalCompositeOperation = "difference";
        }
        context.drawImage(image, 0, 0, size, size);
        return canvas;
      });
  }
}

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

