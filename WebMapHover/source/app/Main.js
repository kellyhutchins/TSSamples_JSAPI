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
define(["require", "exports", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "esri/widgets/BasemapToggle", "esri/widgets/Legend", "esri/widgets/Expand", "esri/widgets/Home"], function (require, exports, itemUtils_1, domHelper_1, BasemapToggle, Legend, Expand, Home) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    var MapExample = (function () {
        function MapExample() {
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
        MapExample.prototype.init = function (base) {
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
            var webMapItems = results.webMapItems;
            var validWebMapItems = webMapItems.map(function (response) {
                return response.value;
            });
            var firstItem = validWebMapItems[0];
            if (!firstItem) {
                console.error("Could not load an item to display");
                return;
            }
            config.title = !this.base.config.title ? itemUtils_1.getItemTitle(firstItem) : "";
            domHelper_1.setPageTitle(this.base.config.title);
            document.getElementById("appTitle").innerHTML = this.base.config.title;
            var portalItem = this.base.results.applicationItem.value;
            var appProxies = (portalItem && portalItem.appProxies) ? portalItem.appProxies : null;
            var viewContainerNode = document.getElementById("viewContainer");
            // Get url properties like center, extent, zoom
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            validWebMapItems.forEach(function (item) {
                var viewNode = document.createElement("div");
                viewContainerNode.appendChild(viewNode);
                var viewProperties = __assign({ container: viewNode }, defaultViewProperties);
                var basemapUrl = config.basemapUrl, basemapReferenceUrl = config.basemapReferenceUrl;
                itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies })
                    .then(function (map) { return itemUtils_1.createView(__assign({}, viewProperties, { map: map }))
                    .then(function (view) {
                    _this.view = view;
                    _this.view.popup.dockEnabled = true;
                    _this.view.popup.dockOptions = {
                        position: "auto",
                        buttonEnabled: false,
                        breakpoint: false
                    };
                    _this.addWidgets(item);
                })
                    .then(function () { return itemUtils_1.findQuery(find, _this.view)
                    .then(function () { return itemUtils_1.goToMarker(marker, _this.view).then(function () {
                    _this.view.then(function () {
                        var lastHitTest = null;
                        _this.view.on("pointer-move", function (evt) {
                            clearTimeout(lastHitTest);
                            //add a tiny delay before testing
                            lastHitTest = setTimeout(function () {
                                _this.handlePointerMove(evt);
                            }, 50);
                        });
                    });
                }); }); }); });
            });
            document.body.classList.remove(CSS.loading);
        };
        // Methods 
        MapExample.prototype.addWidgets = function (item) {
            if (this.base.config.home) {
                var home = new Home({
                    view: this.view
                });
                this.view.ui.add(home, "top-left");
            }
            if (this.base.config.legend) {
                var legend = new Legend({
                    view: this.view,
                    container: document.createElement("div")
                });
                var legendExpand = new Expand({
                    expandIconClass: "esri-icon-layer-list",
                    view: this.view,
                    content: legend.container,
                    expandTooltip: "Legend" // TODO i18n
                });
                this.view.ui.add(legendExpand, "top-left");
            }
            if (this.base.config.basemapToggle) {
                var basemapToggle = new BasemapToggle({
                    view: this.view,
                    nextBasemap: this.base.config.altBasemap
                });
                this.view.ui.add(basemapToggle, "bottom-right");
            }
            if (this.base.config.info && (item.description !== null || item.snippet !== null)) {
                var infoExpand = new Expand({
                    expandIconClass: "esri-icon-description",
                    expandTooltip: "Details about the map",
                    content: "<div class='info'>" + item.description || item.snippet + "<div>"
                });
                this.view.ui.add(infoExpand, "bottom-left");
            }
        };
        MapExample.prototype.handlePointerMove = function (evt) {
            var _this = this;
            try {
                this.view.hitTest(evt).then(function (results) {
                    if (results.results.length > 0) {
                        var feature = results.results[0].graphic;
                        var isFeatureLayer = feature.layer.declaredClass === "esri.layers.FeatureLayer";
                        if (isFeatureLayer) {
                            var layer = feature.layer;
                            if (layer.popupEnabled && layer.popupTemplate) {
                                // Set cursor for layers with popup template defined 
                                _this.setCursor("pointer");
                                // is the currently showing feature the same?
                                if (_this.view.popup.selectedFeature !== feature) {
                                    _this.view.popup.open({
                                        features: [feature],
                                        updateLocationEnabled: true
                                    });
                                }
                            }
                        }
                    }
                    else {
                        _this.setCursor("default");
                    }
                });
            }
            catch (e) { }
        };
        ;
        MapExample.prototype.setCursor = function (cursorName) {
            var viewContainer = this.view.container;
            var currentCursor = viewContainer.style.cursor;
            if (currentCursor !== cursorName) {
                viewContainer.style.cursor = cursorName;
            }
        };
        return MapExample;
    }());
    return MapExample;
});
//# sourceMappingURL=Main.js.map