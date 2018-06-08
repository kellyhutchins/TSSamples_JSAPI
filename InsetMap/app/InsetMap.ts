
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import Accessor = require("esri/core/Accessor");
import FeatureLayer = require("esri/layers/FeatureLayer");
import WebMap = require("esri/WebMap");
import WebScene = require("esri/WebScene");


import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import Graphic = require("esri/Graphic");

import geometryEngineAsync = require("esri/geometry/geometryEngineAsync");

import { createView } from "ApplicationBase/support/itemUtils";
import {
    ApplicationConfig
} from "ApplicationBase/interfaces";
import Split from "./splitMaps";

import {
    aliasOf,
    declared,
    property,
    subclass
} from "esri/core/accessorSupport/decorators";

import GraphicsLayer = require("esri/layers/GraphicsLayer");
import requireUtils = require("esri/core/requireUtils");
import { getDefault } from "dojox/gfx";
import watchUtils = require("esri/core/watchUtils");
import esri = __esri;
export interface InsetParams {
    config: ApplicationConfig;
    mainView: SceneView;
}

const expandOpen = "esri-icon-zoom-out-fixed";
const expandClose = "esri-icon-zoom-in-fixed";
const scale = 4;
const width = 250;
const height = 250;

const defaultDirectionSymbol = {
    type: "text",
    color: "#333",
    text: "\ue666",
    angle: 0,
    font: {
        size: 18,
        family: "CalciteWebCoreIcons"
    }
};

@subclass()
class InsetMap extends declared(Accessor) {

    @property() locationLayer: FeatureLayer;
    @property() insetView: MapView;
    @property() mainView: SceneView;
    @property() basemap: string | esri.Basemap;
    @property() mapId: string;
    @property() config: ApplicationConfig;
    @property() graphicsLayer: GraphicsLayer;
    @property() mover: any;
    @property() extentWatchHandle: esri.PausableWatchHandle;
    @property() cameraWatchHandle: esri.PausableWatchHandle;

    constructor(params) {
        super(params);
        this.mainView = params.mainView;
        this.config = params.config;
        this.basemap = this.config.insetBasemap || this.mainView.map.basemap;
        if (this.config.locationColor) {
            defaultDirectionSymbol.color = this.config.locationColor;
        }
        this.mapId = this.config.webmap as string || null;
    }

    async createInsetView() {

        const insetDiv = document.getElementById("mapInset");
        const mapProps: esri.WebMapProperties = {};
        if (this.mapId) {
            mapProps.portalItem = { id: this.mapId };
        } else {
            mapProps.basemap = this.basemap;
        }
        this.graphicsLayer = new GraphicsLayer();
        mapProps.layers = [this.graphicsLayer];
        const inset = createView({
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

        this.insetView = await inset.then() as MapView;

        insetDiv.classList.remove("hide");
        this._setupSync();
    }
    private _setupSync() {
        // TODO a11y for button (title)
        const expandButton = document.createElement("button");
        expandButton.classList.add("esri-widget--button", expandOpen);
        expandButton.title = "Expand";
        expandButton.setAttribute("aria-label", "Expand");

        this.insetView.ui.add(expandButton, this.config.controlPosition);
        this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
        this.insetView.when(() => {
            this._updatePosition();

            this._syncViews();
        });
        const viewContainerNode = document.getElementById("viewContainer");
        let splitter = null;
        const splitterOptions: any = {
            minSize: 0,
            gutterSize: 20
        };
        if (this.config.splitDirection === "vertical") {
            // stack maps on top of each other 
            splitterOptions.direction = "vertical";
        } else {
            splitterOptions.sizes = [50, 50];
        }
        expandButton.addEventListener("click", () => {
            if (expandButton.classList.contains(expandOpen)) {
                // Inset so move to full 
                this.mainView.ui.remove(this.insetView.container);
                viewContainerNode.appendChild(this.insetView.container);
                splitter = Split(["#mapMain", "#mapInset"], splitterOptions);

            } else {
                // Full move to inset  
                if (splitter) {
                    splitter.destroy();
                }
                this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
                // expand inset a bit 
                this.insetView.extent.expand(0.5);

            }
            this._updatePosition();
            expandButton.classList.toggle(expandOpen);
            expandButton.classList.toggle(expandClose);

        });
        // Start with inset map expanded
        if (this.config.insetExpand) {
            expandButton.click();
        }
    }

    private _syncViews() {
        this.extentWatchHandle = watchUtils.pausable(this.mainView, "extent", () => this._updatePosition());
        this.cameraWatchHandle = watchUtils.pausable(this.mainView, "camera", () => this._updatePosition());

        this.insetView.on("immediate-click", async e => {
            const result = await this.mainView.map.ground.queryElevation(e.mapPoint);
            await this.mainView.goTo({
                target: result.geometry
            }, { animate: true });
        });
        requireUtils.when(require, [
            "esri/views/2d/draw/support/GraphicMover"
        ]).then((GraphicMover) => {

            // Setup ability to click and drag graphic
            if (GraphicMover[0]) {

                this.mover = new GraphicMover[0]({
                    view: this.insetView,
                    graphics: this.graphicsLayer.graphics
                });

                this.mover.on("graphic-move-stop", async (e) => {
                    this._pauseAndUpdate(this.insetView.toMap(e.screenPoint), false);
                });
                this.mover.on("graphic-mouse-over", (e) => {
                    this.insetView.set("cursor", "move");
                });
                this.mover.on("graphic-mouse-out", (e) => {
                    this.insetView.set("cursor", "pointer");
                });
            }
        });
    }
    private async _pauseAndUpdate(mapPoint, animate) {
        this.extentWatchHandle.pause();
        this.cameraWatchHandle.pause();
        const result = await this.mainView.map.ground.queryElevation(mapPoint);
        await this.mainView.goTo({
            target: result.geometry
        }, { animate: animate });

        this.extentWatchHandle.resume();
        this.cameraWatchHandle.resume();
        this._panInsetView(result.geometry, false);
    }
    _panInsetView(geometry, animate = true) {
        geometryEngineAsync.contains(this.insetView.extent, geometry).then((contains) => {
            if (!contains) {
                this.insetView.goTo(geometry, { animate: animate });
            }
        });
    }
    private _updatePosition(geometry?, animate = true) {

        this.graphicsLayer.removeAll();
        const position = geometry || this.mainView.camera.position;
        console.log("VIEWPOINT", this.mainView.viewpoint.toJSON());
        defaultDirectionSymbol.angle = this.mainView.camera.heading;
        const g = new Graphic({
            geometry: position,
            symbol: defaultDirectionSymbol
        });
        this.graphicsLayer.add(g);

        // Pan to graphic if it moves out of inset view 
        this._panInsetView(position, animate);
    }
}

export default InsetMap;