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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
define(["require", "exports", "dojo/i18n!./nls/resources", "./InsetMap", "esri/core/requireUtils", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper"], function (require, exports, i18n, InsetMap_1, requireUtils, itemUtils_1, domHelper_1) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    var SceneExample = /** @class */ (function () {
        function SceneExample() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        SceneExample.prototype.init = function (base) {
            var _this = this;
            if (!base) {
                console.error("ApplicationBase is not defined");
                return;
            }
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results, settings = base.settings;
            var find = config.find, marker = config.marker;
            var webSceneItems = results.webSceneItems;
            var validWebSceneItems = webSceneItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebSceneItems[0];
            if (!firstItem) {
                console.error("Could not load an item to display");
                return;
            }
            config.title = !config.title ? itemUtils_1.getItemTitle(firstItem) : config.title;
            domHelper_1.setPageTitle(config.title);
            if (config.titleLink) {
                config.title = "<a href=\"" + config.titleLink + "\" >" + config.title + "</a>";
            }
            document.getElementById("title").innerHTML = config.title;
            var portalItem = this.base.results.applicationItem.value;
            var appProxies = portalItem && portalItem.appProxies ? portalItem.appProxies : null;
            // Setup splash screen if enabled 
            if (this.base.config.splash) {
                calcite.init();
                var splashButton = document.getElementById("splashButton");
                splashButton.classList.remove("hide");
                document.getElementById("splashContent").innerHTML = this.base.config.splashDesc;
                document.getElementById("splashTitle").innerHTML = this.base.config.splashTitle;
                document.getElementById("splashOkButton").innerHTML = this.base.config.splashButtonLabel;
                if (this.base.config.splashOnStart) {
                    // enable splash screen when app loads then 
                    // set info in session storage when its closed 
                    // so we don't open again this session. 
                    if (!sessionStorage.getItem("disableSplash")) {
                        calcite.bus.emit("modal:open", { id: "splash" });
                    }
                    sessionStorage.setItem("disableSplash", "true");
                }
            }
            var viewContainerNode = document.getElementById("viewContainer");
            if (this.base.config.splitDirection === "vertical") {
                // vertical is maps stacked vertically. Horizontal is side by side
                viewContainerNode.classList.add("direction-vertical");
            }
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            var item = firstItem;
            var container = {
                container: document.getElementById("mapMain") //viewNode
            };
            var viewProperties = __assign({}, defaultViewProperties, container);
            var basemapUrl = config.basemapUrl, basemapReferenceUrl = config.basemapReferenceUrl;
            itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                return itemUtils_1.createView(__assign({}, viewProperties, { map: map })).then(function (view) {
                    view.when(function () { return __awaiter(_this, void 0, void 0, function () {
                        var insetMap;
                        return __generator(this, function (_a) {
                            insetMap = new InsetMap_1.default({ mainView: view, config: this.base.config });
                            insetMap.createInsetView();
                            // Get inset view when ready 
                            insetMap.watch("insetView", function () {
                                var insetView = insetMap.insetView;
                            });
                            return [2 /*return*/];
                        });
                    }); });
                    itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                    _this._addMeasureWidgets(view, _this.base.config);
                });
            });
            document.body.classList.remove(CSS.loading);
        };
        SceneExample.prototype._addMeasureWidgets = function (view, config) {
            return __awaiter(this, void 0, void 0, function () {
                var measureRequire, DirectLineMeasurement3D_1, AreaMeasurement3D_1, nav, measureTool_1, type_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!config.measurement) return [3 /*break*/, 2];
                            return [4 /*yield*/, requireUtils.when(require, [
                                    "esri/widgets/DirectLineMeasurement3D", "esri/widgets/AreaMeasurement3D"
                                ])];
                        case 1:
                            measureRequire = _a.sent();
                            if (measureRequire && measureRequire.length && measureRequire.length > 1) {
                                DirectLineMeasurement3D_1 = measureRequire[0];
                                AreaMeasurement3D_1 = measureRequire[1];
                                nav = document.createElement("nav");
                                nav.classList.add("leader-1");
                                measureTool_1 = null;
                                nav.appendChild(this._createMeasureButton("area"));
                                nav.appendChild(this._createMeasureButton("line"));
                                nav.addEventListener("click", function (e) {
                                    var button = e.target;
                                    if (measureTool_1) {
                                        measureTool_1.destroy();
                                        view.ui.remove(measureTool_1);
                                    }
                                    // don't recreate if its the same button 
                                    if (type_1 && type_1 === button.dataset.type) {
                                        type_1 = null;
                                    }
                                    else {
                                        type_1 = button.dataset.type;
                                        if (type_1 === "area") {
                                            measureTool_1 = new AreaMeasurement3D_1({
                                                view: view
                                            });
                                        }
                                        else {
                                            measureTool_1 = new DirectLineMeasurement3D_1({
                                                view: view
                                            });
                                        }
                                        view.ui.add(measureTool_1, config.measurementPosition);
                                    }
                                });
                                /* const areaButton = document.createElement("button");
                                 areaButton.classList.add("esri-widget-button", "btn", "btn-grouped", "esri-icon-polygon");
                                 areaButton.title = i18n.tools.measureArea;
                                 areaButton.setAttribute("aria-label", i18n.tools.measureArea);
                                 areaButton.addEventListener("click", () => {
                                   if (measureTool) {
                                     measureTool.destroy();
                                     view.ui.remove(measureTool);
                                   }
                                   measureTool = new AreaMeasurement3D({
                                     view: view
                                   });
                                   view.ui.add(measureTool, config.measurementPosition);
                                 });
                                 nav.appendChild(areaButton);
                                 const lineButton = document.createElement("button");
                                 lineButton.classList.add("esri-widget-button", "btn", "btn-grouped", "esri-icon-polyline");
                                 lineButton.title = i18n.tools.measureLine;
                                 lineButton.setAttribute("aria-label", i18n.tools.measureLine);
                                 lineButton.addEventListener("click", () => {
                                   if (measureTool) {
                                     measureTool.destroy();
                                     view.ui.remove(measureTool);
                                   }
                                   measureTool = new DirectLineMeasurement3D({
                                     view: view
                                   });
                                   view.ui.add(measureTool, config.measurementPosition);
                                 });
                                 nav.appendChild(lineButton);*/
                                view.ui.add(nav, config.measurementPosition);
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        SceneExample.prototype._createMeasureButton = function (type) {
            var button = document.createElement("button");
            var icon = type === "area" ? "esri-icon-polygon" : "esri-icon-polyline";
            var label = type === "area" ? i18n.tools.measureArea : i18n.tools.measureLine;
            button.dataset.type = type;
            button.classList.add("esri-widget-button", "btn", "btn-grouped", icon);
            button.title = label;
            button.setAttribute("aria-label", label);
            return button;
        };
        return SceneExample;
    }());
    return SceneExample;
});
//# sourceMappingURL=Main.js.map