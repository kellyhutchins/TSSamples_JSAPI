import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import ImageryLayer = require("esri/layers/ImageryLayer");
import RasterFunction = require("esri/layers/support/RasterFunction");
import DimensionalDefinition = require("esri/layers/support/DimensionalDefinition");
import MosaicRule = require("esri/layers/support/MosaicRule");
import watchUtils = require("esri/core/watchUtils");

import esri = __esri;

const map = new Map({
    basemap: "dark-gray" as string as any
});
const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-32, 38] as number[] as any,
    zoom: 3,
    popup: {
        actions: []
    }
});

// Multidimensional information of image service can be viewed at thisService/multiDimensionalInfo
// DEPTH: show only temperatures at sea surface
// TIME: only show temperatures for the week of April 7, 2014
let dimInfo: DimensionalDefinition[] = [new DimensionalDefinition({
    variableName: "water_depth",
    dimensionName: "StdZ", // Water depth
    values: [0], // Sea surface or 0 ft
    isSlice: true
}), new DimensionalDefinition({
    variableName: "water_temp",
    dimensionName: "StdTime", // time temp was recorded 
    values: [1396828800000], // week of April 7, 2014
    isSlice: true
})];

const mosaicRule = new MosaicRule({
    multidimensionalDefinition: dimInfo
});

/* Set the rendering rule to the "None" raster function. This will allow us 
to gain access to the temperature value assigned to each pixel */
const rasterFunction = new RasterFunction({
    functionName: "None"
});

function colorize(pixelData: esri.ImageryLayerViewPixelData) {
    if (!pixelData || !pixelData.pixelBlock) {
        return;
    }
    const pixelBlock = pixelData.pixelBlock;
    const minValue = pixelBlock.statistics[0].minValue;
    const maxValue = pixelBlock.statistics[0].maxValue;

    //pixels visible in the view 
    const pixels = pixelBlock.pixels;

    //number of pixels in the pixelBlock  
    const numPixels = pixelBlock.width * pixelBlock.height;

    // Calculate the factor by which to dermine the r and b values
    // in the colorized version of the layer 
    const factor = 255.0 / (maxValue - minValue);

    // Get the pixels containing the temp values in the 
    // only bad of data
    const tempBand = pixels[0];

    let rBand = [], gBand = [], bBand = [];
    for (let i: number = 0; i < numPixels; i++) {
        const tempValue = tempBand[i];
        const red = (tempValue - minValue) * factor;
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

const layer = new ImageryLayer({
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

view.whenLayerView(layer).then((layerView) => {
    watchUtils.whenFalseOnce(layerView, "updating", (newVal) => {
        view.popup.open({
            title: "Sea Surface Temperature",
            content: "Click anywhere in the oceans to view the sea temperature at that location.",
            location: view.center
        });
    });
});