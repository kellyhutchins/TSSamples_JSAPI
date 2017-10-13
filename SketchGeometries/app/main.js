define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/Color", "esri/widgets/Sketch/SketchViewModel"], function (require, exports, WebMap, MapView, Color, SketchViewModel) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebMap({
        portalItem: {
            id: "c7381cb155a043a2bba2b84566677262"
        }
    });
    var resetBtn = document.getElementById("resetBtn");
    var drawPointButton = document.getElementById("pointButton");
    var drawLineButton = document.getElementById("polylineButton");
    var drawPolygonButton = document.getElementById("polygonButton");
    var view = new MapView({
        map: map,
        container: "viewDiv",
        zoom: 5
    });
    view.then(function () {
        var sketch = new SketchViewModel({
            view: view,
            pointSymbol: {
                type: "simple-marker",
                style: "square",
                color: new Color("#ff0000"),
                size: "16px",
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
        sketch.on("draw-complete", function (evt) {
            view.graphics.add(evt.graphic);
            setActiveButton();
        });
        drawPointButton.onclick = function () {
            console.log("Sketch", sketch);
            sketch.create("point");
            setActiveButton(this);
        };
        drawPolygonButton.onclick = function () {
            sketch.create("polygon");
            setActiveButton(this);
        };
        drawLineButton.onclick = function () {
            sketch.create("polyline");
            setActiveButton(this);
        };
        resetBtn.onclick = function () {
            view.graphics.removeAll();
            sketch.reset();
            setActiveButton();
        };
        function setActiveButton(selectedButton) {
            view.focus();
            var elements = document.getElementsByClassName("active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (selectedButton) {
                selectedButton.classList.add("active");
            }
        }
    });
});
//# sourceMappingURL=main.js.map