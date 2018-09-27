/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { HelperBlock } from './widgets/helper-block';
import { ResizeHandle } from './widgets/resize-handle';
import { Position } from './models/position';
import { Size } from './models/size';
export class AngularResizableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    constructor(el, renderer) {
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
    /**
     * Disables the resizable if set to false.
     * @param {?} v
     * @return {?}
     */
    set ngResizable(v) {
        if (v !== undefined && v !== null && v !== '') {
            this._resizable = !!v;
            this.updateResizable();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['rzHandles'] && !changes['rzHandles'].isFirstChange()) {
            this.updateResizable();
        }
        if (changes['rzAspectRatio'] && !changes['rzAspectRatio'].isFirstChange()) {
            this.updateAspectRatio();
        }
        if (changes['rzContainment'] && !changes['rzContainment'].isFirstChange()) {
            this.updateContainment();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateResizable();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeHandles();
        this._containment = null;
        this._helperBlock.dispose();
        this._helperBlock = null;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        const /** @type {?} */ elm = this.el.nativeElement;
        this._initSize = Size.getCurrent(elm);
        this._initPos = Position.getCurrent(elm);
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.updateAspectRatio();
        this.updateContainment();
    }
    /**
     * A method to reset size
     * @return {?}
     */
    resetSize() {
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.doResize();
    }
    /**
     * A method to get current status
     * @return {?}
     */
    getStatus() {
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
    }
    /**
     * @return {?}
     */
    updateResizable() {
        const /** @type {?} */ element = this.el.nativeElement;
        // clear handles:
        this.renderer.removeClass(element, 'ng-resizable');
        this.removeHandles();
        // create new ones:
        if (this._resizable) {
            this.renderer.addClass(element, 'ng-resizable');
            this.createHandles();
        }
    }
    /**
     * Use it to update aspect
     * @return {?}
     */
    updateAspectRatio() {
        if (typeof this.rzAspectRatio === 'boolean') {
            if (this.rzAspectRatio && this._currSize.height) {
                this._aspectRatio = (this._currSize.width / this._currSize.height);
            }
            else {
                this._aspectRatio = 0;
            }
        }
        else {
            let /** @type {?} */ r = Number(this.rzAspectRatio);
            this._aspectRatio = isNaN(r) ? 0 : r;
        }
    }
    /**
     * Use it to update containment
     * @return {?}
     */
    updateContainment() {
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
    }
    /**
     * Use it to create handle divs
     * @return {?}
     */
    createHandles() {
        if (!this.rzHandles) {
            return;
        }
        let /** @type {?} */ tmpHandleTypes;
        if (typeof this.rzHandles === 'string') {
            if (this.rzHandles === 'all') {
                tmpHandleTypes = ['n', 'e', 's', 'w', 'ne', 'se', 'nw', 'sw'];
            }
            else {
                tmpHandleTypes = this.rzHandles.replace(/ /g, '').toLowerCase().split(',');
            }
            for (let /** @type {?} */ type of tmpHandleTypes) {
                // default handle theme: ng-resizable-$type.
                let /** @type {?} */ handle = this.createHandleByType(type, `ng-resizable-${type}`);
                if (handle) {
                    this._handleType.push(type);
                    this._handles[type] = handle;
                }
            }
        }
        else {
            tmpHandleTypes = Object.keys(this.rzHandles);
            for (let /** @type {?} */ type of tmpHandleTypes) {
                // custom handle theme.
                let /** @type {?} */ handle = this.createHandleByType(type, this.rzHandles[type]);
                if (handle) {
                    this._handleType.push(type);
                    this._handles[type] = handle;
                }
            }
        }
    }
    /**
     * Use it to create a handle
     * @param {?} type
     * @param {?} css
     * @return {?}
     */
    createHandleByType(type, css) {
        const /** @type {?} */ _el = this.el.nativeElement;
        if (!type.match(/^(se|sw|ne|nw|n|e|s|w)$/)) {
            console.error('Invalid handle type:', type);
            return null;
        }
        return new ResizeHandle(_el, this.renderer, type, css, this.onMouseDown.bind(this));
    }
    /**
     * @return {?}
     */
    removeHandles() {
        for (let /** @type {?} */ type of this._handleType) {
            this._handles[type].dispose();
        }
        this._handleType = [];
        this._handles = {};
    }
    /**
     * @param {?} event
     * @param {?} handle
     * @return {?}
     */
    onMouseDown(event, handle) {
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
    }
    /**
     * @return {?}
     */
    onMouseLeave() {
        if (this._handleResizing) {
            this.stopResize();
            this._origMousePos = null;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
            this.resizeTo(Position.fromEvent(event));
            this.onResizing();
        }
    }
    /**
     * @param {?} handle
     * @return {?}
     */
    startResize(handle) {
        const /** @type {?} */ elm = this.el.nativeElement;
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
    }
    /**
     * @return {?}
     */
    stopResize() {
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
    }
    /**
     * @return {?}
     */
    onResizing() {
        this.rzResizing.emit(this.getResizingEvent());
    }
    /**
     * @return {?}
     */
    getResizingEvent() {
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
    }
    /**
     * @return {?}
     */
    updateDirection() {
        this._direction = {
            n: !!this._handleResizing.type.match(/n/),
            s: !!this._handleResizing.type.match(/s/),
            w: !!this._handleResizing.type.match(/w/),
            e: !!this._handleResizing.type.match(/e/)
        };
    }
    /**
     * @param {?} p
     * @return {?}
     */
    resizeTo(p) {
        p.subtract(this._origMousePos);
        const /** @type {?} */ tmpX = Math.round(p.x / this._gridSize.x / this.scale) * this._gridSize.x;
        const /** @type {?} */ tmpY = Math.round(p.y / this._gridSize.y / this.scale) * this._gridSize.y;
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
    }
    /**
     * @return {?}
     */
    doResize() {
        const /** @type {?} */ container = this.el.nativeElement;
        this.renderer.setStyle(container, 'height', this._currSize.height + 'px');
        this.renderer.setStyle(container, 'width', this._currSize.width + 'px');
        this.renderer.setStyle(container, 'left', this._currPos.x + 'px');
        this.renderer.setStyle(container, 'top', this._currPos.y + 'px');
    }
    /**
     * @return {?}
     */
    adjustByRatio() {
        if (this._aspectRatio) {
            if (this._direction.e || this._direction.w) {
                this._currSize.height = this._currSize.width / this._aspectRatio;
            }
            else {
                this._currSize.width = this._aspectRatio * this._currSize.height;
            }
        }
    }
    /**
     * @return {?}
     */
    checkBounds() {
        if (this._containment) {
            const /** @type {?} */ maxWidth = this._bounding.width - this._bounding.pr - this.el.nativeElement.offsetLeft - this._bounding.translateX;
            const /** @type {?} */ maxHeight = this._bounding.height - this._bounding.pb - this.el.nativeElement.offsetTop - this._bounding.translateY;
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
    }
    /**
     * @return {?}
     */
    checkSize() {
        const /** @type {?} */ minHeight = !this.rzMinHeight ? 1 : this.rzMinHeight;
        const /** @type {?} */ minWidth = !this.rzMinWidth ? 1 : this.rzMinWidth;
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
    }
    /**
     * @return {?}
     */
    getBounding() {
        const /** @type {?} */ el = this._containment;
        const /** @type {?} */ computed = window.getComputedStyle(el);
        if (computed) {
            let /** @type {?} */ p = computed.getPropertyValue('position');
            const /** @type {?} */ nativeEl = window.getComputedStyle(this.el.nativeElement);
            let /** @type {?} */ transforms = nativeEl.getPropertyValue('transform').replace(/[^-\d,]/g, '').split(',');
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
    }
    /**
     * @return {?}
     */
    resetBounding() {
        if (this._bounding && this._bounding.position === 'static') {
            this.renderer.setStyle(this._containment, 'position', 'relative');
        }
        this._bounding = null;
    }
    /**
     * @return {?}
     */
    getGridSize() {
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
    }
}
AngularResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngResizable]',
                exportAs: 'ngResizable'
            },] },
];
/** @nocollapse */
AngularResizableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXNpemFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFDbkMsWUFBWSxFQUViLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdkQsT0FBTyxFQUFFLFFBQVEsRUFBYSxNQUFNLG1CQUFtQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPckMsTUFBTTs7Ozs7SUFrR0osWUFBb0IsRUFBMkIsRUFBVSxRQUFtQjtRQUF4RCxPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7MEJBakd2RCxJQUFJO3dCQUMyQixFQUFFOzJCQUN0QixFQUFFOytCQUNNLElBQUk7MEJBQ3FDLElBQUk7NEJBQzlELENBQUM7NEJBQ1ksSUFBSTs2QkFDTixJQUFJOzs7O3lCQUdaLElBQUk7d0JBQ0QsSUFBSTs7Ozt5QkFHUCxJQUFJO3dCQUNELElBQUk7Ozs7eUJBR1AsSUFBSTt3QkFDRCxJQUFJOzs7O3lCQUdGLElBQUk7eUJBRVYsSUFBSTs7Ozs7NEJBTU8sSUFBSTs7Ozs7Ozs7O3lCQWlCRCxRQUFROzs7Ozs7OzZCQVFKLEtBQUs7Ozs7Ozs7Ozs2QkFVRCxJQUFJOzs7OztzQkFNZCxJQUFJOzs7OzBCQUdYLElBQUk7Ozs7MkJBR0gsSUFBSTs7OzswQkFHTCxJQUFJOzs7OzJCQUdILElBQUk7Ozs7dUJBR2YsSUFBSSxZQUFZLEVBQWdCOzs7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QVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs7Ozs7SUFHM0QsYUFBYTtRQUNuQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDbEU7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2FBQ2xFO1NBQ0Y7Ozs7O0lBR0ssV0FBVztRQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUN0Qix1QkFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1lBQ3pILHVCQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7WUFFMUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2FBQzdGO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2FBQzNGO1lBRUQsRUFBRSxDQUFDLENB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QUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3JEO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDM0Q7U0FDRjs7OztZQTFnQkosU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUUsYUFBYTthQUN4Qjs7OztZQWhCWSxVQUFVO1lBQUUsU0FBUzs7OzBCQW1EL0IsS0FBSzt3QkFjTCxLQUFLOzRCQVFMLEtBQUs7NEJBVUwsS0FBSztxQkFNTCxLQUFLO3lCQUdMLEtBQUs7MEJBR0wsS0FBSzt5QkFHTCxLQUFLOzBCQUdMLEtBQUs7c0JBR0wsTUFBTTt5QkFHTixNQUFNO3FCQUdOLE1BQU07b0JBR04sS0FBSzsyQkF5TEwsWUFBWSxTQUFDLGtCQUFrQixjQUMvQixZQUFZLFNBQUMscUJBQXFCLGNBQ2xDLFlBQVksU0FBQyxtQkFBbUIsY0FDaEMsWUFBWSxTQUFDLHNCQUFzQjswQkFRbkMsWUFBWSxTQUFDLG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDLGNBQzdDLFlBQVksU0FBQyxvQkFBb0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsIEhvc3RMaXN0ZW5lcixcbiAgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsXG4gIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSGVscGVyQmxvY2sgfSBmcm9tICcuL3dpZGdldHMvaGVscGVyLWJsb2NrJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZSB9IGZyb20gJy4vd2lkZ2V0cy9yZXNpemUtaGFuZGxlJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZVR5cGUgfSBmcm9tICcuL21vZGVscy9yZXNpemUtaGFuZGxlLXR5cGUnO1xuaW1wb3J0IHsgUG9zaXRpb24sIElQb3NpdGlvbiB9IGZyb20gJy4vbW9kZWxzL3Bvc2l0aW9uJztcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuL21vZGVscy9zaXplJztcbmltcG9ydCB7IElSZXNpemVFdmVudCB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1ldmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ1Jlc2l6YWJsZV0nLFxuICBleHBvcnRBczogJ25nUmVzaXphYmxlJ1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX3Jlc2l6YWJsZSA9IHRydWU7XG4gIHByaXZhdGUgX2hhbmRsZXM6IHsgW2tleTogc3RyaW5nXTogUmVzaXplSGFuZGxlIH0gPSB7fTtcbiAgcHJpdmF0ZSBfaGFuZGxlVHlwZTogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfaGFuZGxlUmVzaXppbmc6IFJlc2l6ZUhhbmRsZSA9IG51bGw7XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogeyAnbic6IGJvb2xlYW4sICdzJzogYm9vbGVhbiwgJ3cnOiBib29sZWFuLCAnZSc6IGJvb2xlYW4gfSA9IG51bGw7XG4gIHByaXZhdGUgX2FzcGVjdFJhdGlvID0gMDtcbiAgcHJpdmF0ZSBfY29udGFpbm1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ01vdXNlUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIE9yaWdpbmFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX29yaWdTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ1BvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBDdXJyZW50IFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2N1cnJTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VyclBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBJbml0aWFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2luaXRTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfaW5pdFBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBTbmFwIHRvIGdpcmQgKi9cbiAgcHJpdmF0ZSBfZ3JpZFNpemU6IElQb3NpdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfYm91bmRpbmc6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICAvKiogRGlzYWJsZXMgdGhlIHJlc2l6YWJsZSBpZiBzZXQgdG8gZmFsc2UuICovXG4gIEBJbnB1dCgpIHNldCBuZ1Jlc2l6YWJsZSh2OiBhbnkpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHYgIT09IG51bGwgJiYgdiAhPT0gJycpIHtcbiAgICAgIHRoaXMuX3Jlc2l6YWJsZSA9ICEhdjtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoaWNoIGhhbmRsZXMgY2FuIGJlIHVzZWQgZm9yIHJlc2l6aW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKiBbcnpIYW5kbGVzXSA9IFwiJ24sZSxzLHcsc2UsbmUsc3csbncnXCJcbiAgICogZXF1YWxzIHRvOiBbcnpIYW5kbGVzXSA9IFwiJ2FsbCdcIlxuICAgKlxuICAgKiAqL1xuICBASW5wdXQoKSByekhhbmRsZXM6IFJlc2l6ZUhhbmRsZVR5cGUgPSAnZSxzLHNlJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgYmUgY29uc3RyYWluZWQgdG8gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBib29sZWFuOiBXaGVuIHNldCB0byB0cnVlLCB0aGUgZWxlbWVudCB3aWxsIG1haW50YWluIGl0cyBvcmlnaW5hbCBhc3BlY3QgcmF0aW8uXG4gICAqICBudW1iZXI6IEZvcmNlIHRoZSBlbGVtZW50IHRvIG1haW50YWluIGEgc3BlY2lmaWMgYXNwZWN0IHJhdGlvIGR1cmluZyByZXNpemluZy5cbiAgICovXG4gIEBJbnB1dCgpIHJ6QXNwZWN0UmF0aW86IGJvb2xlYW4gfCBudW1iZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RyYWlucyByZXNpemluZyB0byB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgb3IgcmVnaW9uLlxuICAgKiAgTXVsdGlwbGUgdHlwZXMgc3VwcG9ydGVkOlxuICAgKiAgU2VsZWN0b3I6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmaXJzdCBlbGVtZW50IGZvdW5kIGJ5IHRoZSBzZWxlY3Rvci5cbiAgICogICAgICAgICAgICBJZiBubyBlbGVtZW50IGlzIGZvdW5kLCBubyBjb250YWlubWVudCB3aWxsIGJlIHNldC5cbiAgICogIEVsZW1lbnQ6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoaXMgZWxlbWVudC5cbiAgICogIFN0cmluZzogUG9zc2libGUgdmFsdWVzOiBcInBhcmVudFwiLlxuICAgKi9cbiAgQElucHV0KCkgcnpDb250YWlubWVudDogc3RyaW5nIHwgSFRNTEVsZW1lbnQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBTbmFwcyB0aGUgcmVzaXppbmcgZWxlbWVudCB0byBhIGdyaWQsIGV2ZXJ5IHggYW5kIHkgcGl4ZWxzLlxuICAgKiBBIG51bWJlciBmb3IgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IG9yIGFuIGFycmF5IHZhbHVlcyBsaWtlIFsgeCwgeSBdXG4gICAqL1xuICBASW5wdXQoKSByekdyaWQ6IG51bWJlciB8IG51bWJlcltdID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWluV2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5IZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHdpZHRoIHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1heFdpZHRoOiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBoZWlnaHQgdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4SGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdG9wIHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0b3AgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogSW5wdXQgY3NzIHNjYWxlIHRyYW5zZm9ybSBvZiBlbGVtZW50IHNvIHRyYW5zbGF0aW9ucyBhcmUgY29ycmVjdCAqL1xuICBASW5wdXQoKSBzY2FsZSA9IDE7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncnpIYW5kbGVzJ10gJiYgIWNoYW5nZXNbJ3J6SGFuZGxlcyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sncnpBc3BlY3RSYXRpbyddICYmICFjaGFuZ2VzWydyekFzcGVjdFJhdGlvJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFzcGVjdFJhdGlvKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3J6Q29udGFpbm1lbnQnXSAmJiAhY2hhbmdlc1sncnpDb250YWlubWVudCddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVDb250YWlubWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlbW92ZUhhbmRsZXMoKTtcbiAgICB0aGlzLl9jb250YWlubWVudCA9IG51bGw7XG4gICAgdGhpcy5faGVscGVyQmxvY2suZGlzcG9zZSgpO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbnVsbDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5faW5pdFNpemUgPSBTaXplLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9pbml0UG9zID0gUG9zaXRpb24uZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLnVwZGF0ZUFzcGVjdFJhdGlvKCk7XG4gICAgdGhpcy51cGRhdGVDb250YWlubWVudCgpO1xuICB9XG5cbiAgLyoqIEEgbWV0aG9kIHRvIHJlc2V0IHNpemUgKi9cbiAgcHVibGljIHJlc2V0U2l6ZSgpIHtcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9pbml0U2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5faW5pdFBvcyk7XG4gICAgdGhpcy5kb1Jlc2l6ZSgpO1xuICB9XG5cbiAgLyoqIEEgbWV0aG9kIHRvIGdldCBjdXJyZW50IHN0YXR1cyAqL1xuICBwdWJsaWMgZ2V0U3RhdHVzKCkge1xuICAgIGlmICghdGhpcy5fY3VyclBvcyB8fCAhdGhpcy5fY3VyclNpemUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9jdXJyU2l6ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHRcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0b3A6IHRoaXMuX2N1cnJQb3MueSxcbiAgICAgICAgbGVmdDogdGhpcy5fY3VyclBvcy54XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUmVzaXphYmxlKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBjbGVhciBoYW5kbGVzOlxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLXJlc2l6YWJsZScpO1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuXG4gICAgLy8gY3JlYXRlIG5ldyBvbmVzOlxuICAgIGlmICh0aGlzLl9yZXNpemFibGUpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLXJlc2l6YWJsZScpO1xuICAgICAgdGhpcy5jcmVhdGVIYW5kbGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgYXNwZWN0ICovXG4gIHByaXZhdGUgdXBkYXRlQXNwZWN0UmF0aW8oKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6QXNwZWN0UmF0aW8gPT09ICdib29sZWFuJykge1xuICAgICAgaWYgKHRoaXMucnpBc3BlY3RSYXRpbyAmJiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSAodGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgciA9IE51bWJlcih0aGlzLnJ6QXNwZWN0UmF0aW8pO1xuICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSBpc05hTihyKSA/IDAgOiByO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gdXBkYXRlIGNvbnRhaW5tZW50ICovXG4gIHByaXZhdGUgdXBkYXRlQ29udGFpbm1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLnJ6Q29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucnpDb250YWlubWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICh0aGlzLnJ6Q29udGFpbm1lbnQgPT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb250YWlubWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHRoaXMucnpDb250YWlubWVudCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gdGhpcy5yekNvbnRhaW5tZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gY3JlYXRlIGhhbmRsZSBkaXZzICovXG4gIHByaXZhdGUgY3JlYXRlSGFuZGxlcygpIHtcbiAgICBpZiAoIXRoaXMucnpIYW5kbGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRtcEhhbmRsZVR5cGVzOiBzdHJpbmdbXTtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpIYW5kbGVzID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpIYW5kbGVzID09PSAnYWxsJykge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IFsnbicsICdlJywgJ3MnLCAndycsICduZScsICdzZScsICdudycsICdzdyddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wSGFuZGxlVHlwZXMgPSB0aGlzLnJ6SGFuZGxlcy5yZXBsYWNlKC8gL2csICcnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gZGVmYXVsdCBoYW5kbGUgdGhlbWU6IG5nLXJlc2l6YWJsZS0kdHlwZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIGBuZy1yZXNpemFibGUtJHt0eXBlfWApO1xuICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlVHlwZS5wdXNoKHR5cGUpO1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0gPSBoYW5kbGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG1wSGFuZGxlVHlwZXMgPSBPYmplY3Qua2V5cyh0aGlzLnJ6SGFuZGxlcyk7XG4gICAgICBmb3IgKGxldCB0eXBlIG9mIHRtcEhhbmRsZVR5cGVzKSB7XG4gICAgICAgIC8vIGN1c3RvbSBoYW5kbGUgdGhlbWUuXG4gICAgICAgIGxldCBoYW5kbGUgPSB0aGlzLmNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlLCB0aGlzLnJ6SGFuZGxlc1t0eXBlXSk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgYSBoYW5kbGUgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVCeVR5cGUodHlwZTogc3RyaW5nLCBjc3M6IHN0cmluZyk6IFJlc2l6ZUhhbmRsZSB7XG4gICAgY29uc3QgX2VsID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCF0eXBlLm1hdGNoKC9eKHNlfHN3fG5lfG53fG58ZXxzfHcpJC8pKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGhhbmRsZSB0eXBlOicsIHR5cGUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNpemVIYW5kbGUoX2VsLCB0aGlzLnJlbmRlcmVyLCB0eXBlLCBjc3MsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUhhbmRsZXMoKSB7XG4gICAgZm9yIChsZXQgdHlwZSBvZiB0aGlzLl9oYW5kbGVUeXBlKSB7XG4gICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdLmRpc3Bvc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVUeXBlID0gW107XG4gICAgdGhpcy5faGFuZGxlcyA9IHt9O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBoYW5kbGU6IFJlc2l6ZUhhbmRsZSkge1xuICAgIC8vIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5idXR0b24gPT09IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgZXZlbnRzXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICghdGhpcy5faGFuZGxlUmVzaXppbmcpIHtcbiAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IFBvc2l0aW9uLmZyb21FdmVudChldmVudCk7XG4gICAgICB0aGlzLnN0YXJ0UmVzaXplKGhhbmRsZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbGVhdmUnKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaGVuZCcpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNoY2FuY2VsJylcbiAgb25Nb3VzZUxlYXZlKCkge1xuICAgIGlmICh0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgdGhpcy5zdG9wUmVzaXplKCk7XG4gICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbW92ZScsIFsnJGV2ZW50J10pXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNobW92ZScsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmICh0aGlzLl9oYW5kbGVSZXNpemluZyAmJiB0aGlzLl9yZXNpemFibGUgJiYgdGhpcy5fb3JpZ01vdXNlUG9zICYmIHRoaXMuX29yaWdQb3MgJiYgdGhpcy5fb3JpZ1NpemUpIHtcbiAgICAgIHRoaXMucmVzaXplVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICB0aGlzLm9uUmVzaXppbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0UmVzaXplKGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX29yaWdTaXplID0gU2l6ZS5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IFBvc2l0aW9uLmdldEN1cnJlbnQoZWxtKTsgLy8geDogbGVmdCwgeTogdG9wXG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5fb3JpZ1NpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX29yaWdQb3MpO1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgdGhpcy5nZXRCb3VuZGluZygpO1xuICAgIH1cbiAgICB0aGlzLmdldEdyaWRTaXplKCk7XG5cbiAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLmFkZCgpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gaGFuZGxlO1xuICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKCk7XG4gICAgdGhpcy5yelN0YXJ0LmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wUmVzaXplKCkge1xuICAgIC8vIFJlbW92ZSB0aGUgaGVscGVyIGRpdjpcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcbiAgICB0aGlzLnJ6U3RvcC5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemluZyA9IG51bGw7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IG51bGw7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLnJlc2V0Qm91bmRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uUmVzaXppbmcoKSB7XG4gICAgdGhpcy5yelJlc2l6aW5nLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemluZ0V2ZW50KCk6IElSZXNpemVFdmVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvc3Q6IHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgIGhhbmRsZTogdGhpcy5faGFuZGxlUmVzaXppbmcgPyB0aGlzLl9oYW5kbGVSZXNpemluZy5lbCA6IG51bGwsXG4gICAgICBzaXplOiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9jdXJyU2l6ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHRcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0b3A6IHRoaXMuX2N1cnJQb3MueSxcbiAgICAgICAgbGVmdDogdGhpcy5fY3VyclBvcy54XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IHtcbiAgICAgIG46ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvbi8pLFxuICAgICAgczogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9zLyksXG4gICAgICB3OiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL3cvKSxcbiAgICAgIGU6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvZS8pXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplVG8ocDogUG9zaXRpb24pIHtcbiAgICBwLnN1YnRyYWN0KHRoaXMuX29yaWdNb3VzZVBvcyk7XG5cbiAgICBjb25zdCB0bXBYID0gTWF0aC5yb3VuZChwLnggLyB0aGlzLl9ncmlkU2l6ZS54IC8gdGhpcy5zY2FsZSkgKiB0aGlzLl9ncmlkU2l6ZS54O1xuICAgIGNvbnN0IHRtcFkgPSBNYXRoLnJvdW5kKHAueSAvIHRoaXMuX2dyaWRTaXplLnkgLyB0aGlzLnNjYWxlKSAqIHRoaXMuX2dyaWRTaXplLnk7XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgIC8vIG4sIG5lLCBud1xuICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgdG1wWTtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRtcFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24ucykge1xuICAgICAgLy8gcywgc2UsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0bXBZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSkge1xuICAgICAgLy8gZSwgbmUsIHNlXG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdG1wWDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAvLyB3LCBudywgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggLSB0bXBYO1xuICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgdG1wWDtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgdGhpcy5jaGVja1NpemUoKTtcbiAgICB0aGlzLmFkanVzdEJ5UmF0aW8oKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICBwcml2YXRlIGRvUmVzaXplKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2hlaWdodCcsIHRoaXMuX2N1cnJTaXplLmhlaWdodCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCB0aGlzLl9jdXJyU2l6ZS53aWR0aCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHRoaXMuX2N1cnJQb3MueCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgdGhpcy5fY3VyclBvcy55ICsgJ3B4Jyk7XG4gIH1cblxuICBwcml2YXRlIGFkanVzdEJ5UmF0aW8oKSB7XG4gICAgaWYgKHRoaXMuX2FzcGVjdFJhdGlvKSB7XG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLmUgfHwgdGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fYm91bmRpbmcud2lkdGggLSB0aGlzLl9ib3VuZGluZy5wciAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuX2JvdW5kaW5nLmhlaWdodCAtIHRoaXMuX2JvdW5kaW5nLnBiIC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCAtIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubiAmJiAodGhpcy5fY3VyclBvcy55ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0aGlzLl9vcmlnUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncgJiYgKHRoaXMuX2N1cnJQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVgpIDwgMCkge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSAtdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCArIHRoaXMuX29yaWdQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWF4V2lkdGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tTaXplKCkge1xuICAgIGNvbnN0IG1pbkhlaWdodCA9ICF0aGlzLnJ6TWluSGVpZ2h0ID8gMSA6IHRoaXMucnpNaW5IZWlnaHQ7XG4gICAgY29uc3QgbWluV2lkdGggPSAhdGhpcy5yek1pbldpZHRoID8gMSA6IHRoaXMucnpNaW5XaWR0aDtcblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPCBtaW5IZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1pbkhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSBtaW5IZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA8IG1pbldpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1pbldpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gbWluV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4SGVpZ2h0ICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IHRoaXMucnpNYXhIZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMucnpNYXhIZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdGhpcy5yek1heEhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhXaWR0aCAmJiB0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IHRoaXMucnpNYXhXaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLnJ6TWF4V2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSB0aGlzLnJ6TWF4V2lkdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Qm91bmRpbmcoKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9jb250YWlubWVudDtcbiAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgIGxldCBwID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgY29uc3QgbmF0aXZlRWwgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgbGV0IHRyYW5zZm9ybXMgPSBuYXRpdmVFbC5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKS5yZXBsYWNlKC9bXi1cXGQsXS9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgdGhpcy5fYm91bmRpbmcgPSB7fTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLndpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9ib3VuZGluZy5oZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wciA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSwgMTApO1xuICAgICAgdGhpcy5fYm91bmRpbmcucGIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1zLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSBwYXJzZUludCh0cmFuc2Zvcm1zWzRdLCAxMCk7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSBwYXJzZUludCh0cmFuc2Zvcm1zWzVdLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgaWYgKHAgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWwsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRCb3VuZGluZygpIHtcbiAgICBpZiAodGhpcy5fYm91bmRpbmcgJiYgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRhaW5tZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICB9XG4gICAgdGhpcy5fYm91bmRpbmcgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcmlkU2l6ZSgpIHtcbiAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZTpcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogMSwgeTogMSB9O1xuXG4gICAgaWYgKHRoaXMucnpHcmlkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucnpHcmlkID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWQsIHk6IHRoaXMucnpHcmlkIH07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yekdyaWQpKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZFswXSwgeTogdGhpcy5yekdyaWRbMV0gfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==