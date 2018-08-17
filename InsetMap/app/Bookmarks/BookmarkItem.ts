/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
import { declared, property, subclass } from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");

import Slide = require("esri/webscene/Slide");

@subclass("app.BookmarkItem")
class BookmarkItem extends declared(Accessor) {

    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------
    //----------------------------------
    //  active
    //----------------------------------
    @property()
    active = false;

    @property()
    slide: Slide = null;
    //----------------------------------
    //  name
    //----------------------------------
    @property()
    name: string = null;

}

export = BookmarkItem;