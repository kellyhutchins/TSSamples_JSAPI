{
    "configurationSettings": [{
        "category": "General",
        "fields": [{
                "type": "webscene",
                "conditions": ["4x"]
            }, {
                "type": "webmap",
                "conditions": ["4x"]
            }, {
                "type": "appproxies"
            }, {
                "type": "subcategory",
                "label": "Map Navigation Options"
            }, {
                "type": "conditional",
                "fieldName": "mapZoom",
                "condition": false,
                "label": "Map zoom controls",
                "items": [{
                    "type": "options",
                    "fieldName": "mapZoomPosition",
                    "label": "Zoom control location",
                    "tooltip": "Select location for zoom controls",
                    "options": [{
                            "label": "Top right",
                            "value": "top-right"
                        }, {
                            "label": "Top left",
                            "value": "top-left"
                        },
                        {
                            "label": "Bottom right",
                            "value": "bottom-right"
                        },
                        {
                            "label": "Bottom left",
                            "value": "bottom-left"
                        }
                    ]
                }]
            }, {
                "type": "paragraph",
                "value": "If you are embedding this app into another page you might want to prevent map scroll"
            }, {
                "type": "boolean",
                "fieldName": "disableScroll",
                "label": "Prevent map scroll"
            },
            {
                "type": "conditional",
                "fieldName": "details",
                "tooltip": "Add info panel",
                "label": "Info panel",
                "condition": false,
                "items": [{
                    "type": "string",
                    "fieldName": "detailsTitle",
                    "label": "Title",
                    "tooltip": "Detail panel title"
                }, {
                    "type": "string",
                    "fieldName": "detailsContent",
                    "label": "Content",
                    "tooltip": "Details panel content",
                    "stringFieldOption": "richtext"
                }, {
                    "type": "options",
                    "fieldName": "detailsPosition",
                    "label": "Detail panel location",
                    "tooltip": "Select location for panel",
                    "options": [{
                            "label": "Top right",
                            "value": "top-right"
                        }, {
                            "label": "Top left",
                            "value": "top-left"
                        },
                        {
                            "label": "Bottom right",
                            "value": "bottom-right"
                        },
                        {
                            "label": "Bottom left",
                            "value": "bottom-left"
                        }
                    ]
                }, {
                    "type": "conditional",
                    "condition": false,
                    "fieldName": "showPanelTheme",
                    "label": "Optional color theme",
                    "items": [{
                        "type": "paragraph",
                        "value": "By default the panel will have an off white background with dark gray text. If your organization has a shared theme the theme's background and text color will be used. Use the options below if you want to modify the pre-defined values."
                    }, {
                        "type": "color",
                        "label": "Panel background color",
                        "fieldName": "detailsBackgroundColor"
                    }, {
                        "type": "color",
                        "label": "Panel text color",
                        "fieldName": "detailsTextColor"
                    }]
                }]
            }, {
                "type": "conditional",
                "fieldName": "splash",
                "tooltip": "Add splash screen",
                "label": "Splash screen",
                "condition": false,
                "items": [{
                    "type": "string",
                    "fieldName": "splashTitle",
                    "label": "Title",
                    "tooltip": "Splash screen title"
                }, {
                    "type": "string",
                    "fieldName": "splashContent",
                    "label": "Content",
                    "tooltip": "Splash screen content",
                    "stringFieldOption": "richtext"
                }, {
                    "type": "string",
                    "fieldName": "splashButtonText",
                    "label": "Button label",
                    "tooltip": "Define label for the accept button"
                }]
            }, {
                "type": "paragraph",
                "value": "Use the Custom css option to add css that overwrites rules in the app."
            }, {
                "type": "string",
                "fieldName": "customstyle",
                "tooltip": "Custom css",
                "label": "Custom css"
            }
        ]
    }, {
        "category": "Options",
        "fields": [{
            "type": "conditional",
            "fieldName": "home",
            "label": "Home extent",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "homePosition",
                "label": "Home location",
                "tooltip": "Select location for home control",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }]

        }, {
            "type": "conditional",
            "fieldName": "legend",
            "label": "Legend",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "legendPosition",
                "label": "Legend location",
                "tooltip": "Select location for legend",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }, {
                "type": "boolean",
                "fieldName": "legendOpenAtStart",
                "label": "Legend open at start"
            }, {
                "type": "paragraph",
                "value": "Display the legend using the default style or the card style. The card style is a responsive style that displays teh legend with a horizontal layout in large views and a compact card layout in small views."
            }, {
                "type": "options",
                "fieldName": "legendStyle",
                "label": "Legend style",
                "options": [{
                    "label": "Default",
                    "value": "default"
                }, {
                    "label": "Card",
                    "value": "card"
                }]
            }]

        }, {
            "type": "conditional",
            "fieldName": "fullscreen",
            "label": "Fullscreen",
            "condition": false,
            "items": [{
                "type": "paragraph",
                "value": "Note: Fullscreen does not display the app full screen if the app is embedded into another page using an iframe."
            }, {
                "type": "options",
                "fieldName": "fullscreenPosition",
                "label": "Fullscreen location",
                "tooltip": "Select location for fullscreen control",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }]

        }, {
            "type": "conditional",
            "fieldName": "search",
            "label": "Search",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "searchPosition",
                "label": "Search location",
                "tooltip": "Select location for search control",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }, {
                "type": "boolean",
                "fieldName": "searchOpenAtStart",
                "label": "Search open at start"
            }]
        }, {
            "type": "conditional",
            "fieldName": "bookmarks",
            "label": "Bookmarks",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "bookmarksPosition",
                "label": "Bookmark location",
                "tooltip": "Select location for bookmark control",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }]
        }, {
            "type": "conditional",
            "fieldName": "basemapToggle",
            "label": "Basemap Toggle",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "basemapTogglePosition",
                "label": "Bookmark location",
                "tooltip": "Select location for basemap toggle control",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }, {
                "type": "basemaps",
                "fieldName": "basemapToggleAltBasemap",
                "label": "Alternate basemap for toggle"
            }]
        }, {
            "type": "color",
            "fieldName": "highlightColor",
            "label": "Selection color"
        }, {
            "type": "conditional",
            "fieldName": "inset",
            "label": "Inset map",
            "condition": false,
            "items": [{
                "type": "options",
                "fieldName": "insetPosition",
                "label": "Inset map location",
                "tooltip": "Select location for inset map",
                "options": [{
                        "label": "Top right",
                        "value": "top-right"
                    }, {
                        "label": "Top left",
                        "value": "top-left"
                    },
                    {
                        "label": "Bottom right",
                        "value": "bottom-right"
                    },
                    {
                        "label": "Bottom left",
                        "value": "bottom-left"
                    }
                ]
            }, {

                "type": "scaleList",
                "fieldName": "insetScale",
                "label": "Scale for inset map"

            }, {
                "type": "paragraph",
                "value": "By default the inset map will use the same base map as the map map. If you'd like to use a different base map select it from the list below."
            }, {
                "type": "basemaps",
                "fieldName": "insetBasemap",
                "label": "Basemap for inset map"
            }]
        }]
    }],
    "values": {
        "showPanelTheme": false,
        "zoomLevels": false,
        "mapZoom": false,
        "mapZoomPosition": "top-left",
        "home": false,
        "homePosition": "top-left",
        "disableScroll": false,
        "legend": false,
        "legendPosition": "top-left",
        "legendOpenAtStart": false,
        "legendStyle": "default",
        "fullscreen": false,
        "fullscreenPosition": "top-right",
        "inset": false,
        "insetPosition": "bottom-left",
        "search": false,
        "searchPosition": "top-right",
        "searchOpenAtStart": true,
        "bookmarks": false,
        "bookmarksPosition": "top-right",
        "basemapToggle": false,
        "basemapTogglePosition": "bottom-left",
        "basemapToggleAltBasemap": "satellite",
        "details": false,
        "detailsPosition": "bottom-right",
        "splash": false,
        "highlightColor": "#00FFFF",
        "detailsBackgroundColor": "#fff",
        "detailsTextColor": "#333"
    }
}