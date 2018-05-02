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

import requireUtils = require("esri/core/requireUtils");
import watchUtils = require("esri/core/watchUtils");

import WebMap = require("esri/WebMap");
import WebScene = require("esri/WebScene");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Graphic = require("esri/Graphic");

import { createView } from "ApplicationBase/support/itemUtils";
//--------------------------------------------------------------------------
//
//  Public Methods
//
//--------------------------------------------------------------------------
export async function syncSetup(view: SceneView, insetView: MapView) {
  // watch for extent and camera changes to update 2d map
  insetView.when(() => {
    _updateOverview(view, insetView);
    view.watch("extent", () => _updateOverview(view, insetView));
    view.watch("camera", () => _updateOverview(view, insetView));
    insetView.on("click", async e => {
      const result = await view.map.ground.queryElevation(e.mapPoint);
      view.goTo(result.geometry);
      _updateGraphic(view, insetView);
    });
  });
}
export function createInsetView(view: SceneView) {
  const sceneView = view as __esri.SceneView;
  const insetDiv = document.createElement("div");
  // const viewContainerNode = document.getElementById("viewContainer");
  insetDiv.classList.add("inset-map");
  //viewContainerNode.appendChild(insetDiv);

  return createView({
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

export async function addInsetWidgets(insetView: MapView, sceneView: SceneView, config: any) {
  // TODO clean this up 
  const expandButton = document.createElement("button");
  expandButton.classList.add("esri-widget-button", "esri-icon-zoom-out-fixed");
  const viewContainerNode = document.getElementById("viewContainer");
  expandButton.addEventListener("click", () => {
    expandButton.classList.toggle("esri-icon-zoom-in-fixed");
    expandButton.classList.toggle("esri-icon-zoom-out-fixed");
    if (expandButton.classList.contains("esri-icon-zoom-out-fixed")) {
      // Full view move back to inset
      sceneView.ui.add(insetView.container, config.insetPosition);
    } else {
      // inset view move out to full 
      sceneView.ui.remove(insetView.container);
      viewContainerNode.appendChild(insetView.container);
    }
  });
  sceneView.ui.add(insetView.container, config.insetPosition);
  insetView.ui.add(expandButton, config.fullscreenPosition);
}

async function _updateOverview(view, insetView) {
  if (view && insetView) {
    await insetView.goTo({
      target: view.camera.position,
      scale:
        view.scale *
        4 *
        Math.max(view.width / insetView.width, view.height / insetView.height)
    });
    _updateGraphic(view, insetView);
  }
}
function _updateGraphic(view: SceneView, insetView: MapView) {
  insetView.graphics.removeAll();
  insetView.graphics.add(
    new Graphic({
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
    })
  );
}
