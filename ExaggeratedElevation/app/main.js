var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/Map", "esri/views/SceneView", "esri/layers/ElevationLayer", "esri/layers/BaseElevationLayer", "esri/Basemap"], function (require, exports, __extends, __decorate, decorators_1, Map, SceneView, Elevationlayer, BaseElevationLayer, Basemap) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExaggeratedElevationlayer = (function (_super) {
        __extends(ExaggeratedElevationlayer, _super);
        function ExaggeratedElevationlayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.exaggeration = 100;
            return _this;
        }
        ExaggeratedElevationlayer.prototype.load = function () {
            this._elevation = new Elevationlayer({
                url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            // wait for elevation layer to load before resolving load
            return this.addResolvingPromise(this._elevation.load());
        };
        ExaggeratedElevationlayer.prototype.fetchTile = function (level, row, column) {
            var _this = this;
            return this._elevation.fetchTile(level, row, column).then(function (data) {
                var exaggeration = _this.exaggeration;
                data.values.forEach(function (value, index, values) {
                    values[index] = value * exaggeration;
                });
                return data;
            });
        };
        __decorate([
            decorators_1.property()
        ], ExaggeratedElevationlayer.prototype, "exaggeration", void 0);
        __decorate([
            decorators_1.property()
        ], ExaggeratedElevationlayer.prototype, "_elevation", void 0);
        ExaggeratedElevationlayer = __decorate([
            decorators_1.subclass("esri.layers.ExaggeratedElevationLayer")
        ], ExaggeratedElevationlayer);
        return ExaggeratedElevationlayer;
    }(decorators_1.declared(BaseElevationLayer)));
    var map = new Map({
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
});
//# sourceMappingURL=main.js.map