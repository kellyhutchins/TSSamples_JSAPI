import WebScene = require("esri/WebScene");
import SceneView = require("esri/views/SceneView");
import SceneLayer = require("esri/layers/SceneLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleRenderer = require("esri/renderers/SimpleRenderer");
import MeshSymbol3D = require("esri/symbols/MeshSymbol3D");
import FillSymbol3DLayer = require("esri/symbols/FillSymbol3DLayer");
import Legend = require("esri/widgets/Legend");
import esriConfig = require("esri/config");
import Color = require("esri/Color");

const map = new WebScene({
    portalItem: {
        id: "03a9607d96244883af64c7f8c7e5de1b"
    }
});
const view = new SceneView({
    map: map,
    container: "viewDiv"
});

const layer = new SceneLayer({
    url: "http://services2.arcgis.com/cFEFS0EWrhfDeVw9/ArcGIS/rest/services/STM____F_Helsinki__Textured_buildings_with_attributes/SceneServer/layers/0",
    title: "Buildings in Helsinki"
});


function getUniqueValueRenderer(color: Color, colorMixMode: string) {
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

function setRenderer(type: string) {
    if (type === "original") {
        layer.renderer = null;
    } else if (type === "select") {
        layer.renderer = getUniqueValueRenderer(null, null);
    } else if (type === "emphasize") {
        layer.renderer = getUniqueValueRenderer(new Color("#F5D5A9"), "tint");
    } else {
        const colorMixMode = (type === "desaturate") ? "tint" : "replace";
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
document.getElementById("colorMixMode").addEventListener("change", (evt) => {
    const target = <HTMLInputElement>evt.target;
    setRenderer(target.id);
});
view.ui.add("colorMixMode", "bottom-left");