define(["require", "exports", "esri/Map", "esri/views/MapView", "esri/layers/ImageryLayer", "esri/layers/support/RasterFunction", "esri/layers/support/DimensionalDefinition", "esri/layers/support/MosaicRule", "esri/core/watchUtils"], function (require, exports, Map, MapView, ImageryLayer, RasterFunction, DimensionalDefinition, MosaicRule, watchUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var map = new Map({
        basemap: "dark-gray"
    });
    var view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-32, 38],
        zoom: 3,
        popup: {
            actions: []
        }
    });
    // Multidimensional information of image service can be viewed at thisService/multiDimensionalInfo
    // DEPTH: show only temperatures at sea surface
    // TIME: only show temperatures for the week of April 7, 2014
    var dimInfo = [new DimensionalDefinition({
            variableName: "water_depth",
            dimensionName: "StdZ",
            values: [0],
            isSlice: true
        }), new DimensionalDefinition({
            variableName: "water_temp",
            dimensionName: "StdTime",
            values: [1396828800000],
            isSlice: true
        })];
    var mosaicRule = new MosaicRule({
        multidimensionalDefinition: dimInfo
    });
    /* Set the rendering rule to the "None" raster function. This will allow us
    to gain access to the temperature value assigned to each pixel */
    var rasterFunction = new RasterFunction({
        functionName: "None"
    });
    function colorize(pixelData) {
        if (!pixelData || !pixelData.pixelBlock) {
            return;
        }
        var pixelBlock = pixelData.pixelBlock;
        var minValue = pixelBlock.statistics[0].minValue;
        var maxValue = pixelBlock.statistics[0].maxValue;
        //pixels visible in the view 
        var pixels = pixelBlock.pixels;
        //number of pixels in the pixelBlock  
        var numPixels = pixelBlock.width * pixelBlock.height;
        // Calculate the factor by which to dermine the r and b values
        // in the colorized version of the layer 
        var factor = 255.0 / (maxValue - minValue);
        // Get the pixels containing the temp values in the 
        // only bad of data
        var tempBand = pixels[0];
        var rBand = [], gBand = [], bBand = [];
        for (var i = 0; i < numPixels; i++) {
            var tempValue = tempBand[i];
            var red = (tempValue - minValue) * factor;
            // sets a  color between blue (coldest) and 
            // red (warmest) in each band 
            rBand[i] = red;
            gBand[i] = 0;
            bBand[i] = 255 - red;
        }
        // Set the new pixel values on the pixel block 
        pixelBlock.pixels = [rBand, gBand, bBand];
        pixelBlock.pixelType = "U8"; // U8 is used for color 
    }
    var layer = new ImageryLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ScientificData/SeaTemperature/ImageServer",
        format: "lerc",
        renderingRule: rasterFunction,
        pixelFilter: colorize,
        mosaicRule: mosaicRule,
        popupTemplate: {
            title: "Sea Surface Temperature",
            content: "{Raster.ServicePixelValue}° Celsius"
        }
    });
    map.add(layer);
    view.whenLayerView(layer).then(function (layerView) {
        watchUtils.whenFalseOnce(layerView, "updating", function (newVal) {
            view.popup.open({
                title: "Sea Surface Temperature",
                content: "Click anywhere in the oceans to view the sea temperature at that location.",
                location: view.center
            });
        });
    });
});
//# sourceMappingURL=main.js.map