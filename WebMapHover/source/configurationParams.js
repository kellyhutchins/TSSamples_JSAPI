{
    "configurationSettings": [{
        "category": "General",
        "fields": [{
            "type": "webmap"
        }, {
            "type": "appproxies"
        }, {
            "placeHolder": "Defaults to web map title",
            "label": "Title:",
            "fieldName": "title",
            "type": "string",
            "tooltip": "Defaults to web map title"
        },{
            "type": "boolean",
            "fieldName": "legend",
            "label": "Legend"
        },{
            "type": "boolean",
            "fieldName": "home",
            "label": "Home"
        }, {
            "type": "boolean",
            "fieldName": "info",
            "label": "Info"
        },{
            "type": "conditional",
            "condition": false,
            "fieldName": "basemapToggle",
            "label": "Basemap Toggle",
            "items": [{
                "type": "basemaps",
                "fieldName": "altBasemap",
                "tooltip": "Select the alternate basemap",
                "label": "Alternate Basemap"
            }]
        }] 
    }],
    "values": {
        "legend": true,
        "basemapToggle":true,
        "home": false,
        "info": true

    }
}
