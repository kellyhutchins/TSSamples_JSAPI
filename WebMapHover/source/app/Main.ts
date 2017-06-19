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

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};

import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker
} from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

import {
  ApplicationConfig,
  ApplicationBaseSettings
} from "ApplicationBase/interfaces";

import Graphic = require("esri/Graphic");
import FeatureLayer = require("esri/layers/FeatureLayer");
import GraphicsLayer = require("esri/layers/GraphicsLayer");
import Collection = require("esri/core/Collection");
import MapView = require("esri/views/MapView");
import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import BasemapToggle = require("esri/widgets/BasemapToggle");

// These should be conditionaly loaded TODO 
import Legend = require("esri/widgets/Legend");
import Expand = require("esri/widgets/Expand");
import Home = require("esri/widgets/Home");

class MapExample {

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;
  view: MapView;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      console.error("ApplicationBase is not defined");
      return;
    }

    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;

    const { config, results, settings } = base;
    const { find, marker } = config;
    const { webMapItems } = results;

    const validWebMapItems = webMapItems.map(response => {
      return response.value;
    });

    const firstItem = validWebMapItems[0];

    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !this.base.config.title ? getItemTitle(firstItem) : "";
    setPageTitle(this.base.config.title);
    document.getElementById("appTitle").innerHTML = this.base.config.title;


    const portalItem: any = this.base.results.applicationItem.value;

    const appProxies = (portalItem && portalItem.appProxies) ? portalItem.appProxies : null;

    const viewContainerNode = document.getElementById("viewContainer");
    // Get url properties like center, extent, zoom
    const defaultViewProperties = getConfigViewProperties(config);


    validWebMapItems.forEach(item => {
      const viewNode = document.createElement("div");
      viewContainerNode.appendChild(viewNode);

      const viewProperties = {
        container: viewNode,
        ...defaultViewProperties
      };

      const { basemapUrl, basemapReferenceUrl } = config;
      createMapFromItem({ item, appProxies })
        .then(map => createView({
          ...viewProperties,
          map
        })
          .then(view => {
            this.view = view as MapView;
            this.view.popup.dockEnabled = true;
            this.view.popup.dockOptions = {
              position: "auto",
              buttonEnabled: false,
              breakpoint: false
            }
            this.addWidgets(item);
          })
          .then(() => findQuery(find, this.view)
            .then(() => goToMarker(marker, this.view).then(() => {
              this.view.then(() => {
                let lastHitTest = null;
                this.view.on("pointer-move", (evt) => {
                  clearTimeout(lastHitTest);
                  //add a tiny delay before testing
                  lastHitTest = setTimeout(() => {
                    this.handlePointerMove(evt);
                  }, 50);
                });
              });

            }))));
    });
    document.body.classList.remove(CSS.loading);
  }
  // Methods 
  addWidgets(item) {

    if (this.base.config.home) {
      const home = new Home({
        view: this.view
      });
      this.view.ui.add(home, "top-left");

    }
    if (this.base.config.legend) {
      const legend = new Legend({
        view: this.view,
        container: document.createElement("div")
      });

      const legendExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        view: this.view,
        content: legend.container,
        expandTooltip: "Legend" // TODO i18n
      });
      this.view.ui.add(legendExpand, "top-left")
    }
    if (this.base.config.basemapToggle) {
      const basemapToggle = new BasemapToggle({
        view: this.view,
        nextBasemap: this.base.config.altBasemap
      });
      this.view.ui.add(basemapToggle, "bottom-right");
    }
    if (this.base.config.info && (item.description !== null || item.snippet !== null)) {


      const infoExpand = new Expand({
        expandIconClass: "esri-icon-description",
        expandTooltip: "Details about the map",
        content: "<div class='info'>" + item.description || item.snippet + "<div>"
      });
      this.view.ui.add(infoExpand, "bottom-left");
    }

  }
  handlePointerMove(evt) {
    try {
      this.view.hitTest(evt).then(results => {
        if (results.results.length > 0) {
          const feature: Graphic = results.results[0].graphic;
          const isFeatureLayer = feature.layer.declaredClass === "esri.layers.FeatureLayer";
          if (isFeatureLayer) {
            const layer = feature.layer as FeatureLayer;
            if (layer.popupEnabled && layer.popupTemplate) {
              // Set cursor for layers with popup template defined 
              this.setCursor("pointer");
              // is the currently showing feature the same?
              if (this.view.popup.selectedFeature !== feature) {
                this.view.popup.open({
                  features: [feature],
                  updateLocationEnabled: true
                });
              }
            }
          }
        } else {
          this.setCursor("default");
        }
      });
    } catch (e) { }
  };

  setCursor(cursorName: string) {
    const viewContainer: HTMLDivElement = this.view.container as HTMLDivElement;
    const currentCursor = viewContainer.style.cursor;
    if (currentCursor !== cursorName) {
      viewContainer.style.cursor = cursorName;
    }
  }
}

export = MapExample;
