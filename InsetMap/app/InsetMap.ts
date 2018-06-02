
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
    type: "picture-marker",
    url: "assets/viewpoint.png",
    width: 60,
    height: 40,
    angle: 0
}
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

@subclass()
class InsetMap extends declared(Accessor) {

    @property() locationLayer: FeatureLayer;
    @property() insetView: MapView;
    @property() mainView: SceneView;
    @property() basemap: string | __esri.Basemap;
    @property() mapId: string;
    @property() config: ApplicationConfig;

    constructor(params) {
        super(params);
        this.mainView = params.mainView;
        this.config = params.config;
        this.basemap = this.config.insetBasemap || this.mainView.map.basemap;
        if (this.config.locationColor) {
            //  defaultDirectionSymbol.color = this.config.locationColor;
        }
        this.mapId = this.config.webmap as string || null;
    }

    async createInsetView() {

        const insetDiv = document.getElementById("mapInset");
        const mapProps: __esri.WebMapProperties = {};
        if (this.mapId) {
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
        expandButton.classList.add("esri-widget-button", expandOpen);
        expandButton.title = "Expand";
        expandButton.setAttribute("aria-label", "Expand");

        this.insetView.ui.add(expandButton, this.config.controlPosition);
        this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
        this.insetView.when(() => {
            this._syncViews();
            this._updatePosition();
            this.insetView.goTo({ target: this.mainView.center })
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
                this.insetView.zoom = this.mainView.zoom;
                this.insetView.center = this.mainView.camera.position;
            } else {
                // Full move to inset  
                if (splitter) {
                    splitter.destroy();
                }
                this.mainView.ui.add(this.insetView.container, this.config.insetPosition);
                this.insetView.goTo({
                    target: this.mainView.camera.position,
                    scale:
                        this.mainView.scale *
                        scale *
                        Math.max(this.mainView.width / this.insetView.width, this.mainView.height / this.insetView.height)
                }, { animate: true });
            }
            expandButton.classList.toggle(expandOpen);
            expandButton.classList.toggle(expandClose);

        });
        // Start with inset map expanded
        if (this.config.insetExpand) {
            expandButton.click();
        }
    }

    private _syncViews() {
        this.mainView.watch("extent", () => this._updatePosition());
        this.mainView.watch("camera", () => this._updatePosition());

        this.insetView.on("immediate-click", async e => {
            const result = await this.mainView.map.ground.queryElevation(e.mapPoint);
            this.mainView.goTo({
                target: result.geometry
            });
            this._updatePosition();
        });
    }
    private _updatePosition() {
        this.insetView.graphics.removeAll();
        const position = this.mainView.camera.position;
        defaultDirectionSymbol.angle = this.mainView.camera.heading;
        this.insetView.graphics.add(new Graphic({
            geometry: position,
            symbol: defaultDirectionSymbol
        }));

        // Pan to graphic if it moves out of inset view 
        geometryEngineAsync.contains(this.insetView.extent, position).then((contains) => {
            if (!contains) {
                this.insetView.goTo(position);
            }
        });

    }
}

export default InsetMap;