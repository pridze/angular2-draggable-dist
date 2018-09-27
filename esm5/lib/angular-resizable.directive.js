/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { HelperBlock } from './widgets/helper-block';
import { ResizeHandle } from './widgets/resize-handle';
import { Position } from './models/position';
import { Size } from './models/size';
var AngularResizableDirective = /** @class */ (function () {
    function AngularResizableDirective(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this._resizable = true;
        this._handles = {};
        this._handleType = [];
        this._handleResizing = null;
        this._direction = null;
        this._aspectRatio = 0;
        this._containment = null;
        this._origMousePos = null;
        /**
         * Original Size and Position
         */
        this._origSize = null;
        this._origPos = null;
        /**
         * Current Size and Position
         */
        this._currSize = null;
        this._currPos = null;
        /**
         * Initial Size and Position
         */
        this._initSize = null;
        this._initPos = null;
        /**
         * Snap to gird
         */
        this._gridSize = null;
        this._bounding = null;
        /**
         * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
         * https://github.com/xieziyu/angular2-draggable/issues/84
         */
        this._helperBlock = null;
        /**
         * Which handles can be used for resizing.
         * \@example
         * [rzHandles] = "'n,e,s,w,se,ne,sw,nw'"
         * equals to: [rzHandles] = "'all'"
         *
         *
         */
        this.rzHandles = 'e,s,se';
        /**
         * Whether the element should be constrained to a specific aspect ratio.
         *  Multiple types supported:
         *  boolean: When set to true, the element will maintain its original aspect ratio.
         *  number: Force the element to maintain a specific aspect ratio during resizing.
         */
        this.rzAspectRatio = false;
        /**
         * Constrains resizing to within the bounds of the specified element or region.
         *  Multiple types supported:
         *  Selector: The resizable element will be contained to the bounding box of the first element found by the selector.
         *            If no element is found, no containment will be set.
         *  Element: The resizable element will be contained to the bounding box of this element.
         *  String: Possible values: "parent".
         */
        this.rzContainment = null;
        /**
         * Snaps the resizing element to a grid, every x and y pixels.
         * A number for both width and height or an array values like [ x, y ]
         */
        this.rzGrid = null;
        /**
         * The minimum width the resizable should be allowed to resize to.
         */
        this.rzMinWidth = null;
        /**
         * The minimum height the resizable should be allowed to resize to.
         */
        this.rzMinHeight = null;
        /**
         * The maximum width the resizable should be allowed to resize to.
         */
        this.rzMaxWidth = null;
        /**
         * The maximum height the resizable should be allowed to resize to.
         */
        this.rzMaxHeight = null;
        /**
         * emitted when start resizing
         */
        this.rzStart = new EventEmitter();
        /**
         * emitted when start resizing
         */
        this.rzResizing = new EventEmitter();
        /**
         * emitted when stop resizing
         */
        this.rzStop = new EventEmitter();
        /**
         * Input css scale transform of element so translations are correct
         */
        this.scale = 1;
        this._helperBlock = new HelperBlock(el.nativeElement, renderer);
    }
    Object.defineProperty(AngularResizableDirective.prototype, "ngResizable", {
        /** Disables the resizable if set to false. */
        set: /**
         * Disables the resizable if set to false.
         * @param {?} v
         * @return {?}
         */
        function (v) {
            if (v !== undefined && v !== null && v !== '') {
                this._resizable = !!v;
                this.updateResizable();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    AngularResizableDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['rzHandles'] && !changes['rzHandles'].isFirstChange()) {
            this.updateResizable();
        }
        if (changes['rzAspectRatio'] && !changes['rzAspectRatio'].isFirstChange()) {
            this.updateAspectRatio();
        }
        if (changes['rzContainment'] && !changes['rzContainment'].isFirstChange()) {
            this.updateContainment();
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.updateResizable();
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.removeHandles();
        this._containment = null;
        this._helperBlock.dispose();
        this._helperBlock = null;
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ elm = this.el.nativeElement;
        this._initSize = Size.getCurrent(elm);
        this._initPos = Position.getCurrent(elm);
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.updateAspectRatio();
        this.updateContainment();
    };
    /**
     * A method to reset size
     * @return {?}
     */
    AngularResizableDirective.prototype.resetSize = /**
     * A method to reset size
     * @return {?}
     */
    function () {
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.doResize();
    };
    /**
     * A method to get current status
     * @return {?}
     */
    AngularResizableDirective.prototype.getStatus = /**
     * A method to get current status
     * @return {?}
     */
    function () {
        if (!this._currPos || !this._currSize) {
            return null;
        }
        return {
            size: {
                width: this._currSize.width,
                height: this._currSize.height
            },
            position: {
                top: this._currPos.y,
                left: this._currPos.x
            }
        };
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.updateResizable = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ element = this.el.nativeElement;
        // clear handles:
        this.renderer.removeClass(element, 'ng-resizable');
        this.removeHandles();
        // create new ones:
        if (this._resizable) {
            this.renderer.addClass(element, 'ng-resizable');
            this.createHandles();
        }
    };
    /**
     * Use it to update aspect
     * @return {?}
     */
    AngularResizableDirective.prototype.updateAspectRatio = /**
     * Use it to update aspect
     * @return {?}
     */
    function () {
        if (typeof this.rzAspectRatio === 'boolean') {
            if (this.rzAspectRatio && this._currSize.height) {
                this._aspectRatio = (this._currSize.width / this._currSize.height);
            }
            else {
                this._aspectRatio = 0;
            }
        }
        else {
            var /** @type {?} */ r = Number(this.rzAspectRatio);
            this._aspectRatio = isNaN(r) ? 0 : r;
        }
    };
    /**
     * Use it to update containment
     * @return {?}
     */
    AngularResizableDirective.prototype.updateContainment = /**
     * Use it to update containment
     * @return {?}
     */
    function () {
        if (!this.rzContainment) {
            this._containment = null;
            return;
        }
        if (typeof this.rzContainment === 'string') {
            if (this.rzContainment === 'parent') {
                this._containment = this.el.nativeElement.parentElement;
            }
            else {
                this._containment = document.querySelector(this.rzContainment);
            }
        }
        else {
            this._containment = this.rzContainment;
        }
    };
    /**
     * Use it to create handle divs
     * @return {?}
     */
    AngularResizableDirective.prototype.createHandles = /**
     * Use it to create handle divs
     * @return {?}
     */
    function () {
        if (!this.rzHandles) {
            return;
        }
        var /** @type {?} */ tmpHandleTypes;
        if (typeof this.rzHandles === 'string') {
            if (this.rzHandles === 'all') {
                tmpHandleTypes = ['n', 'e', 's', 'w', 'ne', 'se', 'nw', 'sw'];
            }
            else {
                tmpHandleTypes = this.rzHandles.replace(/ /g, '').toLowerCase().split(',');
            }
            try {
                for (var tmpHandleTypes_1 = tslib_1.__values(tmpHandleTypes), tmpHandleTypes_1_1 = tmpHandleTypes_1.next(); !tmpHandleTypes_1_1.done; tmpHandleTypes_1_1 = tmpHandleTypes_1.next()) {
                    var type = tmpHandleTypes_1_1.value;
                    // default handle theme: ng-resizable-$type.
                    var /** @type {?} */ handle = this.createHandleByType(type, "ng-resizable-" + type);
                    if (handle) {
                        this._handleType.push(type);
                        this._handles[type] = handle;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (tmpHandleTypes_1_1 && !tmpHandleTypes_1_1.done && (_a = tmpHandleTypes_1.return)) _a.call(tmpHandleTypes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            tmpHandleTypes = Object.keys(this.rzHandles);
            try {
                for (var tmpHandleTypes_2 = tslib_1.__values(tmpHandleTypes), tmpHandleTypes_2_1 = tmpHandleTypes_2.next(); !tmpHandleTypes_2_1.done; tmpHandleTypes_2_1 = tmpHandleTypes_2.next()) {
                    var type = tmpHandleTypes_2_1.value;
                    // custom handle theme.
                    var /** @type {?} */ handle = this.createHandleByType(type, this.rzHandles[type]);
                    if (handle) {
                        this._handleType.push(type);
                        this._handles[type] = handle;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (tmpHandleTypes_2_1 && !tmpHandleTypes_2_1.done && (_b = tmpHandleTypes_2.return)) _b.call(tmpHandleTypes_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        var e_1, _a, e_2, _b;
    };
    /**
     * Use it to create a handle
     * @param {?} type
     * @param {?} css
     * @return {?}
     */
    AngularResizableDirective.prototype.createHandleByType = /**
     * Use it to create a handle
     * @param {?} type
     * @param {?} css
     * @return {?}
     */
    function (type, css) {
        var /** @type {?} */ _el = this.el.nativeElement;
        if (!type.match(/^(se|sw|ne|nw|n|e|s|w)$/)) {
            console.error('Invalid handle type:', type);
            return null;
        }
        return new ResizeHandle(_el, this.renderer, type, css, this.onMouseDown.bind(this));
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.removeHandles = /**
     * @return {?}
     */
    function () {
        try {
            for (var _a = tslib_1.__values(this._handleType), _b = _a.next(); !_b.done; _b = _a.next()) {
                var type = _b.value;
                this._handles[type].dispose();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this._handleType = [];
        this._handles = {};
        var e_3, _c;
    };
    /**
     * @param {?} event
     * @param {?} handle
     * @return {?}
     */
    AngularResizableDirective.prototype.onMouseDown = /**
     * @param {?} event
     * @param {?} handle
     * @return {?}
     */
    function (event, handle) {
        // skip right click;
        if (event instanceof MouseEvent && event.button === 2) {
            return;
        }
        // prevent default events
        event.stopPropagation();
        event.preventDefault();
        if (!this._handleResizing) {
            this._origMousePos = Position.fromEvent(event);
            this.startResize(handle);
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.onMouseLeave = /**
     * @return {?}
     */
    function () {
        if (this._handleResizing) {
            this.stopResize();
            this._origMousePos = null;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    AngularResizableDirective.prototype.onMouseMove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
            this.resizeTo(Position.fromEvent(event));
            this.onResizing();
        }
    };
    /**
     * @param {?} handle
     * @return {?}
     */
    AngularResizableDirective.prototype.startResize = /**
     * @param {?} handle
     * @return {?}
     */
    function (handle) {
        var /** @type {?} */ elm = this.el.nativeElement;
        this._origSize = Size.getCurrent(elm);
        this._origPos = Position.getCurrent(elm); // x: left, y: top
        this._currSize = Size.copy(this._origSize);
        this._currPos = Position.copy(this._origPos);
        if (this._containment) {
            this.getBounding();
        }
        this.getGridSize();
        // Add a transparent helper div:
        this._helperBlock.add();
        this._handleResizing = handle;
        this.updateDirection();
        this.rzStart.emit(this.getResizingEvent());
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.stopResize = /**
     * @return {?}
     */
    function () {
        // Remove the helper div:
        this._helperBlock.remove();
        this.rzStop.emit(this.getResizingEvent());
        this._handleResizing = null;
        this._direction = null;
        this._origSize = null;
        this._origPos = null;
        if (this._containment) {
            this.resetBounding();
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.onResizing = /**
     * @return {?}
     */
    function () {
        this.rzResizing.emit(this.getResizingEvent());
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.getResizingEvent = /**
     * @return {?}
     */
    function () {
        return {
            host: this.el.nativeElement,
            handle: this._handleResizing ? this._handleResizing.el : null,
            size: {
                width: this._currSize.width,
                height: this._currSize.height
            },
            position: {
                top: this._currPos.y,
                left: this._currPos.x
            }
        };
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.updateDirection = /**
     * @return {?}
     */
    function () {
        this._direction = {
            n: !!this._handleResizing.type.match(/n/),
            s: !!this._handleResizing.type.match(/s/),
            w: !!this._handleResizing.type.match(/w/),
            e: !!this._handleResizing.type.match(/e/)
        };
    };
    /**
     * @param {?} p
     * @return {?}
     */
    AngularResizableDirective.prototype.resizeTo = /**
     * @param {?} p
     * @return {?}
     */
    function (p) {
        p.subtract(this._origMousePos);
        var /** @type {?} */ tmpX = Math.round(p.x / this._gridSize.x / this.scale) * this._gridSize.x;
        var /** @type {?} */ tmpY = Math.round(p.y / this._gridSize.y / this.scale) * this._gridSize.y;
        if (this._direction.n) {
            // n, ne, nw
            this._currPos.y = this._origPos.y + tmpY;
            this._currSize.height = this._origSize.height - tmpY;
        }
        else if (this._direction.s) {
            // s, se, sw
            this._currSize.height = this._origSize.height + tmpY;
        }
        if (this._direction.e) {
            // e, ne, se
            this._currSize.width = this._origSize.width + tmpX;
        }
        else if (this._direction.w) {
            // w, nw, sw
            this._currSize.width = this._origSize.width - tmpX;
            this._currPos.x = this._origPos.x + tmpX;
        }
        this.checkBounds();
        this.checkSize();
        this.adjustByRatio();
        this.doResize();
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.doResize = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ container = this.el.nativeElement;
        this.renderer.setStyle(container, 'height', this._currSize.height + 'px');
        this.renderer.setStyle(container, 'width', this._currSize.width + 'px');
        this.renderer.setStyle(container, 'left', this._currPos.x + 'px');
        this.renderer.setStyle(container, 'top', this._currPos.y + 'px');
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.adjustByRatio = /**
     * @return {?}
     */
    function () {
        if (this._aspectRatio) {
            if (this._direction.e || this._direction.w) {
                this._currSize.height = this._currSize.width / this._aspectRatio;
            }
            else {
                this._currSize.width = this._aspectRatio * this._currSize.height;
            }
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.checkBounds = /**
     * @return {?}
     */
    function () {
        if (this._containment) {
            var /** @type {?} */ maxWidth = this._bounding.width - this._bounding.pr - this.el.nativeElement.offsetLeft - this._bounding.translateX;
            var /** @type {?} */ maxHeight = this._bounding.height - this._bounding.pb - this.el.nativeElement.offsetTop - this._bounding.translateY;
            if (this._direction.n && (this._currPos.y + this._bounding.translateY) < 0) {
                this._currPos.y = -this._bounding.translateY;
                this._currSize.height = this._origSize.height + this._origPos.y + this._bounding.translateY;
            }
            if (this._direction.w && (this._currPos.x + this._bounding.translateX) < 0) {
                this._currPos.x = -this._bounding.translateX;
                this._currSize.width = this._origSize.width + this._origPos.x + this._bounding.translateX;
            }
            if (this._currSize.width > maxWidth) {
                this._currSize.width = maxWidth;
            }
            if (this._currSize.height > maxHeight) {
                this._currSize.height = maxHeight;
            }
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.checkSize = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ minHeight = !this.rzMinHeight ? 1 : this.rzMinHeight;
        var /** @type {?} */ minWidth = !this.rzMinWidth ? 1 : this.rzMinWidth;
        if (this._currSize.height < minHeight) {
            this._currSize.height = minHeight;
            if (this._direction.n) {
                this._currPos.y = this._origPos.y + (this._origSize.height - minHeight);
            }
        }
        if (this._currSize.width < minWidth) {
            this._currSize.width = minWidth;
            if (this._direction.w) {
                this._currPos.x = this._origPos.x + (this._origSize.width - minWidth);
            }
        }
        if (this.rzMaxHeight && this._currSize.height > this.rzMaxHeight) {
            this._currSize.height = this.rzMaxHeight;
            if (this._direction.n) {
                this._currPos.y = this._origPos.y + (this._origSize.height - this.rzMaxHeight);
            }
        }
        if (this.rzMaxWidth && this._currSize.width > this.rzMaxWidth) {
            this._currSize.width = this.rzMaxWidth;
            if (this._direction.w) {
                this._currPos.x = this._origPos.x + (this._origSize.width - this.rzMaxWidth);
            }
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.getBounding = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ el = this._containment;
        var /** @type {?} */ computed = window.getComputedStyle(el);
        if (computed) {
            var /** @type {?} */ p = computed.getPropertyValue('position');
            var /** @type {?} */ nativeEl = window.getComputedStyle(this.el.nativeElement);
            var /** @type {?} */ transforms = nativeEl.getPropertyValue('transform').replace(/[^-\d,]/g, '').split(',');
            this._bounding = {};
            this._bounding.width = el.clientWidth;
            this._bounding.height = el.clientHeight;
            this._bounding.pr = parseInt(computed.getPropertyValue('padding-right'), 10);
            this._bounding.pb = parseInt(computed.getPropertyValue('padding-bottom'), 10);
            if (transforms.length >= 6) {
                this._bounding.translateX = parseInt(transforms[4], 10);
                this._bounding.translateY = parseInt(transforms[5], 10);
            }
            else {
                this._bounding.translateX = 0;
                this._bounding.translateY = 0;
            }
            this._bounding.position = computed.getPropertyValue('position');
            if (p === 'static') {
                this.renderer.setStyle(el, 'position', 'relative');
            }
        }
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.resetBounding = /**
     * @return {?}
     */
    function () {
        if (this._bounding && this._bounding.position === 'static') {
            this.renderer.setStyle(this._containment, 'position', 'relative');
        }
        this._bounding = null;
    };
    /**
     * @return {?}
     */
    AngularResizableDirective.prototype.getGridSize = /**
     * @return {?}
     */
    function () {
        // set default value:
        this._gridSize = { x: 1, y: 1 };
        if (this.rzGrid) {
            if (typeof this.rzGrid === 'number') {
                this._gridSize = { x: this.rzGrid, y: this.rzGrid };
            }
            else if (Array.isArray(this.rzGrid)) {
                this._gridSize = { x: this.rzGrid[0], y: this.rzGrid[1] };
            }
        }
    };
    AngularResizableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngResizable]',
                    exportAs: 'ngResizable'
                },] },
    ];
    /** @nocollapse */
    AngularResizableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    AngularResizableDirective.propDecorators = {
        ngResizable: [{ type: Input }],
        rzHandles: [{ type: Input }],
        rzAspectRatio: [{ type: Input }],
        rzContainment: [{ type: Input }],
        rzGrid: [{ type: Input }],
        rzMinWidth: [{ type: Input }],
        rzMinHeight: [{ type: Input }],
        rzMaxWidth: [{ type: Input }],
        rzMaxHeight: [{ type: Input }],
        rzStart: [{ type: Output }],
        rzResizing: [{ type: Output }],
        rzStop: [{ type: Output }],
        scale: [{ type: Input }],
        onMouseLeave: [{ type: HostListener, args: ['document:mouseup',] }, { type: HostListener, args: ['document:mouseleave',] }, { type: HostListener, args: ['document:touchend',] }, { type: HostListener, args: ['document:touchcancel',] }],
        onMouseMove: [{ type: HostListener, args: ['document:mousemove', ['$event'],] }, { type: HostListener, args: ['document:touchmove', ['$event'],] }]
    };
    return AngularResizableDirective;
}());
export { AngularResizableDirective };
function AngularResizableDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    AngularResizableDirective.prototype._resizable;
    /** @type {?} */
    AngularResizableDirective.prototype._handles;
    /** @type {?} */
    AngularResizableDirective.prototype._handleType;
    /** @type {?} */
    AngularResizableDirective.prototype._handleResizing;
    /** @type {?} */
    AngularResizableDirective.prototype._direction;
    /** @type {?} */
    AngularResizableDirective.prototype._aspectRatio;
    /** @type {?} */
    AngularResizableDirective.prototype._containment;
    /** @type {?} */
    AngularResizableDirective.prototype._origMousePos;
    /**
     * Original Size and Position
     * @type {?}
     */
    AngularResizableDirective.prototype._origSize;
    /** @type {?} */
    AngularResizableDirective.prototype._origPos;
    /**
     * Current Size and Position
     * @type {?}
     */
    AngularResizableDirective.prototype._currSize;
    /** @type {?} */
    AngularResizableDirective.prototype._currPos;
    /**
     * Initial Size and Position
     * @type {?}
     */
    AngularResizableDirective.prototype._initSize;
    /** @type {?} */
    AngularResizableDirective.prototype._initPos;
    /**
     * Snap to gird
     * @type {?}
     */
    AngularResizableDirective.prototype._gridSize;
    /** @type {?} */
    AngularResizableDirective.prototype._bounding;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     * @type {?}
     */
    AngularResizableDirective.prototype._helperBlock;
    /**
     * Which handles can be used for resizing.
     * \@example
     * [rzHandles] = "'n,e,s,w,se,ne,sw,nw'"
     * equals to: [rzHandles] = "'all'"
     *
     *
     * @type {?}
     */
    AngularResizableDirective.prototype.rzHandles;
    /**
     * Whether the element should be constrained to a specific aspect ratio.
     *  Multiple types supported:
     *  boolean: When set to true, the element will maintain its original aspect ratio.
     *  number: Force the element to maintain a specific aspect ratio during resizing.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzAspectRatio;
    /**
     * Constrains resizing to within the bounds of the specified element or region.
     *  Multiple types supported:
     *  Selector: The resizable element will be contained to the bounding box of the first element found by the selector.
     *            If no element is found, no containment will be set.
     *  Element: The resizable element will be contained to the bounding box of this element.
     *  String: Possible values: "parent".
     * @type {?}
     */
    AngularResizableDirective.prototype.rzContainment;
    /**
     * Snaps the resizing element to a grid, every x and y pixels.
     * A number for both width and height or an array values like [ x, y ]
     * @type {?}
     */
    AngularResizableDirective.prototype.rzGrid;
    /**
     * The minimum width the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMinWidth;
    /**
     * The minimum height the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMinHeight;
    /**
     * The maximum width the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMaxWidth;
    /**
     * The maximum height the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMaxHeight;
    /**
     * emitted when start resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzStart;
    /**
     * emitted when start resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzResizing;
    /**
     * emitted when stop resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzStop;
    /**
     * Input css scale transform of element so translations are correct
     * @type {?}
     */
    AngularResizableDirective.prototype.scale;
    /** @type {?} */
    AngularResizableDirective.prototype.el;
    /** @type {?} */
    AngularResizableDirective.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXNpemFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFDaEMsS0FBSyxFQUFFLE1BQU0sRUFBVSxZQUFZLEVBQ25DLFlBQVksRUFFYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXZELE9BQU8sRUFBRSxRQUFRLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZUFBZSxDQUFDOztJQXlHbkMsbUNBQW9CLEVBQTJCLEVBQVUsUUFBbUI7UUFBeEQsT0FBRSxHQUFGLEVBQUUsQ0FBeUI7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXOzBCQWpHdkQsSUFBSTt3QkFDMkIsRUFBRTsyQkFDdEIsRUFBRTsrQkFDTSxJQUFJOzBCQUNxQyxJQUFJOzRCQUM5RCxDQUFDOzRCQUNZLElBQUk7NkJBQ04sSUFBSTs7Ozt5QkFHWixJQUFJO3dCQUNELElBQUk7Ozs7eUJBR1AsSUFBSTt3QkFDRCxJQUFJOzs7O3lCQUdQLElBQUk7d0JBQ0QsSUFBSTs7Ozt5QkFHRixJQUFJO3lCQUVWLElBQUk7Ozs7OzRCQU1PLElBQUk7Ozs7Ozs7Ozt5QkFpQkQsUUFBUTs7Ozs7Ozs2QkFRSixLQUFLOzs7Ozs7Ozs7NkJBVUQsSUFBSTs7Ozs7c0JBTWQsSUFBSTs7OzswQkFHWCxJQUFJOzs7OzJCQUdILElBQUk7Ozs7MEJBR0wsSUFBSTs7OzsyQkFHSCxJQUFJOzs7O3VCQUdmLElBQUksWUFBWSxFQUFnQjs7OzswQkFHN0IsSUFB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LHFCQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRWhGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUN0RDtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBRTdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUN0RDtRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3BEO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFFN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMxQztRQUVELElBQUksQ0FB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QUMsQ0FBQyxDQUFDO2dCQUMzRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzthQUMzRjtZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQzthQUNqQztZQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzthQUNuQztTQUNGOzs7OztJQUdLLDZDQUFTOzs7O1FBQ2YscUJBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzNELHFCQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUV4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUVsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUks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QixFQUFFLENBQUMsUUFBUSxDQUFDOztvQ0F2VGhEOztTQWtCYSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBIb3N0TGlzdGVuZXIsXG4gIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLFxuICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEhlbHBlckJsb2NrIH0gZnJvbSAnLi93aWRnZXRzL2hlbHBlci1ibG9jayc7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGUgfSBmcm9tICcuL3dpZGdldHMvcmVzaXplLWhhbmRsZSc7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGVUeXBlIH0gZnJvbSAnLi9tb2RlbHMvcmVzaXplLWhhbmRsZS10eXBlJztcbmltcG9ydCB7IFBvc2l0aW9uLCBJUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi9tb2RlbHMvc2l6ZSc7XG5pbXBvcnQgeyBJUmVzaXplRXZlbnQgfSBmcm9tICcuL21vZGVscy9yZXNpemUtZXZlbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdSZXNpemFibGVdJyxcbiAgZXhwb3J0QXM6ICduZ1Jlc2l6YWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIF9yZXNpemFibGUgPSB0cnVlO1xuICBwcml2YXRlIF9oYW5kbGVzOiB7IFtrZXk6IHN0cmluZ106IFJlc2l6ZUhhbmRsZSB9ID0ge307XG4gIHByaXZhdGUgX2hhbmRsZVR5cGU6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgX2hhbmRsZVJlc2l6aW5nOiBSZXNpemVIYW5kbGUgPSBudWxsO1xuICBwcml2YXRlIF9kaXJlY3Rpb246IHsgJ24nOiBib29sZWFuLCAncyc6IGJvb2xlYW4sICd3JzogYm9vbGVhbiwgJ2UnOiBib29sZWFuIH0gPSBudWxsO1xuICBwcml2YXRlIF9hc3BlY3RSYXRpbyA9IDA7XG4gIHByaXZhdGUgX2NvbnRhaW5tZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XG4gIHByaXZhdGUgX29yaWdNb3VzZVBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBPcmlnaW5hbCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9vcmlnU2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX29yaWdQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogQ3VycmVudCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9jdXJyU2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX2N1cnJQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogSW5pdGlhbCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9pbml0U2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX2luaXRQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogU25hcCB0byBnaXJkICovXG4gIHByaXZhdGUgX2dyaWRTaXplOiBJUG9zaXRpb24gPSBudWxsO1xuXG4gIHByaXZhdGUgX2JvdW5kaW5nOiBhbnkgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBCdWdmaXg6IGlGcmFtZXMsIGFuZCBjb250ZXh0IHVucmVsYXRlZCBlbGVtZW50cyBibG9jayBhbGwgZXZlbnRzLCBhbmQgYXJlIHVudXNhYmxlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvODRcbiAgICovXG4gIHByaXZhdGUgX2hlbHBlckJsb2NrOiBIZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgLyoqIERpc2FibGVzIHRoZSByZXNpemFibGUgaWYgc2V0IHRvIGZhbHNlLiAqL1xuICBASW5wdXQoKSBzZXQgbmdSZXNpemFibGUodjogYW55KSB7XG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9PSBudWxsICYmIHYgIT09ICcnKSB7XG4gICAgICB0aGlzLl9yZXNpemFibGUgPSAhIXY7XG4gICAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGljaCBoYW5kbGVzIGNhbiBiZSB1c2VkIGZvciByZXNpemluZy5cbiAgICogQGV4YW1wbGVcbiAgICogW3J6SGFuZGxlc10gPSBcIiduLGUscyx3LHNlLG5lLHN3LG53J1wiXG4gICAqIGVxdWFscyB0bzogW3J6SGFuZGxlc10gPSBcIidhbGwnXCJcbiAgICpcbiAgICogKi9cbiAgQElucHV0KCkgcnpIYW5kbGVzOiBSZXNpemVIYW5kbGVUeXBlID0gJ2UscyxzZSc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIGJlIGNvbnN0cmFpbmVkIHRvIGEgc3BlY2lmaWMgYXNwZWN0IHJhdGlvLlxuICAgKiAgTXVsdGlwbGUgdHlwZXMgc3VwcG9ydGVkOlxuICAgKiAgYm9vbGVhbjogV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGVsZW1lbnQgd2lsbCBtYWludGFpbiBpdHMgb3JpZ2luYWwgYXNwZWN0IHJhdGlvLlxuICAgKiAgbnVtYmVyOiBGb3JjZSB0aGUgZWxlbWVudCB0byBtYWludGFpbiBhIHNwZWNpZmljIGFzcGVjdCByYXRpbyBkdXJpbmcgcmVzaXppbmcuXG4gICAqL1xuICBASW5wdXQoKSByekFzcGVjdFJhdGlvOiBib29sZWFuIHwgbnVtYmVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cmFpbnMgcmVzaXppbmcgdG8gd2l0aGluIHRoZSBib3VuZHMgb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50IG9yIHJlZ2lvbi5cbiAgICogIE11bHRpcGxlIHR5cGVzIHN1cHBvcnRlZDpcbiAgICogIFNlbGVjdG9yOiBUaGUgcmVzaXphYmxlIGVsZW1lbnQgd2lsbCBiZSBjb250YWluZWQgdG8gdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZmlyc3QgZWxlbWVudCBmb3VuZCBieSB0aGUgc2VsZWN0b3IuXG4gICAqICAgICAgICAgICAgSWYgbm8gZWxlbWVudCBpcyBmb3VuZCwgbm8gY29udGFpbm1lbnQgd2lsbCBiZSBzZXQuXG4gICAqICBFbGVtZW50OiBUaGUgcmVzaXphYmxlIGVsZW1lbnQgd2lsbCBiZSBjb250YWluZWQgdG8gdGhlIGJvdW5kaW5nIGJveCBvZiB0aGlzIGVsZW1lbnQuXG4gICAqICBTdHJpbmc6IFBvc3NpYmxlIHZhbHVlczogXCJwYXJlbnRcIi5cbiAgICovXG4gIEBJbnB1dCgpIHJ6Q29udGFpbm1lbnQ6IHN0cmluZyB8IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAvKipcbiAgICogU25hcHMgdGhlIHJlc2l6aW5nIGVsZW1lbnQgdG8gYSBncmlkLCBldmVyeSB4IGFuZCB5IHBpeGVscy5cbiAgICogQSBudW1iZXIgZm9yIGJvdGggd2lkdGggYW5kIGhlaWdodCBvciBhbiBhcnJheSB2YWx1ZXMgbGlrZSBbIHgsIHkgXVxuICAgKi9cbiAgQElucHV0KCkgcnpHcmlkOiBudW1iZXIgfCBudW1iZXJbXSA9IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHdpZHRoIHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1pbldpZHRoOiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBoZWlnaHQgdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWluSGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB3aWR0aCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNYXhXaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gaGVpZ2h0IHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1heEhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdGFydCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpSZXNpemluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RvcCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpTdG9wID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG5ldyBIZWxwZXJCbG9jayhlbC5uYXRpdmVFbGVtZW50LCByZW5kZXJlcik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3J6SGFuZGxlcyddICYmICFjaGFuZ2VzWydyekhhbmRsZXMnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXSAmJiAhY2hhbmdlc1sncnpBc3BlY3RSYXRpbyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVBc3BlY3RSYXRpbygpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekNvbnRhaW5tZW50J10gJiYgIWNoYW5nZXNbJ3J6Q29udGFpbm1lbnQnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29udGFpbm1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG4gICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX2luaXRTaXplID0gU2l6ZS5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5faW5pdFBvcyA9IFBvc2l0aW9uLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9pbml0U2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5faW5pdFBvcyk7XG4gICAgdGhpcy51cGRhdGVBc3BlY3RSYXRpbygpO1xuICAgIHRoaXMudXBkYXRlQ29udGFpbm1lbnQoKTtcbiAgfVxuXG4gIC8qKiBBIG1ldGhvZCB0byByZXNldCBzaXplICovXG4gIHB1YmxpYyByZXNldFNpemUoKSB7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMuZG9SZXNpemUoKTtcbiAgfVxuXG4gIC8qKiBBIG1ldGhvZCB0byBnZXQgY3VycmVudCBzdGF0dXMgKi9cbiAgcHVibGljIGdldFN0YXR1cygpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJQb3MgfHwgIXRoaXMuX2N1cnJTaXplKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2l6ZToge1xuICAgICAgICB3aWR0aDogdGhpcy5fY3VyclNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5fY3VyclNpemUuaGVpZ2h0XG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgdG9wOiB0aGlzLl9jdXJyUG9zLnksXG4gICAgICAgIGxlZnQ6IHRoaXMuX2N1cnJQb3MueFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVJlc2l6YWJsZSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gY2xlYXIgaGFuZGxlczpcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1yZXNpemFibGUnKTtcbiAgICB0aGlzLnJlbW92ZUhhbmRsZXMoKTtcblxuICAgIC8vIGNyZWF0ZSBuZXcgb25lczpcbiAgICBpZiAodGhpcy5fcmVzaXphYmxlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1yZXNpemFibGUnKTtcbiAgICAgIHRoaXMuY3JlYXRlSGFuZGxlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gdXBkYXRlIGFzcGVjdCAqL1xuICBwcml2YXRlIHVwZGF0ZUFzcGVjdFJhdGlvKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekFzcGVjdFJhdGlvID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGlmICh0aGlzLnJ6QXNwZWN0UmF0aW8gJiYgdGhpcy5fY3VyclNpemUuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gKHRoaXMuX2N1cnJTaXplLndpZHRoIC8gdGhpcy5fY3VyclNpemUuaGVpZ2h0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHIgPSBOdW1iZXIodGhpcy5yekFzcGVjdFJhdGlvKTtcbiAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gaXNOYU4ocikgPyAwIDogcjtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBjb250YWlubWVudCAqL1xuICBwcml2YXRlIHVwZGF0ZUNvbnRhaW5tZW50KCkge1xuICAgIGlmICghdGhpcy5yekNvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLl9jb250YWlubWVudCA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6Q29udGFpbm1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekNvbnRhaW5tZW50ID09PSAncGFyZW50Jykge1xuICAgICAgICB0aGlzLl9jb250YWlubWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pih0aGlzLnJ6Q29udGFpbm1lbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb250YWlubWVudCA9IHRoaXMucnpDb250YWlubWVudDtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBoYW5kbGUgZGl2cyAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZXMoKSB7XG4gICAgaWYgKCF0aGlzLnJ6SGFuZGxlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0bXBIYW5kbGVUeXBlczogc3RyaW5nW107XG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6SGFuZGxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICh0aGlzLnJ6SGFuZGxlcyA9PT0gJ2FsbCcpIHtcbiAgICAgICAgdG1wSGFuZGxlVHlwZXMgPSBbJ24nLCAnZScsICdzJywgJ3cnLCAnbmUnLCAnc2UnLCAnbncnLCAnc3cnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gdGhpcy5yekhhbmRsZXMucmVwbGFjZSgvIC9nLCAnJykudG9Mb3dlckNhc2UoKS5zcGxpdCgnLCcpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCB0eXBlIG9mIHRtcEhhbmRsZVR5cGVzKSB7XG4gICAgICAgIC8vIGRlZmF1bHQgaGFuZGxlIHRoZW1lOiBuZy1yZXNpemFibGUtJHR5cGUuXG4gICAgICAgIGxldCBoYW5kbGUgPSB0aGlzLmNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlLCBgbmctcmVzaXphYmxlLSR7dHlwZX1gKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcEhhbmRsZVR5cGVzID0gT2JqZWN0LmtleXModGhpcy5yekhhbmRsZXMpO1xuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBjdXN0b20gaGFuZGxlIHRoZW1lLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgdGhpcy5yekhhbmRsZXNbdHlwZV0pO1xuICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlVHlwZS5wdXNoKHR5cGUpO1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0gPSBoYW5kbGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gY3JlYXRlIGEgaGFuZGxlICovXG4gIHByaXZhdGUgY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGU6IHN0cmluZywgY3NzOiBzdHJpbmcpOiBSZXNpemVIYW5kbGUge1xuICAgIGNvbnN0IF9lbCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICghdHlwZS5tYXRjaCgvXihzZXxzd3xuZXxud3xufGV8c3x3KSQvKSkge1xuICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBoYW5kbGUgdHlwZTonLCB0eXBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzaXplSGFuZGxlKF9lbCwgdGhpcy5yZW5kZXJlciwgdHlwZSwgY3NzLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVIYW5kbGVzKCkge1xuICAgIGZvciAobGV0IHR5cGUgb2YgdGhpcy5faGFuZGxlVHlwZSkge1xuICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlVHlwZSA9IFtdO1xuICAgIHRoaXMuX2hhbmRsZXMgPSB7fTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgaGFuZGxlOiBSZXNpemVIYW5kbGUpIHtcbiAgICAvLyBza2lwIHJpZ2h0IGNsaWNrO1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGV2ZW50c1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoIXRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5zdGFydFJlc2l6ZShoYW5kbGUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNldXAnKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZWxlYXZlJylcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2hlbmQnKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaGNhbmNlbCcpXG4gIG9uTW91c2VMZWF2ZSgpIHtcbiAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcpIHtcbiAgICAgIHRoaXMuc3RvcFJlc2l6ZSgpO1xuICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZW1vdmUnLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaG1vdmUnLCBbJyRldmVudCddKVxuICBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcgJiYgdGhpcy5fcmVzaXphYmxlICYmIHRoaXMuX29yaWdNb3VzZVBvcyAmJiB0aGlzLl9vcmlnUG9zICYmIHRoaXMuX29yaWdTaXplKSB7XG4gICAgICB0aGlzLnJlc2l6ZVRvKFBvc2l0aW9uLmZyb21FdmVudChldmVudCkpO1xuICAgICAgdGhpcy5vblJlc2l6aW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFJlc2l6ZShoYW5kbGU6IFJlc2l6ZUhhbmRsZSkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9vcmlnU2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX29yaWdQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7IC8vIHg6IGxlZnQsIHk6IHRvcFxuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX29yaWdTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9vcmlnUG9zKTtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMuZ2V0Qm91bmRpbmcoKTtcbiAgICB9XG4gICAgdGhpcy5nZXRHcmlkU2l6ZSgpO1xuXG4gICAgLy8gQWRkIGEgdHJhbnNwYXJlbnQgaGVscGVyIGRpdjpcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5hZGQoKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemluZyA9IGhhbmRsZTtcbiAgICB0aGlzLnVwZGF0ZURpcmVjdGlvbigpO1xuICAgIHRoaXMucnpTdGFydC5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RvcFJlc2l6ZSgpIHtcbiAgICAvLyBSZW1vdmUgdGhlIGhlbHBlciBkaXY6XG4gICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG4gICAgdGhpcy5yelN0b3AuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXppbmcgPSBudWxsO1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ1NpemUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdQb3MgPSBudWxsO1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgdGhpcy5yZXNldEJvdW5kaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblJlc2l6aW5nKCkge1xuICAgIHRoaXMucnpSZXNpemluZy5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVzaXppbmdFdmVudCgpOiBJUmVzaXplRXZlbnQge1xuICAgIHJldHVybiB7XG4gICAgICBob3N0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBoYW5kbGU6IHRoaXMuX2hhbmRsZVJlc2l6aW5nID8gdGhpcy5faGFuZGxlUmVzaXppbmcuZWwgOiBudWxsLFxuICAgICAgc2l6ZToge1xuICAgICAgICB3aWR0aDogdGhpcy5fY3VyclNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5fY3VyclNpemUuaGVpZ2h0XG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgdG9wOiB0aGlzLl9jdXJyUG9zLnksXG4gICAgICAgIGxlZnQ6IHRoaXMuX2N1cnJQb3MueFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB7XG4gICAgICBuOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL24vKSxcbiAgICAgIHM6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvcy8pLFxuICAgICAgdzogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC93LyksXG4gICAgICBlOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL2UvKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZVRvKHA6IFBvc2l0aW9uKSB7XG4gICAgcC5zdWJ0cmFjdCh0aGlzLl9vcmlnTW91c2VQb3MpO1xuXG4gICAgY29uc3QgdG1wWCA9IE1hdGgucm91bmQocC54IC8gdGhpcy5fZ3JpZFNpemUueCAvIHRoaXMuc2NhbGUpICogdGhpcy5fZ3JpZFNpemUueDtcbiAgICBjb25zdCB0bXBZID0gTWF0aC5yb3VuZChwLnkgLyB0aGlzLl9ncmlkU2l6ZS55IC8gdGhpcy5zY2FsZSkgKiB0aGlzLl9ncmlkU2l6ZS55O1xuXG4gICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAvLyBuLCBuZSwgbndcbiAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArIHRtcFk7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSB0bXBZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uLnMpIHtcbiAgICAgIC8vIHMsIHNlLCBzd1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0ICsgdG1wWTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLmUpIHtcbiAgICAgIC8vIGUsIG5lLCBzZVxuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCArIHRtcFg7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgLy8gdywgbncsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoIC0gdG1wWDtcbiAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArIHRtcFg7XG4gICAgfVxuXG4gICAgdGhpcy5jaGVja0JvdW5kcygpO1xuICAgIHRoaXMuY2hlY2tTaXplKCk7XG4gICAgdGhpcy5hZGp1c3RCeVJhdGlvKCk7XG4gICAgdGhpcy5kb1Jlc2l6ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb1Jlc2l6ZSgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdoZWlnaHQnLCB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3dpZHRoJywgdGhpcy5fY3VyclNpemUud2lkdGggKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCB0aGlzLl9jdXJyUG9zLnggKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHRoaXMuX2N1cnJQb3MueSArICdweCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGp1c3RCeVJhdGlvKCkge1xuICAgIGlmICh0aGlzLl9hc3BlY3RSYXRpbykge1xuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5lIHx8IHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX2N1cnJTaXplLndpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5fY3VyclNpemUuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX2JvdW5kaW5nLndpZHRoIC0gdGhpcy5fYm91bmRpbmcucHIgLSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLl9ib3VuZGluZy5oZWlnaHQgLSB0aGlzLl9ib3VuZGluZy5wYiAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLSB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4gJiYgKHRoaXMuX2N1cnJQb3MueSArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkpIDwgMCkge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSAtdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0ICsgdGhpcy5fb3JpZ1Bvcy55ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53ICYmICh0aGlzLl9jdXJyUG9zLnggKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYKSA8IDApIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gLXRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggKyB0aGlzLl9vcmlnUG9zLnggKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY3VyclNpemUud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1heFdpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY3VyclNpemUuaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1heEhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrU2l6ZSgpIHtcbiAgICBjb25zdCBtaW5IZWlnaHQgPSAhdGhpcy5yek1pbkhlaWdodCA/IDEgOiB0aGlzLnJ6TWluSGVpZ2h0O1xuICAgIGNvbnN0IG1pbldpZHRoID0gIXRoaXMucnpNaW5XaWR0aCA/IDEgOiB0aGlzLnJ6TWluV2lkdGg7XG5cbiAgICBpZiAodGhpcy5fY3VyclNpemUuaGVpZ2h0IDwgbWluSGVpZ2h0KSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtaW5IZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gbWluSGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY3VyclNpemUud2lkdGggPCBtaW5XaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBtaW5XaWR0aDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArICh0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIG1pbldpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yek1heEhlaWdodCAmJiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPiB0aGlzLnJ6TWF4SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLnJ6TWF4SGVpZ2h0O1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgKHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRoaXMucnpNYXhIZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4V2lkdGggJiYgdGhpcy5fY3VyclNpemUud2lkdGggPiB0aGlzLnJ6TWF4V2lkdGgpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5yek1heFdpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gdGhpcy5yek1heFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEJvdW5kaW5nKCkge1xuICAgIGNvbnN0IGVsID0gdGhpcy5fY29udGFpbm1lbnQ7XG4gICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICBsZXQgcCA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgIGNvbnN0IG5hdGl2ZUVsID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIGxldCB0cmFuc2Zvcm1zID0gbmF0aXZlRWwuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykucmVwbGFjZSgvW14tXFxkLF0vZywgJycpLnNwbGl0KCcsJyk7XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nID0ge307XG4gICAgICB0aGlzLl9ib3VuZGluZy53aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fYm91bmRpbmcuaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy5fYm91bmRpbmcucHIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JyksIDEwKTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBiID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1ib3R0b20nKSwgMTApO1xuXG4gICAgICBpZiAodHJhbnNmb3Jtcy5sZW5ndGggPj0gNikge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gcGFyc2VJbnQodHJhbnNmb3Jtc1s0XSwgMTApO1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZID0gcGFyc2VJbnQodHJhbnNmb3Jtc1s1XSwgMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9ib3VuZGluZy5wb3NpdGlvbiA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgIGlmIChwID09PSAnc3RhdGljJykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGVsLCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0Qm91bmRpbmcoKSB7XG4gICAgaWYgKHRoaXMuX2JvdW5kaW5nICYmIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250YWlubWVudCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgfVxuICAgIHRoaXMuX2JvdW5kaW5nID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JpZFNpemUoKSB7XG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWU6XG4gICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IDEsIHk6IDEgfTtcblxuICAgIGlmICh0aGlzLnJ6R3JpZCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnJ6R3JpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IHRoaXMucnpHcmlkLCB5OiB0aGlzLnJ6R3JpZCB9O1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMucnpHcmlkKSkge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWRbMF0sIHk6IHRoaXMucnpHcmlkWzFdIH07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=