var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "dojo/i18n!./nls/resources", "esri/core/Accessor", "esri/WebMap", "esri/Graphic", "esri/geometry/geometryEngineAsync", "ApplicationBase/support/itemUtils", "./splitMaps", "esri/core/accessorSupport/decorators", "esri/layers/GraphicsLayer", "esri/core/requireUtils", "esri/core/watchUtils"], function (require, exports, __extends, __decorate, i18n, Accessor, WebMap, Graphic, geometryEngineAsync, itemUtils_1, splitMaps_1, decorators_1, GraphicsLayer, requireUtils, watchUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var expandOpen = "esri-icon-zoom-out-fixed";
    var expandClose = "esri-icon-zoom-in-fixed";
    var scale = 4;
    var width = 250;
    var height = 250;
    var defaultDirectionSymbol = {
        type: "text",
        color: "#333",
        text: "\ue688",
        angle: 0,
        font: {
            size: 18,
            family: "CalciteWebCoreIcons"
        }
    };
    var InsetMap = /** @class */ (function (_super) {
        __extends(InsetMap, _super);
        function InsetMap(params) {
            var _this = _super.call(this, params) || this;
            _this.mainView = params.mainView;
            _this.config = params.config;
            _this.basemap = _this.config.insetBasemap || _this.mainView.map.basemap;
            if (_this.config.locationColor) {
                defaultDirectionSymbol.color = _this.config.locationColor;
            }
            _this.mapId = _this.config.webmap || null;
            return _this;
        }
        InsetMap.prototype.createInsetView = function () {
            return __awaiter(this, void 0, void 0, function () {
                var insetDiv, mapProps, inset, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            insetDiv = document.getElementById("mapInset");
                            mapProps = {};
                            if (this.mapId && this.config.useWebMap) {
                                mapProps.portalItem = { id: this.mapId };
                            }
                            else {
                                mapProps.basemap = this.basemap;
                            }
                            inset = itemUtils_1.createView({
                                map: new WebMap(mapProps),
                                extent: this.mainView.extent,
                                scale: this.mainView.scale * scale * Math.max(this.mainView.width / width, this.mainView.height / height),
                                container: insetDiv,
                                constraints: {
                                    snapToZoom: false,
                                    rotationEnabled: false
                                },
                                ui: {
                                    components: []
                                }
                            });
                            _a = this;
                            return [4 /*yield*/, inset.then()];
                        case 1:
                            _a.insetView = (_b.sent());
                            this.graphicsLayer = new GraphicsLayer();
                            this.insetView.map.add(this.graphicsLayer);
                            watchUtils.once(this.insetView, "updating", function () {
                                var index = _this.insetView.layerViews.length > 0 ? _this.insetView.layerViews.length : 0;
                                _this.insetView.map.reorder(_this.graphicsLayer, index);
                            });
                            insetDiv.classList.remove("hide");
                            this._setupSync();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InsetMap.prototype._setupSync = function () {
            var _this = this;
            var expandButton = document.createElement("button");
            expandButton.classList.add("esri-widget--button", expandOpen);
            expandButton.title = i18n.tools.expand;
            expandButton.setAttribute("aria-label", i18n.tools.expand);
            this.insetView.ui.add(expandButton, this.config.controlPosition);
            this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
            this.insetView.when(function () {
                _this._updatePosition();
                _this._syncViews();
            });
            var viewContainerNode = document.getElementById("viewContainer");
            var splitter = null;
            var splitterOptions = {
                minSize: 0,
                gutterSize: 20
            };
            if (this.config.splitDirection === "vertical") {
                // stack maps on top of each other 
                splitterOptions.direction = "vertical";
            }
            else {
                splitterOptions.sizes = [50, 50];
            }
            expandButton.addEventListener("click", function () {
                if (expandButton.classList.contains(expandOpen)) {
                    // Inset so move to full 
                    _this.mainView.ui.remove(_this.insetView.container);
                    viewContainerNode.appendChild(_this.insetView.container);
                    splitter = splitMaps_1.default(["#mapMain", "#mapInset"], splitterOptions);
                    expandButton.title = i18n.tools.collapse;
                }
                else {
                    // Full move to inset  
                    if (splitter) {
                        splitter.destroy();
                    }
                    _this.mainView.ui.add(_this.insetView.container, _this.config.insetPosition);
                    // expand inset a bit 
                    _this.insetView.extent.expand(0.5);
                    expandButton.title = i18n.tools.expand;
                }
                _this._updatePosition();
                expandButton.classList.toggle(expandOpen);
                expandButton.classList.toggle(expandClose);
            });
            // Start with inset map expanded
            if (this.config.insetExpand) {
                expandButton.click();
            }
        };
        InsetMap.prototype._syncViews = function () {
            var _this = this;
            this.extentWatchHandle = watchUtils.pausable(this.mainView, "extent", function () { return _this._updatePosition(); });
            this.cameraWatchHandle = watchUtils.pausable(this.mainView, "camera", function () { return _this._updatePosition(); });
            this.insetView.on("immediate-click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.mainView.map.ground.queryElevation(e.mapPoint)];
                        case 1:
                            result = _a.sent();
                            return [4 /*yield*/, this.mainView.goTo({
                                    target: result.geometry
                                }, { animate: true })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            requireUtils.when(require, [
                "esri/views/2d/draw/support/GraphicMover"
            ]).then(function (GraphicMover) {
                // Setup ability to click and drag graphic
                if (GraphicMover[0]) {
                    _this.mover = new GraphicMover[0]({
                        view: _this.insetView,
                        graphics: _this.graphicsLayer.graphics
                    });
                    _this.mover.on("graphic-move-stop", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this._pauseAndUpdate(this.insetView.toMap(e.screenPoint), false);
                            return [2 /*return*/];
                        });
                    }); });
                    _this.mover.on("graphic-pointer-over", function (e) {
                        _this.insetView.set("cursor", "move");
                    });
                    _this.mover.on("graphic-pointer-out", function (e) {
                        _this.insetView.set("cursor", "pointer");
                    });
                }
            });
        };
        InsetMap.prototype._pauseAndUpdate = function (mapPoint, animate) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.extentWatchHandle.pause();
                            this.cameraWatchHandle.pause();
                            return [4 /*yield*/, this.mainView.map.ground.queryElevation(mapPoint)];
                        case 1:
                            result = _a.sent();
                            return [4 /*yield*/, this.mainView.goTo({
                                    target: result.geometry
                                }, { animate: animate })];
                        case 2:
                            _a.sent();
                            this.extentWatchHandle.resume();
                            this.cameraWatchHandle.resume();
                            geometryEngineAsync.contains(this.insetView.extent, result.geometry).then(function (contains) {
                                if (!contains) {
                                    _this._panInsetView(result.geometry, false);
                                }
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        // TODO the issue is that if you want to show the graphic moving you can't
        // show the map moving....Setup simple sample
        // Can make this work with svg added via html but ...
        InsetMap.prototype._panInsetView = function (geometry, animate) {
            if (animate === void 0) { animate = false; }
            this.insetView.goTo(geometry, { animate: animate });
        };
        InsetMap.prototype._updatePosition = function (geometry) {
            this.graphicsLayer.removeAll();
            var position = geometry || this.mainView.camera.position;
            defaultDirectionSymbol.angle = this._getHeadingAdjustment(this.mainView.camera.heading);
            var g = new Graphic({
                geometry: position,
                symbol: defaultDirectionSymbol
            });
            this.graphicsLayer.add(g);
            // Testing code to add svg via html 
            var svgContainer = document.getElementById("svgContainer");
            svgContainer.innerHTML = null;
            var screenPt = this.insetView.toScreen(position);
            var icon = "<svg style=\"top:" + screenPt.x.toString() + "px; left:" + screenPt.y.toString() + "px; fill:green; transform:rotate(" + defaultDirectionSymbol.angle.toPrecision(2) + "deg);\" xmlns=\"http://www.w3.org/2000/svg\" width=\"36\" height=\"36\" viewBox=\"0 0 36 36\"\n        class=\"svg-content direction\">\n        <path d=\"M13.334 18.667L16 32 32 0 0 16z\" /></svg>";
            svgContainer.innerHTML = icon;
            // Pan to graphic if it moves out of inset view 
            // watchUtils.whenFalseOnce(this.mainView, "interacting", () => {
            this._panInsetView(position, false);
            //});
        };
        InsetMap.prototype._getHeadingAdjustment = function (heading) {
            if ("orientation" in window) {
                var orientation_1 = window.orientation;
                if (typeof orientation_1 !== "number") {
                    return heading;
                }
                var offset = heading + orientation_1;
                var adjustment = offset > 360 ? offset - 360 : offset < 0 ? offset + 360 : offset;
                return adjustment;
            }
            return heading;
        };
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "locationLayer", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "insetView", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "mainView", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "basemap", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "mapId", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "config", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "graphicsLayer", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "mover", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "extentWatchHandle", void 0);
        __decorate([
            decorators_1.property()
        ], InsetMap.prototype, "cameraWatchHandle", void 0);
        InsetMap = __decorate([
            decorators_1.subclass()
        ], InsetMap);
        return InsetMap;
    }(decorators_1.declared(Accessor)));
    exports.default = InsetMap;
});
//# sourceMappingURL=InsetMap.js.map