/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/watchUtils", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/Handles", "esri/widgets/support/widget", "./Bookmarks/BookmarksViewModel", "dojo/i18n!./nls/resources"], function (require, exports, __extends, __decorate, watchUtils, decorators_1, Widget, HandleRegistry, widget_1, BookmarksViewModel, i18n) {
    "use strict";
    var CSS = {
        base: "app-bookmarks",
        loading: "app-bookmarks__loading",
        loadingIcon: "esri-icon-loading-indicator esri-rotating",
        fadeIn: "app-bookmarks--fade-in",
        iconClass: "esri-icon-labels",
        bookmarkList: "app-bookmarks__list",
        bookmarkItem: "app-bookmarks__item",
        bookmarkItemIcon: "app-bookmarks__item-icon",
        bookmarkItemName: "app-bookmarks__item-name",
        bookmarkItemActive: "app-bookmarks__item--active"
    };
    var Bookmarks = /** @class */ (function (_super) {
        __extends(Bookmarks, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Bookmarks(params) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._handles = new HandleRegistry();
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  iconClass
            //----------------------------------
            _this.iconClass = CSS.iconClass;
            //----------------------------------
            //  label
            //----------------------------------
            _this.label = i18n.tools.bookmarks.label;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new BookmarksViewModel();
            return _this;
        }
        Bookmarks.prototype.postInitialize = function () {
            var _this = this;
            this.own(watchUtils.on(this, "viewModel.bookmarkItems", "change", function () { return _this._bookmarkItemsChanged(); }));
            this._bookmarkItemsChanged();
        };
        Bookmarks.prototype.destroy = function () {
            this._handles.destroy();
            this._handles = null;
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Bookmarks.prototype.render = function () {
            var loadingNode = (widget_1.tsx("div", { class: CSS.loading },
                widget_1.tsx("span", { class: CSS.loadingIcon })));
            var bookmarkNodes = this._renderBookmarks();
            var state = this.viewModel.state;
            var bookmarkListNode = state === "ready" && bookmarkNodes.length ? [
                widget_1.tsx("ul", { "aria-label": i18n.tools.bookmarks.label, class: CSS.bookmarkList }, bookmarkNodes)
            ] :
                state === "loading" ?
                    loadingNode :
                    null;
            return (widget_1.tsx("div", { class: CSS.base }, bookmarkListNode));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Bookmarks.prototype._renderBookmarks = function () {
            var _this = this;
            var bookmarkItems = this.viewModel.bookmarkItems;
            return bookmarkItems.toArray().map(function (bookmarkItem) { return _this._renderBookmark(bookmarkItem); });
        };
        Bookmarks.prototype._renderBookmark = function (bookmarkItem) {
            var _a;
            var active = bookmarkItem.active, name = bookmarkItem.name;
            var bookmarkItemClasses = (_a = {},
                _a[CSS.bookmarkItemActive] = active,
                _a);
            var title = i18n.tools.bookmarks.goToBookmark + " " + name;
            return (widget_1.tsx("li", { bind: this, "data-bookmark-item": bookmarkItem, class: this.classes(CSS.bookmarkItem, bookmarkItemClasses), onclick: this._goToBookmark, onkeydown: this._goToBookmark, tabIndex: 0, role: "button", title: title, "aria-label": name },
                widget_1.tsx("img", { class: this.classes(CSS.iconClass, CSS.bookmarkItemIcon), src: bookmarkItem.slide.thumbnail.url, alt: name }),
                widget_1.tsx("span", { class: CSS.bookmarkItemName }, name)));
        };
        Bookmarks.prototype._bookmarkItemsChanged = function () {
            var _this = this;
            var itemsKey = "items";
            var bookmarkItems = this.viewModel.bookmarkItems;
            var _handles = this._handles;
            _handles.remove(itemsKey);
            var handles = bookmarkItems.map(function (bookmarkItem) {
                return watchUtils.watch(bookmarkItem, [
                    "active",
                    "name"
                ], function () { return _this.scheduleRender(); });
            });
            _handles.add(handles, itemsKey);
            this.scheduleRender();
        };
        Bookmarks.prototype._goToBookmark = function (event) {
            var node = event.currentTarget;
            var bookmarkItem = node["data-bookmark-item"];
            this.viewModel.goTo(bookmarkItem);
        };
        __decorate([
            decorators_1.property()
        ], Bookmarks.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], Bookmarks.prototype, "label", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.view")
        ], Bookmarks.prototype, "view", void 0);
        __decorate([
            decorators_1.property({
                type: BookmarksViewModel
            }),
            widget_1.renderable([
                "state"
            ])
        ], Bookmarks.prototype, "viewModel", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Bookmarks.prototype, "_goToBookmark", null);
        Bookmarks = __decorate([
            decorators_1.subclass("app.Bookmarks")
        ], Bookmarks);
        return Bookmarks;
    }(decorators_1.declared(Widget)));
    return Bookmarks;
});
//# sourceMappingURL=CustomBookmarks.js.map