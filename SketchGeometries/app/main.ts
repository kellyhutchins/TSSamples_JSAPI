import WebMap = require("esri/WebMap");
import MapView = require("esri/views/MapView");
import Color = require("esri/Color");
import SketchViewModel = require("esri/widgets/Sketch/SketchViewModel");

const map = new WebMap({
    portalItem: {
        id: "c7381cb155a043a2bba2b84566677262"
    }
});

const resetBtn = document.getElementById("resetBtn");
const drawPointButton = document.getElementById("pointButton");
const drawLineButton = document.getElementById("polylineButton");
const drawPolygonButton = document.getElementById("polygonButton");

const view = new MapView({
    map: map,
    container: "viewDiv",
    zoom: 5
});

view.then(() => {
    const sketch = new SketchViewModel({
        view: view,
        pointSymbol: {
            type: "simple-marker",
            style: "square",
            color: new Color("#ff0000"),
            size: "16px" as any,
            outline: {
                color: new Color([255, 255, 0]),
                width: 3
            }
        },
        polylineSymbol: {
            type: "simple-line",
            color: new Color("#8A2BE2"),
            style: "dash",
            width: 4
        },
        polygonSymbol: {
            type: "simple-fill",
            color: new Color([138, 43, 226, 0.8]),
            style: "solid",
            outline: {
                color: new Color("#fff"),
                width: 1
            }
        }
    });

    /* Listen to the draw-complete event to create a new Graphic 
    and add it to the view to show the completed geometry. This event fires when 
    the user double-clicks or c is pressed to compmlete the geometry*/
    sketch.on("draw-complete", (evt) => {
        view.graphics.add(evt.graphic);
        setActiveButton();
    });

    drawPointButton.onclick = function () {
        console.log("Sketch", sketch);
        sketch.create("point");
        setActiveButton(this as HTMLButtonElement);
    }
    drawPolygonButton.onclick = function () {
        sketch.create("polygon");
        setActiveButton(this as HTMLButtonElement)
    }
    drawLineButton.onclick = function () {
        sketch.create("polyline");
        setActiveButton(this as HTMLButtonElement);
    }
    resetBtn.onclick = function () {
        view.graphics.removeAll();
        sketch.reset();
        setActiveButton();
    }
    function setActiveButton(selectedButton?: HTMLButtonElement) {
        view.focus();
        const elements = document.getElementsByClassName("active");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
        }

    }
});