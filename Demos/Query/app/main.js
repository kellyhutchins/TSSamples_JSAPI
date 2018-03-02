var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "esri/WebMap", "esri/views/MapView", "esri/core/watchUtils"], function (require, exports, WebMap, MapView, watchUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    createView(new WebMap({
        portalItem: {
            id: "ba69233e666a4e249be6d2c72e4136c7"
        }
    }));
    function createView(map) {
        return __awaiter(this, void 0, void 0, function () {
            var view, layer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = new MapView({
                            map: map,
                            container: "viewDiv"
                        });
                        return [4 /*yield*/, view.when()];
                    case 1:
                        _a.sent();
                        layer = view.map.layers.getItemAt(0);
                        view.whenLayerView(layer).then(function (layerView) {
                            watchUtils.once(layerView, "updating", function () {
                                queryFeatures(layerView, view);
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    function queryFeatures(layerView, view) {
        return __awaiter(this, void 0, void 0, function () {
            var results, select;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, layerView.queryFeatures()];
                    case 1:
                        results = _a.sent();
                        select = document.createElement("select");
                        select.innerHTML = results.map(function (result) {
                            return "<option value=" + result.attributes.OBJECTID_1 + ">\n            " + result.attributes.ZIP + " (" + result.attributes.PO_NAME + ")\n            </option>";
                        }).sort().join(" ");
                        view.ui.add(select, "top-right");
                        select.addEventListener("change", function () {
                            var feature = results[select.value];
                            if (feature) {
                                view.goTo(feature);
                                view.popup.open({
                                    features: [feature],
                                    location: feature.geometry.centroid
                                });
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
});
//# sourceMappingURL=main.js.map