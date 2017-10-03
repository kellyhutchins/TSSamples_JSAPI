define(["require", "exports", "esri/WebScene", "esri/WebMap", "esri/Color", "esri/Graphic", "esri/layers/ElevationLayer", "esri/PopupTemplate", "esri/Ground", "esri/views/SceneView", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/renderers/SimpleRenderer", "esri/geometry/geometryEngineAsync", "esri/core/watchUtils", "esri/widgets/Expand", "esri/core/urlUtils"], function (require, exports, WebScene, WebMap, Color, Graphic, ElevationLayer, PopupTemplate, Ground, SceneView, Point, SimpleMarkerSymbol, SimpleLineSymbol, SimpleRenderer, geometryEngineAsync, watchUtils, Expand, urlUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // set web scene id via ?webscene url param 
    let websceneId = "79b3544f74e44a69bb280164e4744ce3";
    let webmapId = null;
    const urlParams = urlUtils.urlToObject(document.location.toString());
    if (urlParams.query && urlParams.query.webscene) {
        websceneId = urlParams.query.webscene;
    }
    else if (urlParams.query && urlParams.query.webmap) {
        webmapId = urlParams.query.webmap;
    }
    let map;
    if (!webmapId) {
        map = new WebScene({
            portalItem: {
                id: websceneId
            }
        });
    }
    else {
        map = new WebMap({
            portalItem: {
                id: webmapId
            }
        });
    }
    // add the ground layer 
    const elevationLayer = new ElevationLayer({
        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    map.ground = new Ground({
        layers: [elevationLayer]
    });
    const highlightColor = "#63D33A";
    const view = new SceneView({
        map: map,
        container: "viewDiv",
        highlightOptions: {
            color: new Color(highlightColor),
            haloOpacity: 0.9,
            fillOpacity: 0.2
        },
        padding: {
            top: 70,
            right: 0,
            left: 0,
            bottom: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                buttonEnabled: false,
                breakpoint: false,
                position: "top-right"
            }
        }
    });
    view.popup.on("trigger-action", (evt) => {
        if (evt.action.id === "zoom-to") {
            const geom = view.popup.selectedFeature.geometry;
            view.goTo({
                target: geom
            });
        }
    });
    // Create elevation toggle button and slides and add to view 
    view.then(() => {
        document.title = map.portalItem.title;
        document.getElementById("appTitle").innerHTML = map.portalItem.title;
        if (map.ground && map.ground.layers && map.ground.layers.length && map.ground.layers.length > 0) {
            createElevationButton();
        }
        if (map.presentation.slides && map.presentation.slides.length && map.presentation.slides.length > 0) {
            createInfoContainer(map.presentation.slides);
        }
    });
    view.on("layerview-create", event => {
        if (event.layer && event.layer.declaredClass === "esri.layers.FeatureLayer") {
            const layer = event.layer;
            if (layer.geometryType === "polyline") {
                updateLayerSymbology(layer);
                updatePopup(layer);
            }
        }
    });
    function updateLayerSymbology(layer) {
        // Modify polyline feature symbology 
        const routeRenderer = new SimpleRenderer({
            symbol: new SimpleLineSymbol({
                width: 1.5,
                color: new Color([64, 255, 0])
            })
        });
        layer.renderer = routeRenderer;
    }
    function updatePopup(layer) {
        // Set popup content to function if its a polyline feature layer 
        let origContent;
        if (layer.popupTemplate) {
            origContent = layer.popupTemplate.clone();
        }
        else {
            origContent = new PopupTemplate();
        }
        layer.popupTemplate.content = (target) => {
            const geometry = target.graphic.geometry;
            const map = view.map;
            const t = origContent.clone();
            let content = t.content;
            const template = `<h4>Elevation Profile</h4><div class='chart-details'> <span class='esri-icon-up' aria-label='Elevation Gain'> <span id='chartAscent'></span> </span> <span class='esri-icon-down' aria-label='Elevation Loss'> <span id='chartDescent'></span> </span> <span id='chartDistance' class='chart-distance'></span></div><canvas id='popupCanvas' width='400' height='200'></canvas>`;
            content.push({
                type: "text",
                text: template
            });
            geometryEngineAsync.generalize(geometry, 50).then(queryElevation);
            return content;
        };
    }
    function queryElevation(geometry) {
        map.ground.queryElevation(geometry).then((response) => {
            geometryEngineAsync.geodesicLength(response.geometry, "miles").then(length => {
                document.getElementById("chartDistance").innerHTML = Math.round(length) + " miles";
            });
            let ascent = 0, descent = 0, vals = [], labels = [];
            const geom = response.geometry;
            geom.paths.forEach((path) => {
                for (var i = 1; i < path.length; i++) {
                    vals.push(Math.round((path[i][2] / 0.3048)));
                    labels.push(path[i][0] + "," + path[i][1]);
                    var d = path[i][2] - path[i - 1][2];
                    if (d > 0) {
                        ascent += d;
                    }
                    else {
                        descent -= d;
                    }
                }
            });
            document.getElementById("chartAscent").innerHTML = Math.round(((ascent * 100) / 100) / 0.3048) + "ft";
            document.getElementById("chartDescent").innerHTML = Math.round(((descent * 100) / 100) / 0.3048) + "ft";
            createChart(vals, labels);
        });
    }
    function createElevationButton() {
        const elevButton = document.createElement("button");
        elevButton.type = "button";
        elevButton.className = "esri-widget-button esri-icon-globe esri-widget";
        elevButton.title = "Toggle Basemap Elevation";
        elevButton.addEventListener("click", () => {
            view.map.ground.layers.forEach(layer => {
                layer.visible = !layer.visible;
            });
        });
        view.ui.add([elevButton], "top-left");
    }
    function createInfoContainer(slides) {
        //create slides and add to expand container 
        const slideContainer = document.createElement("div");
        slideContainer.className = "slide-container";
        slides.forEach(slide => {
            const slideDiv = document.createElement("div");
            slideDiv.id = slide.id;
            slideDiv.className = "slide";
            slideDiv.innerHTML = `<div class="slide-title">${slide.title.text}</div><img src="${slide.thumbnail.url}" title="${slide.title.text}">`;
            slideDiv.addEventListener("click", () => {
                const active = document.querySelector(".active");
                if (active && active.classList) {
                    active.classList.remove("active");
                }
                if (view.popup.visible) {
                    view.popup.close();
                }
                slideDiv.className = "active";
                slide.applyTo(view);
            });
            slideContainer.appendChild(slideDiv);
        });
        const expand = new Expand({
            view: view,
            expanded: true,
            content: slideContainer,
            expandIconClass: "esri-icon-basemap",
            expandTooltip: "Navigate to bookmarks"
        });
        view.ui.add([expand], "top-left");
    }
    function displayPointOnMap(mapPoint) {
        // add point to map when user hovers over profile chart 
        view.graphics.removeAll();
        const marker = new SimpleMarkerSymbol({
            outline: {
                width: 2,
                color: new Color("#ff0000")
            },
            size: 20,
            color: new Color([217, 254, 204, 0.5])
        });
        view.graphics.add(new Graphic({
            geometry: mapPoint,
            symbol: marker
        }));
        watchUtils.whenFalseOnce(view.popup, "visible", () => {
            view.graphics.removeAll();
        });
    }
    function createChart(vals, labels) {
        // Create line chart using ChartJs
        const canvas = document.getElementById("popupCanvas");
        const context = canvas.getContext("2d");
        Chart.defaults.global.tooltips.backgroundColor = "#88ACE0";
        Chart.defaults.global.legend = false;
        var chart = new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        lineTension: 0,
                        cubicInterpolationMode: "linear",
                        data: vals,
                        pointRadius: 0,
                        pointHitRadius: 5,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "#fff",
                        fill: "origin",
                        backgroundColor: "rgba(66,113,232440,0.1)",
                        borderColor: highlightColor,
                        borderCapStyle: "round",
                        borderJoinStyle: "round"
                    },
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        title: function () {
                            return null;
                        },
                        label: function (tooltipItem, data) {
                            // just show elevation and mileage along line 
                            const endCoords = tooltipItem.xLabel.split(",");
                            const endPoint = new Point({
                                x: Number(endCoords[0]),
                                y: Number(endCoords[1]),
                                spatialReference: view.spatialReference
                            });
                            displayPointOnMap(endPoint);
                            return tooltipItem.yLabel + " feet";
                        }
                    }
                },
                scales: {
                    xAxes: [{
                            gridLines: { display: false },
                            display: false
                        }],
                    yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "#2f4f4f",
                                fontSize: 10,
                                callback: function (value, index, values) {
                                    // only display first and last elev value 
                                    if (values && values.length && values.length > 0) {
                                        if ((index === 0) || (index === values.length - 1)) {
                                            return value;
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                    else {
                                        return null;
                                    }
                                }
                            }
                        }]
                }
            }
        });
        chart.update();
    }
});
//# sourceMappingURL=main.js.map