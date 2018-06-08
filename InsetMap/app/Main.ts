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

import InsetMap from "./InsetMap";
import requireUtils = require("esri/core/requireUtils");
import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  getItemTitle,
  findQuery,
  goToMarker,
  createWebMapFromItem
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

import Expand = require("esri/widgets/Expand");

declare var calcite: any;
class SceneExample {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;

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
    const { webSceneItems } = results;

    const validWebSceneItems = webSceneItems.map(response => {
      return response.value;
    });

    const firstItem = validWebSceneItems[0];
    if (!firstItem) {
      console.error("Could not load an item to display");
      return;
    }

    config.title = !config.title ? getItemTitle(firstItem) : config.title;
    setPageTitle(config.title);


    if (config.titleLink) {
      config.title = `<a href="${config.titleLink}" >${config.title}</a>`;
    }

    document.getElementById("title").innerHTML = config.title;
    const portalItem: any = this.base.results.applicationItem.value;
    const appProxies =
      portalItem && portalItem.appProxies ? portalItem.appProxies : null;

    // Setup splash screen if enabled 
    if (this.base.config.splash) {
      calcite.init();
      const splashButton = document.getElementById("splashButton");
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

    const viewContainerNode = document.getElementById("viewContainer");
    if (this.base.config.splitDirection === "vertical") {
      // vertical is maps stacked vertically. Horizontal is side by side
      viewContainerNode.classList.add("direction-vertical");
    }
    const defaultViewProperties = getConfigViewProperties(config);
    const item = firstItem;

    const container = {
      container: document.getElementById("mapMain")//viewNode
    };

    const viewProperties = {
      ...defaultViewProperties,
      ...container
    };

    const { basemapUrl, basemapReferenceUrl } = config;
    createMapFromItem({ item, appProxies }).then(map =>
      createView({
        ...viewProperties,
        map
      }).then(view => {
        view.when(async () => {
          const insetMap = new InsetMap({ mainView: view, config: this.base.config });
          insetMap.createInsetView();
          // Get inset view when ready 
          insetMap.watch("insetView", () => {
            const insetView = insetMap.insetView;
          })
        });
        findQuery(find, view).then(() => goToMarker(marker, view));
        this._addMeasureWidgets(view, this.base.config);
      })
    );

    document.body.classList.remove(CSS.loading);
  }

  async _addMeasureWidgets(view, config) {
    if (config.measurement) {
      const measureRequire = await requireUtils.when(require, [
        "esri/widgets/DirectLineMeasurement3D", "esri/widgets/AreaMeasurement3D"
      ]);
      if (measureRequire && measureRequire.length && measureRequire.length > 1) {
        const DirectLineMeasurement3D = measureRequire[0];
        const AreaMeasurement3D = measureRequire[1];

        const nav = document.createElement("nav");
        nav.classList.add("leader-1")

        let measureTool = null;
        let type;
        nav.appendChild(this._createMeasureButton("area"));
        nav.appendChild(this._createMeasureButton("line"));
        nav.addEventListener("click", (e) => {
          const button = e.target as HTMLButtonElement

          if (measureTool) {
            measureTool.destroy();
            view.ui.remove(measureTool);
          }
          // don't recreate if its the same button 
          if (type && type === button.dataset.type) {
            type = null;
          } else {
            type = button.dataset.type;
            if (type === "area") {
              measureTool = new AreaMeasurement3D({
                view
              });
            } else {
              measureTool = new DirectLineMeasurement3D({
                view
              });
            }
            view.ui.add(measureTool, config.measurementPosition);
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



    }
  }
  _createMeasureButton(type) {
    const button = document.createElement("button");
    const icon = type === "area" ? "esri-icon-polygon" : "esri-icon-polyline";
    const label = type === "area" ? i18n.tools.measureArea : i18n.tools.measureLine;
    button.dataset.type = type;
    button.classList.add("esri-widget-button", "btn", "btn-grouped", icon);
    button.title = label;

    button.setAttribute("aria-label", label);
    return button;
  }
}

export = SceneExample;
