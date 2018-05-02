/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.​
*/
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
define(["require", "exports", "esri/WebMap", "esri/Graphic", "ApplicationBase/support/itemUtils"], function (require, exports, WebMap, Graphic, itemUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------
    function syncSetup(view, insetView) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // watch for extent and camera changes to update 2d map
                insetView.when(function () {
                    _updateOverview(view, insetView);
                    view.watch("extent", function () { return _updateOverview(view, insetView); });
                    view.watch("camera", function () { return _updateOverview(view, insetView); });
                    insetView.on("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, view.map.ground.queryElevation(e.mapPoint)];
                                case 1:
                                    result = _a.sent();
                                    view.goTo(result.geometry);
                                    _updateGraphic(view, insetView);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
            });
        });
    }
    exports.syncSetup = syncSetup;
    function createInsetView(view) {
        var sceneView = view;
        var insetDiv = document.createElement("div");
        // const viewContainerNode = document.getElementById("viewContainer");
        insetDiv.classList.add("inset-map");
        //viewContainerNode.appendChild(insetDiv);
        return itemUtils_1.createView({
            map: new WebMap({ basemap: view.map.basemap }),
            extent: view.extent,
            scale: view.scale * 4 * Math.max(view.width / 250, view.height / 250),
            container: insetDiv,
            constraints: {
                rotationEnabled: false
            },
            ui: {
                components: []
            }
        });
    }
    exports.createInsetView = createInsetView;
    function addInsetWidgets(insetView, sceneView, config) {
        return __awaiter(this, void 0, void 0, function () {
            var expandButton, viewContainerNode;
            return __generator(this, function (_a) {
                expandButton = document.createElement("button");
                expandButton.classList.add("esri-widget-button", "esri-icon-zoom-out-fixed");
                viewContainerNode = document.getElementById("viewContainer");
                expandButton.addEventListener("click", function () {
                    expandButton.classList.toggle("esri-icon-zoom-in-fixed");
                    expandButton.classList.toggle("esri-icon-zoom-out-fixed");
                    if (expandButton.classList.contains("esri-icon-zoom-out-fixed")) {
                        // Full view move back to inset
                        sceneView.ui.add(insetView.container, config.insetPosition);
                    }
                    else {
                        // inset view move out to full 
                        sceneView.ui.remove(insetView.container);
                        viewContainerNode.appendChild(insetView.container);
                    }
                });
                sceneView.ui.add(insetView.container, config.insetPosition);
                insetView.ui.add(expandButton, config.fullscreenPosition);
                return [2 /*return*/];
            });
        });
    }
    exports.addInsetWidgets = addInsetWidgets;
    function _updateOverview(view, insetView) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(view && insetView)) return [3 /*break*/, 2];
                        return [4 /*yield*/, insetView.goTo({
                                target: view.camera.position,
                                scale: view.scale *
                                    4 *
                                    Math.max(view.width / insetView.width, view.height / insetView.height)
                            })];
                    case 1:
                        _a.sent();
                        _updateGraphic(view, insetView);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function _updateGraphic(view, insetView) {
        insetView.graphics.removeAll();
        insetView.graphics.add(new Graphic({
            geometry: view.camera.position,
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
        }));
    }
});
//# sourceMappingURL=sceneUtils.js.map