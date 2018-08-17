
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
import i18n = require("dojo/i18n!./nls/resources");
import Accessor = require("esri/core/Accessor");
import WebMap = require("esri/WebMap");

import Graphic = require("esri/Graphic");

import geometryEngineAsync = require("esri/geometry/geometryEngineAsync");

import { createView } from "ApplicationBase/support/itemUtils";
import {
    ApplicationConfig
} from "ApplicationBase/interfaces";
import Split from "./splitMaps";

import {
    declared,
    property,
    subclass
} from "esri/core/accessorSupport/decorators";

import GraphicsLayer = require("esri/layers/GraphicsLayer");
import requireUtils = require("esri/core/requireUtils");
import watchUtils = require("esri/core/watchUtils");
import esri = __esri;

export interface InsetParams {
    config: ApplicationConfig;
    mainView: esri.SceneView;
}

const expandOpen = "esri-icon-zoom-out-fixed";
const expandClose = "esri-icon-zoom-in-fixed";
const scale = 4;
const width = 250;
const height = 250;

const defaultDirectionSymbol = {
    type: "text",
    color: "#333",
    text: "\ue688",
    angle: 0,
    font: {
        size: 18,
        family: "CalciteWebCoreIcons"
    }
};

@subclass()
class InsetMap extends declared(Accessor) {

    @property() locationLayer: esri.FeatureLayer;
    @property() insetView: esri.MapView;
    @property() mainView: esri.SceneView;
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
        if (this.mapId && this.config.useWebMap) {
            mapProps.portalItem = { id: this.mapId };
        } else {
            mapProps.basemap = this.basemap;
        }

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
        this.insetView = await inset.then() as esri.MapView;

        this.graphicsLayer = new GraphicsLayer();
        this.insetView.map.add(this.graphicsLayer);
        watchUtils.once(this.insetView, "updating", () => {
            const index = this.insetView.layerViews.length > 0 ? this.insetView.layerViews.length : 0;
            this.insetView.map.reorder(this.graphicsLayer, index);
        });
        insetDiv.classList.remove("hide");
        this._setupSync();
    }
    private _setupSync() {
        const expandButton = document.createElement("button");
        expandButton.classList.add("esri-widget--button", expandOpen);
        expandButton.title = i18n.tools.expand;
        expandButton.setAttribute("aria-label", i18n.tools.expand);

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
                expandButton.title = i18n.tools.collapse;
            } else {
                // Full move to inset  
                if (splitter) {
                    splitter.destroy();
                }
                this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
                // expand inset a bit 
                this.insetView.extent.expand(0.5);
                expandButton.title = i18n.tools.expand;
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
                this.mover.on("graphic-pointer-over", (e) => {
                    this.insetView.set("cursor", "move");
                });
                this.mover.on("graphic-pointer-out", (e) => {
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
        geometryEngineAsync.contains(this.insetView.extent, result.geometry).then((contains) => {
            if (!contains) {
                this._panInsetView(result.geometry, false);
            }
        });
    }
    // TODO the issue is that if you want to show the graphic moving you can't
    // show the map moving....Setup simple sample
    // Can make this work with svg added via html but ...
    _panInsetView(geometry, animate = false) {
        this.insetView.goTo(geometry, { animate: animate });
    }
    private _updatePosition(geometry?) {
        this.graphicsLayer.removeAll();
        const position = geometry || this.mainView.camera.position;

        defaultDirectionSymbol.angle = this._getHeadingAdjustment(this.mainView.camera.heading);

        const g = new Graphic({
            geometry: position,
            symbol: defaultDirectionSymbol
        });
        this.graphicsLayer.add(g);

        // Testing code to add svg via html 
        const svgContainer = document.getElementById("svgContainer");
        svgContainer.innerHTML = null;
        const screenPt = this.insetView.toScreen(position);
        const icon = `<svg style="top:${screenPt.x.toString()}px; left:${screenPt.y.toString()}px; fill:green; transform:rotate(${defaultDirectionSymbol.angle.toPrecision(2)}deg);" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"
        class="svg-content direction">
        <path d="M13.334 18.667L16 32 32 0 0 16z" /></svg>`;
        svgContainer.innerHTML = icon;

        // Pan to graphic if it moves out of inset view 
        // watchUtils.whenFalseOnce(this.mainView, "interacting", () => {
        this._panInsetView(position, false);
        //});
    }
    private _getHeadingAdjustment(heading: number) {
        if ("orientation" in window) {
            const { orientation } = window;
            if (typeof orientation !== "number") {
                return heading;
            }
            const offset = heading + orientation;
            const adjustment = offset > 360 ? offset - 360 : offset < 0 ? offset + 360 : offset;
            return adjustment;
        }
        return heading;
    }
}

export default InsetMap;