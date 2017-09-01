/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import Elevationlayer = require("esri/layers/ElevationLayer");
import BaseElevationLayer = require("esri/layers/BaseElevationLayer");
import Basemap = require("esri/Basemap");

interface ElevationTileData {
    values: Float32Array;
    width: number;
    height: number;
    maxZError: number;
    noDataValue: number;
}
@subclass("esri.layers.ExaggeratedElevationLayer")
class ExaggeratedElevationlayer extends declared(BaseElevationLayer) {
    @property()
    exaggeration: number = 100;
    @property()
    _elevation: Elevationlayer;

    load(): IPromise<any> {
        this._elevation = new Elevationlayer({
            url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        });
        // wait for elevation layer to load before resolving load
        return this.addResolvingPromise(this._elevation.load());
    }

    fetchTile(level: number, row: number, column: number): IPromise<ElevationTileData> {
        return this._elevation.fetchTile(level, row, column).then((data) => {
            const exaggeration = this.exaggeration;
            data.values.forEach((value: number, index: number, values: Float32Array) => {
                values[index] = value * exaggeration;
            });
            return data;
        });
    }
}

const map = new Map({
    basemap: Basemap.fromId("satellite"),
    ground: {
        layers: [
            new ExaggeratedElevationlayer()
        ]
    }
});
var view = new SceneView({
    container: "viewDiv",
    viewingMode: "global",
    map: map,
    camera: {
        position: {
            x: -168869,
            y: 3806095,
            z: 1618269,
            spatialReference: {
                wkid: 102100
            }
        },
        heading: 17,
        tilt: 48
    }
});

