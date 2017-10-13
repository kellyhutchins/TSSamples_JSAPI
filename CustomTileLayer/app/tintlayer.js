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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/Color", "esri/request", "esri/layers/BaseTileLayer"], function (require, exports, __extends, __decorate, decorators_1, Color, esriRequest, BaseTileLayer) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TintLayer = (function (_super) {
        __extends(TintLayer, _super);
        function TintLayer(params) {
            return _super.call(this) || this;
        }
        TintLayer.prototype.getTileUrl = function (level, row, col) {
            return this.urlTemplate.replace("{z}", "" + level).replace("{x}", "" + col).replace("{y}", "" + row);
        };
        TintLayer.prototype.fetchTile = function (level, row, col) {
            var _this = this;
            var url = this.getTileUrl(level, row, col);
            return esriRequest(url, {
                responseType: "image",
                allowImageDataAccess: true
            })
                .then(function (response) {
                var image = response.data;
                var size = _this.tileInfo.size[0];
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = size;
                canvas.height = size;
                // apply the tint color
                if (_this.tint) {
                    context.fillStyle = _this.tint.toCss();
                    context.fillRect(0, 0, size, size);
                    // Apply difference blending operation
                    context.globalCompositeOperation = "difference";
                }
                context.drawImage(image, 0, 0, size, size);
                return canvas;
            });
        };
        __decorate([
            decorators_1.property()
        ], TintLayer.prototype, "urlTemplate", void 0);
        __decorate([
            decorators_1.property({ type: Color })
        ], TintLayer.prototype, "tint", void 0);
        TintLayer = __decorate([
            decorators_1.subclass("esri.layers.TintLayer")
        ], TintLayer);
        return TintLayer;
    }(decorators_1.declared(BaseTileLayer)));
    exports.TintLayer = TintLayer;
});
//# sourceMappingURL=tintlayer.js.map