define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/renderers/UniqueValueRenderer", "esri/symbols/SimpleMarkerSymbol", "esri/widgets/Legend", "esri/Color"], function (require, exports, Map, MapView, FeatureLayer, UniqueValueRenderer, SimpleMarkerSymbol, Legend, Color) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Arcade expressions (not sure if loading them using the `` is good practice but using for now)
    var strengthArcade = "\n  var fieldValues = [ $feature.NOT_LABORFORCE_16, $feature.CIVLBFR_CY ];\n  var winner = Max(fieldValues);\n  var total = Sum(fieldValues);\n  return (winner/total) * 100;";
    var predominanceArcade = "\n var fields = [\n    { value: $feature.NOT_LABORFORCE_16, alias: \"NOT participating in the labor force\" },\n    { value: $feature.CIVLBFR_CY, alias: \"participating in the labor force\" }\n  ];  function getPredominantCategory(fieldsArray){\n    var maxValue = -Infinity;\n    var maxCategory = \"\";\n    for(var k in fieldsArray){\n      if(fieldsArray[k].value > maxValue){\n        maxValue = fieldsArray[k].value;\n        maxCategory = fieldsArray[k].alias;\n      } else if (fieldsArray[k].value == maxValue){\n        maxCategory = maxCategory + \"/\" + fieldsArray[k].alias;\n      }\n    }\n    return maxCategory;\n  }\n  getPredominantCategory(fields);";
    var arcadeExpressionInfos = [
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
    var renderer = new UniqueValueRenderer({
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
    var layer = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/US_counties_employment_2016/FeatureServer/0",
        outFields: ["CIVLBFR_CY", "NOT_LABORFORCE_16", "COUNTY", "STATE", "POP_16UP", "UNEMPRT_CY", "UNEMP_CY", "EMP_CY"],
        renderer: renderer,
        popupTemplate: {
            title: "{COUNTY}, {STATE}",
            content: [{
                    type: "text",
                    text: "In this county, {UNEMPRT_CY}% of the labor force is unemployed.\n             {expression/strength-arcade}% of the {POP_16UP} people ages 16+\n              living here are {expression/predominance-arcade}.\n             "
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
    var map = new Map({
        basemap: "gray",
        layers: [layer]
    });
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-83.57, 35.05],
        zoom: 6,
        popup: {
            dockEnabled: true,
            dockOptions: {
                position: "bottom-left",
                breakpoint: false
            }
        }
    });
    var legend = new Legend({
        view: view,
        layerInfos: [{
                layer: layer,
                title: "Labor force statistics by U.S. county 2016"
            }]
    });
    view.ui.add(legend, "top-right");
    function createSymbol(color) {
        return new SimpleMarkerSymbol({
            color: new Color(color),
            outline: {
                width: 0.5,
                color: new Color([255, 255, 255, 0.5])
            }
        });
    }
});
//# sourceMappingURL=main.js.map