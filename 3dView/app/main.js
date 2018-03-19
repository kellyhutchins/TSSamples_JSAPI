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
define(["require", "exports", "esri/WebScene", "esri/views/MapView", "esri/views/SceneView", "esri/widgets/Home", "esri/widgets/Fullscreen", "esri/Graphic"], function (require, exports, WebScene, MapView, SceneView, Home, FullScreen, Graphic) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    createView(new WebScene({
        portalItem: {
            id: "53ed0a887ec7409692a7d1c6ba0e6763"
        },
        ground: "world-elevation"
    }));
    function createView(map) {
        return __awaiter(this, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = new SceneView({
                            map: map,
                            container: "viewDiv"
                        });
                        return [4 /*yield*/, view.when()];
                    case 1:
                        _a.sent();
                        addWidgets(view);
                        return [2 /*return*/];
                }
            });
        });
    }
    function addWidgets(view) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var insetDiv, insetView, viewHandle, scheduleId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view.ui.add(new Home({ view: view }), "top-left");
                        insetDiv = document.createElement("div");
                        insetDiv.classList.add("inset-map");
                        insetView = new MapView({
                            map: view.map,
                            center: view.center,
                            scale: view.scale * 2 * Math.max(view.width / 250, view.height / 250),
                            container: insetDiv,
                            constraints: {
                                rotationEnabled: false,
                                snapToZoom: false
                            },
                            ui: {
                                components: []
                            }
                        });
                        view.ui.add(insetView.container, "bottom-left");
                        insetView.ui.add(new FullScreen({ view: insetView }), "bottom-left");
                        return [4 /*yield*/, insetView.when()];
                    case 1:
                        _a.sent();
                        updateGraphic(view, insetView);
                        view.watch("interacting,animation", function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (viewHandle || scheduleId) {
                                    return [2 /*return*/];
                                }
                                scheduleId = setTimeout(function () {
                                    scheduleId = null;
                                    viewHandle = view.watch("viewpoint", function () {
                                        // update overview 
                                        if (view && view.center) {
                                            insetView.goTo({
                                                center: view.center,
                                                scale: view.scale * 2 * Math.max(view.width / insetView.width, view.height / insetView.height)
                                            });
                                            updateGraphic(view, insetView);
                                        }
                                    });
                                });
                                return [2 /*return*/];
                            });
                        }); });
                        view.watch("stationary", function () {
                            viewHandle = null;
                            scheduleId = null;
                        });
                        insetView.on("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, view.map.ground.queryElevation(e.mapPoint)];
                                    case 1:
                                        result = _a.sent();
                                        view.goTo(result.geometry);
                                        updateGraphic(view, insetView);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    }
    function updateGraphic(view, insetView) {
        insetView.graphics.removeAll();
        var location = new Graphic({
            geometry: view.center,
            symbol: {
                type: "text",
                color: "#FFFF00",
                text: "\ue688",
                angle: view.camera.heading,
                font: {
                    size: 22,
                    family: "CalciteWebCoreIcons"
                }
            }
        });
        insetView.graphics.add(location);
    }
});
//# sourceMappingURL=main.js.map