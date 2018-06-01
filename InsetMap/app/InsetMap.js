/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/Accessor", "esri/WebMap", "esri/Graphic", "esri/geometry/geometryEngineAsync", "ApplicationBase/support/itemUtils", "./splitMaps", "esri/core/accessorSupport/decorators"], function (require, exports, __extends, __decorate, Accessor, WebMap, Graphic, geometryEngineAsync, itemUtils_1, splitMaps_1, decorators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var expandOpen = "esri-icon-zoom-out-fixed";
    var expandClose = "esri-icon-zoom-in-fixed";
    var scale = 4;
    var width = 250;
    var height = 250;
    var defaultDirectionSymbol = {
        type: "picture-marker",
        url: "assets/viewpoint.png",
        width: 60,
        height: 40,
        angle: 0
    };
    /*const defaultLocationSymbol = {
        type: "simple-marker",
        style: "path",
        path: "M23.3 36.98L46.56 8c-.9-.68-9.85-8-23.28-8S.9 7.32 0 8l23.26 28.98.02.02.02-.02z",
        size: 20,
        color: [71, 71, 71, 0.25]
    }*/
    /*const defaultDirectionSymbol = {
        type: "text",
        color: "#333",
        text: "\ue666",
        angle: 0,
        font: {
            size: 14,
            family: "CalciteWebCoreIcons"
        }
    };*/
    var InsetMap = /** @class */ (function (_super) {
        __extends(InsetMap, _super);
        function InsetMap(params) {
            var _this = _super.call(this, params) || this;
            _this.mainView = params.mainView;
            _this.config = params.config;
            _this.basemap = _this.config.insetBasemap || _this.mainView.map.basemap;
            if (_this.config.locationColor) {
                //  defaultDirectionSymbol.color = this.config.locationColor;
            }
            _this.mapId = _this.config.webmap || null;
            return _this;
        }
        InsetMap.prototype.createInsetView = function () {
            return __awaiter(this, void 0, void 0, function () {
                var insetDiv, mapProps, inset, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            insetDiv = document.getElementById("mapInset");
                            mapProps = {};
                            if (this.mapId) {
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
                            insetDiv.classList.remove("hide");
                            this._setupSync();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InsetMap.prototype._setupSync = function () {
            var _this = this;
            // TODO a11y for button (title)
            var expandButton = document.createElement("button");
            expandButton.classList.add("esri-widget--button", expandOpen);
            expandButton.title = "Expand";
            expandButton.setAttribute("aria-label", "Expand");
            this.insetView.ui.add(expandButton, this.config.controlPosition);
            this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
            this.insetView.when(function () {
                _this._syncViews();
                _this.insetView.goTo({ target: _this.mainView.center });
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
                    _this.insetView.zoom = _this.mainView.zoom;
                    _this.insetView.center = _this.mainView.camera.position;
                }
                else {
                    // Full move to inset  
                    if (splitter) {
                        splitter.destroy();
                    }
                    _this.mainView.ui.add(_this.insetView.container, _this.config.insetPosition);
                    _this.insetView.goTo({
                        target: _this.mainView.camera.position,
                        scale: _this.mainView.scale *
                            scale *
                            Math.max(_this.mainView.width / _this.insetView.width, _this.mainView.height / _this.insetView.height)
                    }, { animate: true });
                }
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
            this.mainView.watch("extent", function () { return _this._updatePosition(); });
            this.mainView.watch("camera", function () { return _this._updatePosition(); });
            this.insetView.on("immediate-click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.mainView.map.ground.queryElevation(e.mapPoint)];
                        case 1:
                            result = _a.sent();
                            this.mainView.goTo({
                                target: result.geometry
                            });
                            this._updatePosition();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        InsetMap.prototype._updatePosition = function () {
            var _this = this;
            this.insetView.graphics.removeAll();
            var position = this.mainView.camera.position;
            defaultDirectionSymbol.angle = this.mainView.camera.heading;
            this.insetView.graphics.add(new Graphic({
                geometry: position,
                symbol: defaultDirectionSymbol
            }));
            // Pan to graphic if it moves out of inset view 
            geometryEngineAsync.contains(this.insetView.extent, position).then(function (contains) {
                if (!contains) {
                    _this.insetView.goTo(position);
                }
            });
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
        InsetMap = __decorate([
            decorators_1.subclass()
        ], InsetMap);
        return InsetMap;
    }(decorators_1.declared(Accessor)));
    exports.default = InsetMap;
});
//# sourceMappingURL=InsetMap.js.map