define(["require", "exports", "esri/WebScene", "esri/views/SceneView", "esri/layers/SceneLayer", "esri/renderers/UniqueValueRenderer", "esri/renderers/SimpleRenderer", "esri/symbols/MeshSymbol3D", "esri/symbols/FillSymbol3DLayer", "esri/Color"], function (require, exports, WebScene, SceneView, SceneLayer, UniqueValueRenderer, SimpleRenderer, MeshSymbol3D, FillSymbol3DLayer, Color) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new WebScene({
        portalItem: {
            id: "03a9607d96244883af64c7f8c7e5de1b"
        }
    });
    var view = new SceneView({
        map: map,
        container: "viewDiv"
    });
    var layer = new SceneLayer({
        url: "http://services2.arcgis.com/cFEFS0EWrhfDeVw9/ArcGIS/rest/services/STM____F_Helsinki__Textured_buildings_with_attributes/SceneServer/layers/0",
        title: "Buildings in Helsinki"
    });
    function getUniqueValueRenderer(color, colorMixMode) {
        return new UniqueValueRenderer({
            field: "usage",
            defaultSymbol: new MeshSymbol3D({
                symbolLayers: [
                    new FillSymbol3DLayer({
                        material: {
                            color: new Color([230, 230, 230, 0.7]),
                            colorMixMode: "replace"
                        }
                    })
                ]
            }),
            uniqueValueInfos: [{
                    value: "general or commercial",
                    label: "commercial buildings",
                    symbol: new MeshSymbol3D({
                        symbolLayers: [
                            new FillSymbol3DLayer({
                                material: {
                                    color: color,
                                    colorMixMode: colorMixMode
                                }
                            })
                        ]
                    })
                }]
        });
    }
    function setRenderer(type) {
        if (type === "original") {
            layer.renderer = null;
        }
        else if (type === "select") {
            layer.renderer = getUniqueValueRenderer(null, null);
        }
        else if (type === "emphasize") {
            layer.renderer = getUniqueValueRenderer(new Color("#F5D5A9"), "tint");
        }
        else {
            var colorMixMode = (type === "desaturate") ? "tint" : "replace";
            layer.renderer = new SimpleRenderer({
                symbol: new MeshSymbol3D({
                    symbolLayers: [new FillSymbol3DLayer({
                            material: {
                                color: "white",
                                colorMixMode: colorMixMode
                            }
                        })]
                })
            });
        }
    }
    map.add(layer);
    document.getElementById("colorMixMode").addEventListener("change", function (evt) {
        var target = evt.target;
        setRenderer(target.id);
    });
    view.ui.add("colorMixMode", "bottom-left");
});
//# sourceMappingURL=main.js.map