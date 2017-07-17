
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");
import UniqueValueRenderer = require("esri/renderers/UniqueValueRenderer");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import Legend = require("esri/widgets/Legend");
import Color = require("esri/Color");

import esri = __esri;

// Arcade expressions (not sure if loading them using the `` is good practice but using for now)
const strengthArcade = `
  var fieldValues = [ $feature.NOT_LABORFORCE_16, $feature.CIVLBFR_CY ];
  var winner = Max(fieldValues);
  var total = Sum(fieldValues);
  return (winner/total) * 100;`

const predominanceArcade = `
 var fields = [
    { value: $feature.NOT_LABORFORCE_16, alias: "NOT participating in the labor force" },
    { value: $feature.CIVLBFR_CY, alias: "participating in the labor force" }
  ];  function getPredominantCategory(fieldsArray){
    var maxValue = -Infinity;
    var maxCategory = "";
    for(var k in fieldsArray){
      if(fieldsArray[k].value > maxValue){
        maxValue = fieldsArray[k].value;
        maxCategory = fieldsArray[k].alias;
      } else if (fieldsArray[k].value == maxValue){
        maxCategory = maxCategory + "/" + fieldsArray[k].alias;
      }
    }
    return maxCategory;
  }
  getPredominantCategory(fields);`

const arcadeExpressionInfos: esri.PopupTemplateExpressionInfos[] = [
    {
        name: "predominance-arcade",
        title: "Is the majority of (>50%) of the population 16+ participating in the labor force?",
        expression: predominanceArcade
    }, {
        name: "strength-arcade",
        title: "% of population belonging to majority category",
        expression: strengthArcade
    }, {
        name: "not-working-arcade",
        title: "Total population 16+ not employed or in labor force",
        expression: "$feature.POP_16UP - $feature.EMP_CY"
    }, {
        name: "%-not-working-arcade",
        title: "% of population 16+ not employed or in labor force",
        expression: "Round((($feature.POP_16UP - $feature.EMP_CY)/$feature.POP_16UP)*100) + '%'"
    }
];

const renderer = new UniqueValueRenderer({
    valueExpression: arcadeExpressionInfos[0].expression,
    valueExpressionTitle: arcadeExpressionInfos[0].title,
    defaultSymbol: createSymbol("lightgray"),
    defaultLabel: "Other/or tie",
    uniqueValueInfos: [{
        value: "participating in the labor force",
        symbol: createSymbol("#6b4da2")
    }, {
        value: "NOT participating in the labor force",
        symbol: createSymbol("#e86b0c")
    }],
    // Add an Arcade expression to an opacity visual variable. Counties where
    // the predominant category is nearly equal with the others (54%) are very
    // transparent. Counties where the predominant category makes up at least 66%
    // of all people 16 and older are fully opaque.
    visualVariables: [{
        type: "opacity",
        valueExpression: arcadeExpressionInfos[1].expression,
        valueExpressionTitle: arcadeExpressionInfos[1].title,
        stops: [
            { value: 54, opacity: 0.05, label: "< 54%" },
            { value: 66, opacity: 1.0, label: "> 66%" }
        ]
    }, {
        type: "size",
        field: "UNEMPRT_CY",
        minDataValue: 5,
        maxDataValue: 28.8,
        minSize: 6,
        maxSize: 50
    }]
});
const layer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_counties_employment_2016/FeatureServer/0",
    outFields: ["CIVLBFR_CY", "NOT_LABORFORCE_16", "COUNTY", "STATE", "POP_16UP", "UNEMPRT_CY", "UNEMP_CY", "EMP_CY"],
    renderer: renderer,
    popupTemplate: {
        title: "{COUNTY}, {STATE}",
        content: [{
            type: "text",
            text: `In this county, {UNEMPRT_CY}% of the labor force is unemployed.
             {expression/strength-arcade}% of the {POP_16UP} people ages 16+
              living here are {expression/predominance-arcade}.
             `
        }, {
            type: "fields",
            fieldInfos: [{
                fieldName: "CIVLBFR_CY",
                label: "Population in labor force (16+)",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }, {
                fieldName: "EMP_CY",
                label: "Employed population",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }, {
                fieldName: "UNEMP_CY",
                label: "Unemployed population",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }, {
                fieldName: "expression/not-working-arcade",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }, {
                fieldName: "expression/%-not-working-arcade",
                format: {
                    digitSeparator: true,
                    places: 0
                }
            }]
        }],
        fieldInfos: [{
            fieldName: "POP_16UP",
            format: {
                digitSeparator: true,
                places: 0
            },
        }, {
            fieldName: "expression/strength-arcade",
            format: {
                digitSeparator: true,
                places: 0
            }
        }],
        expressionInfos: arcadeExpressionInfos
    }
});
const map = new Map({
    basemap: "gray" as any,
    layers: [layer]
});
const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-83.57, 35.05] as any,
    zoom: 6,
    popup: {
        dockEnabled: true,
        dockOptions: {
            position: "bottom-left",
            breakpoint: false
        }
    }
});

const legend = new Legend({
    view: view,
    layerInfos: [{
        layer: layer,
        title: "Labor force statistics by U.S. county 2016"
    }]
});
view.ui.add(legend, "top-right");
function createSymbol(color: string) {
    return new SimpleMarkerSymbol({
        color: new Color(color),
        outline: {
            width: 0.5,
            color: new Color([255, 255, 255, 0.5])
        }
    })
}