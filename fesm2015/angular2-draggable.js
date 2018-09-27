import { Directive, ElementRef, Renderer2, Input, Output, EventEmitter, NgZone, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Position {
    /**
     * @param {?} x
     * @param {?} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    static fromEvent(e) {
        if (e instanceof MouseEvent) {
            return new Position(e.clientX, e.clientY);
        }
        else {
            return new Position(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    static isIPosition(obj) {
        return !!obj && ('x' in obj) && ('y' in obj);
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static getCurrent(el) {
        let /** @type {?} */ pos = new Position(0, 0);
        if (window) {
            const /** @type {?} */ computed = window.getComputedStyle(el);
            if (computed) {
                pos.x = parseInt(computed.getPropertyValue('left'), 10);
                pos.y = parseInt(computed.getPropertyValue('top'), 10);
            }
            return pos;
        }
        else {
            console.error('Not Supported!');
            return null;
        }
    }
    /**
     * @param {?} p
     * @return {?}
     */
    static copy(p) {
        return new Position(0, 0).set(p);
    }
    /**
     * @param {?} p
     * @return {?}
     */
    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    /**
     * @param {?} p
     * @return {?}
     */
    subtract(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }
    /**
     * @return {?}
     */
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    /**
     * @param {?} p
     * @return {?}
     */
    set(p) {
        this.x = p.x;
        this.y = p.y;
        return this;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class HelperBlock {
    /**
     * @param {?} parent
     * @param {?} renderer
     */
    constructor(parent, renderer) {
        this.parent = parent;
        this.renderer = renderer;
        this._added = false;
        // generate helper div
        let /** @type {?} */ helper = renderer.createElement('div');
        renderer.setStyle(helper, 'position', 'absolute');
        renderer.setStyle(helper, 'width', '100%');
        renderer.setStyle(helper, 'height', '100%');
        renderer.setStyle(helper, 'background-color', 'transparent');
        renderer.setStyle(helper, 'top', '0');
        renderer.setStyle(helper, 'left', '0');
        // done
        this._helper = helper;
    }
    /**
     * @return {?}
     */
    add() {
        // append div to parent
        if (this.parent && !this._added) {
            this.parent.appendChild(this._helper);
            this._added = true;
        }
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.parent && this._added) {
            this.parent.removeChild(this._helper);
            this._added = false;
        }
    }
    /**
     * @return {?}
     */
    dispose() {
        this._helper = null;
        this._added = false;
    }
    /**
     * @return {?}
     */
    get el() {
        return this._helper;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularDraggableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} zone
     */
    constructor(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.allowDrag = true;
        this.moving = false;
        this.orignal = null;
        this.oldTrans = new Position(0, 0);
        this.tempTrans = new Position(0, 0);
        this.oldZIndex = '';
        this._zIndex = '';
        this.needTransform = false;
        /**
         * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
         * https://github.com/xieziyu/angular2-draggable/issues/84
         */
        this._helperBlock = null;
        this.started = new EventEmitter();
        this.stopped = new EventEmitter();
        this.edge = new EventEmitter();
        /**
         * List of allowed out of bounds edges *
         */
        this.outOfBounds = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        /**
         * Round the position to nearest grid
         */
        this.gridSize = 1;
        /**
         * Whether to limit the element stay in the bounds
         */
        this.inBounds = false;
        /**
         * Whether the element should use it's previous drag position on a new drag event.
         */
        this.trackPosition = true;
        /**
         * Input css scale transform of element so translations are correct
         */
        this.scale = 1;
        /**
         * Whether to prevent default event
         */
        this.preventDefaultEvent = false;
        /**
         * Set initial position by offsets
         */
        this.position = { x: 0, y: 0 };
        /**
         * Emit position offsets when moving
         */
        this.movingOffset = new EventEmitter();
        /**
         * Emit position offsets when put back
         */
        this.endOffset = new EventEmitter();
        this._helperBlock = new HelperBlock(el.nativeElement, renderer);
    }
    /**
     * Set z-index when not dragging
     * @param {?} setting
     * @return {?}
     */
    set zIndex(setting) {
        this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
        this._zIndex = setting;
    }
    /**
     * @param {?} setting
     * @return {?}
     */
    set ngDraggable(setting) {
        if (setting !== undefined && setting !== null && setting !== '') {
            this.allowDrag = !!setting;
            let /** @type {?} */ element = this.handle ? this.handle : this.el.nativeElement;
            if (this.allowDrag) {
                this.renderer.addClass(element, 'ng-draggable');
            }
            else {
                this.renderer.removeClass(element, 'ng-draggable');
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._bindEvents();
        if (this.allowDrag) {
            let /** @type {?} */ element = this.handle ? this.handle : this.el.nativeElement;
            this.renderer.addClass(element, 'ng-draggable');
        }
        this.resetPosition();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.bounds = null;
        this.handle = null;
        this.orignal = null;
        this.oldTrans = null;
        this.tempTrans = null;
        this._helperBlock.dispose();
        this._helperBlock = null;
        this._removeListener1();
        this._removeListener2();
        this._removeListener3();
        this._removeListener4();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['position'] && !changes['position'].isFirstChange()) {
            let /** @type {?} */ p = changes['position'].currentValue;
            if (!this.moving) {
                if (Position.isIPosition(p)) {
                    this.oldTrans.set(p);
                }
                else {
                    this.oldTrans.reset();
                }
                this.transform();
            }
            else {
                this.needTransform = true;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.inBounds) {
            this.boundsCheck();
            this.oldTrans.add(this.tempTrans);
            this.tempTrans.reset();
        }
    }
    /**
     * @return {?}
     */
    resetPosition() {
        if (Position.isIPosition(this.position)) {
            this.oldTrans.set(this.position);
        }
        else {
            this.oldTrans.reset();
        }
        this.tempTrans.reset();
        this.transform();
    }
    /**
     * @param {?} p
     * @return {?}
     */
    moveTo(p) {
        if (this.orignal) {
            p.subtract(this.orignal);
            this.tempTrans.set({ x: p.x / this.scale, y: p.y / this.scale });
            this.transform();
            if (this.bounds) {
                this.zone.run(() => this.edge.emit(this.boundsCheck()));
            }
            this.zone.run(() => this.movingOffset.emit({
                x: this.tempTrans.x + this.oldTrans.x,
                y: this.tempTrans.y + this.oldTrans.y
            }));
        }
    }
    /**
     * @return {?}
     */
    transform() {
        let /** @type {?} */ translateX = this.tempTrans.x + this.oldTrans.x;
        let /** @type {?} */ translateY = this.tempTrans.y + this.oldTrans.y;
        // Snap to grid: by grid size
        if (this.gridSize > 1) {
            translateX = Math.round(translateX / this.gridSize) * this.gridSize;
            translateY = Math.round(translateY / this.gridSize) * this.gridSize;
        }
        let /** @type {?} */ value = `translate(${translateX}px, ${translateY}px)`;
        this.renderer.setStyle(this.el.nativeElement, 'transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
    }
    /**
     * @return {?}
     */
    pickUp() {
        // get old z-index:
        this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
        if (window) {
            this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('z-index');
        }
        if (this.zIndexMoving) {
            this.renderer.setStyle(this.el.nativeElement, 'z-index', this.zIndexMoving);
        }
        if (!this.moving) {
            this.zone.run(() => this.started.emit(this.el.nativeElement));
            this.moving = true;
        }
    }
    /**
     * @return {?}
     */
    boundsCheck() {
        if (this.bounds) {
            let /** @type {?} */ boundary = this.bounds.getBoundingClientRect();
            let /** @type {?} */ elem = this.el.nativeElement.getBoundingClientRect();
            let /** @type {?} */ result = {
                'top': this.outOfBounds.top ? true : boundary.top < elem.top,
                'right': this.outOfBounds.right ? true : boundary.right > elem.right,
                'bottom': this.outOfBounds.bottom ? true : boundary.bottom > elem.bottom,
                'left': this.outOfBounds.left ? true : boundary.left < elem.left
            };
            if (this.inBounds) {
                if (!result.top) {
                    this.tempTrans.y -= (elem.top - boundary.top) / this.scale;
                }
                if (!result.bottom) {
                    this.tempTrans.y -= (elem.bottom - boundary.bottom) / this.scale;
                }
                if (!result.right) {
                    this.tempTrans.x -= (elem.right - boundary.right) / this.scale;
                }
                if (!result.left) {
                    this.tempTrans.x -= (elem.left - boundary.left) / this.scale;
                }
                this.transform();
            }
            return result;
        }
    }
    /**
     * @return {?}
     */
    putBack() {
        if (this._zIndex) {
            this.renderer.setStyle(this.el.nativeElement, 'z-index', this._zIndex);
        }
        else if (this.zIndexMoving) {
            if (this.oldZIndex) {
                this.renderer.setStyle(this.el.nativeElement, 'z-index', this.oldZIndex);
            }
            else {
                this.el.nativeElement.style.removeProperty('z-index');
            }
        }
        if (this.moving) {
            this.zone.run(() => this.stopped.emit(this.el.nativeElement));
            // Remove the helper div:
            this._helperBlock.remove();
            if (this.needTransform) {
                if (Position.isIPosition(this.position)) {
                    this.oldTrans.set(this.position);
                }
                else {
                    this.oldTrans.reset();
                }
                this.transform();
                this.needTransform = false;
            }
            if (this.bounds) {
                this.zone.run(() => this.edge.emit(this.boundsCheck()));
            }
            this.moving = false;
            this.zone.run(() => this.endOffset.emit({
                x: this.tempTrans.x + this.oldTrans.x,
                y: this.tempTrans.y + this.oldTrans.y
            }));
            if (this.trackPosition) {
                this.oldTrans.add(this.tempTrans);
            }
            this.tempTrans.reset();
            if (!this.trackPosition) {
                this.transform();
            }
        }
    }
    /**
     * @param {?} target
     * @param {?} element
     * @return {?}
     */
    checkHandleTarget(target, element) {
        // Checks if the target is the element clicked, then checks each child element of element as well
        // Ignores button clicks
        // Ignore elements of type button
        if (element.tagName === 'BUTTON') {
            return false;
        }
        // If the target was found, return true (handle was found)
        if (element === target) {
            return true;
        }
        // Recursively iterate this elements children
        for (let /** @type {?} */ child in element.children) {
            if (element.children.hasOwnProperty(child)) {
                if (this.checkHandleTarget(target, element.children[child])) {
                    return true;
                }
            }
        }
        // Handle was not found in this lineage
        // Note: return false is ignore unless it is the parent element
        return false;
    }
    /**
     * @return {?}
     */
    _bindEvents() {
        this.zone.runOutsideAngular(() => {
            this._removeListener1 = this.renderer.listen(this.el.nativeElement, 'mousedown', (event) => {
                // 1. skip right click;
                if (event instanceof MouseEvent && event.button === 2) {
                    return;
                }
                // 2. if handle is set, the element can only be moved by handle
                let /** @type {?} */ target = event.target || event.srcElement;
                if (this.handle !== undefined && !this.checkHandleTarget(target, this.handle)) {
                    return;
                }
                if (this.preventDefaultEvent) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                this.orignal = Position.fromEvent(event);
                this.pickUp();
            });
            this._removeListener2 = this.renderer.listen('document', 'mouseup', () => {
                this.putBack();
            });
            this._removeListener3 = this.renderer.listen('document', 'mouseleave', () => {
                this.putBack();
            });
            this._removeListener4 = this.renderer.listen('document', 'mousemove', (event) => {
                if (this.moving && this.allowDrag) {
                    if (this.preventDefaultEvent) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    // Add a transparent helper div:
                    this._helperBlock.add();
                    this.moveTo(Position.fromEvent(event));
                }
            });
        });
    }
}
AngularDraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngDraggable]',
                exportAs: 'ngDraggable'
            },] },
];
/** @nocollapse */
AngularDraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgZone }
];
AngularDraggableDirective.propDecorators = {
    started: [{ type: Output }],
    stopped: [{ type: Output }],
    edge: [{ type: Output }],
    handle: [{ type: Input }],
    bounds: [{ type: Input }],
    outOfBounds: [{ type: Input }],
    gridSize: [{ type: Input }],
    zIndexMoving: [{ type: Input }],
    zIndex: [{ type: Input }],
    inBounds: [{ type: Input }],
    trackPosition: [{ type: Input }],
    scale: [{ type: Input }],
    preventDefaultEvent: [{ type: Input }],
    position: [{ type: Input }],
    movingOffset: [{ type: Output }],
    endOffset: [{ type: Output }],
    ngDraggable: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ResizeHandle {
    /**
     * @param {?} parent
     * @param {?} renderer
     * @param {?} type
     * @param {?} css
     * @param {?} onMouseDown
     */
    constructor(parent, renderer, type, css, onMouseDown) {
        this.parent = parent;
        this.renderer = renderer;
        this.type = type;
        this.css = css;
        this.onMouseDown = onMouseDown;
        // generate handle div
        let /** @type {?} */ handle = renderer.createElement('div');
        renderer.addClass(handle, 'ng-resizable-handle');
        renderer.addClass(handle, css);
        // add default diagonal for se handle
        if (type === 'se') {
            renderer.addClass(handle, 'ng-resizable-diagonal');
        }
        // append div to parent
        if (this.parent) {
            parent.appendChild(handle);
        }
        // create and register event listener
        this._onResize = (event) => { onMouseDown(event, this); };
        handle.addEventListener('mousedown', this._onResize);
        handle.addEventListener('touchstart', this._onResize);
        // done
        this._handle = handle;
    }
    /**
     * @return {?}
     */
    dispose() {
        this._handle.removeEventListener('mousedown', this._onResize);
        this._handle.removeEventListener('touchstart', this._onResize);
        if (this.parent) {
            this.parent.removeChild(this._handle);
        }
        this._handle = null;
        this._onResize = null;
    }
    /**
     * @return {?}
     */
    get el() {
        return this._handle;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class Size {
    /**
     * @param {?} width
     * @param {?} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static getCurrent(el) {
        let /** @type {?} */ size = new Size(0, 0);
        if (window) {
            const /** @type {?} */ computed = window.getComputedStyle(el);
            if (computed) {
                size.width = parseInt(computed.getPropertyValue('width'), 10);
                size.height = parseInt(computed.getPropertyValue('height'), 10);
            }
            return size;
        }
        else {
            console.error('Not Supported!');
            return null;
        }
    }
    /**
     * @param {?} s
     * @return {?}
     */
    static copy(s) {
        return new Size(0, 0).set(s);
    }
    /**
     * @param {?} s
     * @return {?}
     */
    set(s) {
        this.width = s.width;
        this.height = s.height;
        return this;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularResizableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     * @param {?} zone
     */
    constructor(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
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
        this._bindEvents();
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
        this._removeListener1();
        this._removeListener2();
        this._removeListener3();
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
    _bindEvents() {
        this.zone.runOutsideAngular(() => {
            this._removeListener1 = this.renderer.listen('document', 'mouseup', () => {
                // 1. skip right click;
                if (this._handleResizing) {
                    this.stopResize();
                    this._origMousePos = null;
                }
            });
            this._removeListener2 = this.renderer.listen('document', 'mouseleave', () => {
                // 1. skip right click;
                if (this._handleResizing) {
                    this.stopResize();
                    this._origMousePos = null;
                }
            });
            this._removeListener3 = this.renderer.listen('document', 'mousemove', (event) => {
                if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
                    this.resizeTo(Position.fromEvent(event));
                    this.onResizing();
                }
            });
        });
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
        this.zone.run(() => this.rzStart.emit(this.getResizingEvent()));
    }
    /**
     * @return {?}
     */
    stopResize() {
        // Remove the helper div:
        this._helperBlock.remove();
        this.zone.run(() => this.rzStop.emit(this.getResizingEvent()));
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
        this.zone.run(() => this.rzResizing.emit(this.getResizingEvent()));
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
    { type: Renderer2 },
    { type: NgZone }
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
    scale: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AngularDraggableModule {
}
AngularDraggableModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [
                    AngularDraggableDirective,
                    AngularResizableDirective
                ],
                exports: [
                    AngularDraggableDirective,
                    AngularResizableDirective
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { AngularDraggableDirective, AngularResizableDirective, AngularDraggableModule, Position };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItZHJhZ2dhYmxlLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9wb3NpdGlvbi50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi93aWRnZXRzL2hlbHBlci1ibG9jay50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5kaXJlY3RpdmUudHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9yZXNpemUtaGFuZGxlLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9zaXplLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHBvcy54ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIHBvcy55ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBQb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oMCwgMCkuc2V0KHApO1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggPSBwLng7XG4gICAgdGhpcy55ID0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEhlbHBlckJsb2NrIHtcbiAgcHJvdGVjdGVkIF9oZWxwZXI6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX2FkZGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoZWxwZXIgZGl2XG4gICAgbGV0IGhlbHBlciA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnYmFja2dyb3VuZC1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3RvcCcsICcwJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnbGVmdCcsICcwJyk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGVscGVyID0gaGVscGVyO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICF0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hlbHBlciA9IG51bGw7XG4gICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVscGVyO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIzOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBAT3V0cHV0KCkgc3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3RvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBNYWtlIHRoZSBoYW5kbGUgSFRNTEVsZW1lbnQgZHJhZ2dhYmxlICovXG4gIEBJbnB1dCgpIGhhbmRsZTogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFNldCB0aGUgYm91bmRzIEhUTUxFbGVtZW50ICovXG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIExpc3Qgb2YgYWxsb3dlZCBvdXQgb2YgYm91bmRzIGVkZ2VzICoqL1xuICBASW5wdXQoKSBvdXRPZkJvdW5kcyA9IHtcbiAgICB0b3A6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBib3R0b206IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFJvdW5kIHRoZSBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgKi9cbiAgQElucHV0KCkgZ3JpZFNpemUgPSAxO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHpJbmRleE1vdmluZzogc3RyaW5nO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIG5vdCBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSBzZXQgekluZGV4KHNldHRpbmc6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHNldHRpbmcpO1xuICAgIHRoaXMuX3pJbmRleCA9IHNldHRpbmc7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdG8gbGltaXQgdGhlIGVsZW1lbnQgc3RheSBpbiB0aGUgYm91bmRzICovXG4gIEBJbnB1dCgpIGluQm91bmRzID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIHVzZSBpdCdzIHByZXZpb3VzIGRyYWcgcG9zaXRpb24gb24gYSBuZXcgZHJhZyBldmVudC4gKi9cbiAgQElucHV0KCkgdHJhY2tQb3NpdGlvbiA9IHRydWU7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHByZXZlbnQgZGVmYXVsdCBldmVudCAqL1xuICBASW5wdXQoKSBwcmV2ZW50RGVmYXVsdEV2ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFNldCBpbml0aWFsIHBvc2l0aW9uIGJ5IG9mZnNldHMgKi9cbiAgQElucHV0KCkgcG9zaXRpb246IElQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBtb3ZpbmcgKi9cbiAgQE91dHB1dCgpIG1vdmluZ09mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBwdXQgYmFjayAqL1xuICBAT3V0cHV0KCkgZW5kT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG5nRHJhZ2dhYmxlKHNldHRpbmc6IGFueSkge1xuICAgIGlmIChzZXR0aW5nICE9PSB1bmRlZmluZWQgJiYgc2V0dGluZyAhPT0gbnVsbCAmJiBzZXR0aW5nICE9PSAnJykge1xuICAgICAgdGhpcy5hbGxvd0RyYWcgPSAhIXNldHRpbmc7XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5oYW5kbGUgPyB0aGlzLmhhbmRsZSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMubW92aW5nT2Zmc2V0LmVtaXQoe1xuICAgICAgICB4OiB0aGlzLnRlbXBUcmFucy54ICsgdGhpcy5vbGRUcmFucy54LFxuICAgICAgICB5OiB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG5cbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmVuZE9mZnNldC5lbWl0KHtcbiAgICAgICAgeDogdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueCxcbiAgICAgICAgeTogdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueVxuICAgICAgfSkpO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0hhbmRsZVRhcmdldCh0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaXMgdGhlIGVsZW1lbnQgY2xpY2tlZCwgdGhlbiBjaGVja3MgZWFjaCBjaGlsZCBlbGVtZW50IG9mIGVsZW1lbnQgYXMgd2VsbFxuICAgIC8vIElnbm9yZXMgYnV0dG9uIGNsaWNrc1xuXG4gICAgLy8gSWdub3JlIGVsZW1lbnRzIG9mIHR5cGUgYnV0dG9uXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IHdhcyBmb3VuZCwgcmV0dXJuIHRydWUgKGhhbmRsZSB3YXMgZm91bmQpXG4gICAgaWYgKGVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzaXZlbHkgaXRlcmF0ZSB0aGlzIGVsZW1lbnRzIGNoaWxkcmVuXG4gICAgZm9yIChsZXQgY2hpbGQgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgZWxlbWVudC5jaGlsZHJlbltjaGlsZF0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGxpbmVhZ2VcbiAgICAvLyBOb3RlOiByZXR1cm4gZmFsc2UgaXMgaWdub3JlIHVubGVzcyBpdCBpcyB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnBpY2tVcCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnB1dEJhY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICAgICAgdGhpcy5tb3ZlVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUhhbmRsZSB7XG4gIHByb3RlY3RlZCBfaGFuZGxlOiBFbGVtZW50O1xuICBwcml2YXRlIF9vblJlc2l6ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBFbGVtZW50LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNzczogc3RyaW5nLFxuICAgIHByaXZhdGUgb25Nb3VzZURvd246IGFueVxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoYW5kbGUgZGl2XG4gICAgbGV0IGhhbmRsZSA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgJ25nLXJlc2l6YWJsZS1oYW5kbGUnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsIGNzcyk7XG5cbiAgICAvLyBhZGQgZGVmYXVsdCBkaWFnb25hbCBmb3Igc2UgaGFuZGxlXG4gICAgaWYgKHR5cGUgPT09ICdzZScpIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgJ25nLXJlc2l6YWJsZS1kaWFnb25hbCcpO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYW5kIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAgdGhpcy5fb25SZXNpemUgPSAoZXZlbnQpID0+IHsgb25Nb3VzZURvd24oZXZlbnQsIHRoaXMpOyB9O1xuICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGFuZGxlID0gaGFuZGxlO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oYW5kbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oYW5kbGUpO1xuICAgIH1cbiAgICB0aGlzLl9oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuX29uUmVzaXplID0gbnVsbDtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xuICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIElTaXplIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaXplIGltcGxlbWVudHMgSVNpemUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgd2lkdGg6IG51bWJlciwgcHVibGljIGhlaWdodDogbnVtYmVyKSB7IH1cblxuICBzdGF0aWMgZ2V0Q3VycmVudChlbDogRWxlbWVudCkge1xuICAgIGxldCBzaXplID0gbmV3IFNpemUoMCwgMCk7XG5cbiAgICBpZiAod2luZG93KSB7XG4gICAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICBzaXplLndpZHRoID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSwgMTApO1xuICAgICAgICBzaXplLmhlaWdodCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpLCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm90IFN1cHBvcnRlZCEnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjb3B5KHM6IFNpemUpIHtcbiAgICByZXR1cm4gbmV3IFNpemUoMCwgMCkuc2V0KHMpO1xuICB9XG5cbiAgc2V0KHM6IElTaXplKSB7XG4gICAgdGhpcy53aWR0aCA9IHMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzLmhlaWdodDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsXG4gIElucHV0LCBPdXRwdXQsIE9uSW5pdCxcbiAgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsXG4gIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCwgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlIH0gZnJvbSAnLi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUnO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlVHlwZSB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1oYW5kbGUtdHlwZSc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgSVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlbHMvcG9zaXRpb24nO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4vbW9kZWxzL3NpemUnO1xuaW1wb3J0IHsgSVJlc2l6ZUV2ZW50IH0gZnJvbSAnLi9tb2RlbHMvcmVzaXplLWV2ZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nUmVzaXphYmxlXScsXG4gIGV4cG9ydEFzOiAnbmdSZXNpemFibGUnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBfcmVzaXphYmxlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfaGFuZGxlczogeyBba2V5OiBzdHJpbmddOiBSZXNpemVIYW5kbGUgfSA9IHt9O1xuICBwcml2YXRlIF9oYW5kbGVUeXBlOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9oYW5kbGVSZXNpemluZzogUmVzaXplSGFuZGxlID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uOiB7ICduJzogYm9vbGVhbiwgJ3MnOiBib29sZWFuLCAndyc6IGJvb2xlYW4sICdlJzogYm9vbGVhbiB9ID0gbnVsbDtcbiAgcHJpdmF0ZSBfYXNwZWN0UmF0aW8gPSAwO1xuICBwcml2YXRlIF9jb250YWlubWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xuICBwcml2YXRlIF9vcmlnTW91c2VQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogT3JpZ2luYWwgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfb3JpZ1NpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9vcmlnUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIEN1cnJlbnQgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfY3VyclNpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9jdXJyUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIEluaXRpYWwgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfaW5pdFNpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9pbml0UG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIFNuYXAgdG8gZ2lyZCAqL1xuICBwcml2YXRlIF9ncmlkU2l6ZTogSVBvc2l0aW9uID0gbnVsbDtcblxuICBwcml2YXRlIF9ib3VuZGluZzogYW55ID0gbnVsbDtcblxuICAvKipcbiAgICogQnVnZml4OiBpRnJhbWVzLCBhbmQgY29udGV4dCB1bnJlbGF0ZWQgZWxlbWVudHMgYmxvY2sgYWxsIGV2ZW50cywgYW5kIGFyZSB1bnVzYWJsZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzg0XG4gICAqL1xuICBwcml2YXRlIF9oZWxwZXJCbG9jazogSGVscGVyQmxvY2sgPSBudWxsO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIzOiAoKSA9PiB2b2lkO1xuXG4gIC8qKiBEaXNhYmxlcyB0aGUgcmVzaXphYmxlIGlmIHNldCB0byBmYWxzZS4gKi9cbiAgQElucHV0KCkgc2V0IG5nUmVzaXphYmxlKHY6IGFueSkge1xuICAgIGlmICh2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gbnVsbCAmJiB2ICE9PSAnJykge1xuICAgICAgdGhpcy5fcmVzaXphYmxlID0gISF2O1xuICAgICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hpY2ggaGFuZGxlcyBjYW4gYmUgdXNlZCBmb3IgcmVzaXppbmcuXG4gICAqIEBleGFtcGxlXG4gICAqIFtyekhhbmRsZXNdID0gXCInbixlLHMsdyxzZSxuZSxzdyxudydcIlxuICAgKiBlcXVhbHMgdG86IFtyekhhbmRsZXNdID0gXCInYWxsJ1wiXG4gICAqXG4gICAqICovXG4gIEBJbnB1dCgpIHJ6SGFuZGxlczogUmVzaXplSGFuZGxlVHlwZSA9ICdlLHMsc2UnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBiZSBjb25zdHJhaW5lZCB0byBhIHNwZWNpZmljIGFzcGVjdCByYXRpby5cbiAgICogIE11bHRpcGxlIHR5cGVzIHN1cHBvcnRlZDpcbiAgICogIGJvb2xlYW46IFdoZW4gc2V0IHRvIHRydWUsIHRoZSBlbGVtZW50IHdpbGwgbWFpbnRhaW4gaXRzIG9yaWdpbmFsIGFzcGVjdCByYXRpby5cbiAgICogIG51bWJlcjogRm9yY2UgdGhlIGVsZW1lbnQgdG8gbWFpbnRhaW4gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8gZHVyaW5nIHJlc2l6aW5nLlxuICAgKi9cbiAgQElucHV0KCkgcnpBc3BlY3RSYXRpbzogYm9vbGVhbiB8IG51bWJlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDb25zdHJhaW5zIHJlc2l6aW5nIHRvIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBvciByZWdpb24uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBTZWxlY3RvcjogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZpcnN0IGVsZW1lbnQgZm91bmQgYnkgdGhlIHNlbGVjdG9yLlxuICAgKiAgICAgICAgICAgIElmIG5vIGVsZW1lbnQgaXMgZm91bmQsIG5vIGNvbnRhaW5tZW50IHdpbGwgYmUgc2V0LlxuICAgKiAgRWxlbWVudDogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhpcyBlbGVtZW50LlxuICAgKiAgU3RyaW5nOiBQb3NzaWJsZSB2YWx1ZXM6IFwicGFyZW50XCIuXG4gICAqL1xuICBASW5wdXQoKSByekNvbnRhaW5tZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFNuYXBzIHRoZSByZXNpemluZyBlbGVtZW50IHRvIGEgZ3JpZCwgZXZlcnkgeCBhbmQgeSBwaXhlbHMuXG4gICAqIEEgbnVtYmVyIGZvciBib3RoIHdpZHRoIGFuZCBoZWlnaHQgb3IgYW4gYXJyYXkgdmFsdWVzIGxpa2UgWyB4LCB5IF1cbiAgICovXG4gIEBJbnB1dCgpIHJ6R3JpZDogbnVtYmVyIHwgbnVtYmVyW10gPSBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSB3aWR0aCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5XaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gaGVpZ2h0IHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1pbkhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4V2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNYXhIZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdGFydCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6UmVzaXppbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0b3AgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RvcCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBJbnB1dCBjc3Mgc2NhbGUgdHJhbnNmb3JtIG9mIGVsZW1lbnQgc28gdHJhbnNsYXRpb25zIGFyZSBjb3JyZWN0ICovXG4gIEBJbnB1dCgpIHNjYWxlID0gMTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncnpIYW5kbGVzJ10gJiYgIWNoYW5nZXNbJ3J6SGFuZGxlcyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sncnpBc3BlY3RSYXRpbyddICYmICFjaGFuZ2VzWydyekFzcGVjdFJhdGlvJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFzcGVjdFJhdGlvKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3J6Q29udGFpbm1lbnQnXSAmJiAhY2hhbmdlc1sncnpDb250YWlubWVudCddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVDb250YWlubWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG4gICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX2luaXRTaXplID0gU2l6ZS5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5faW5pdFBvcyA9IFBvc2l0aW9uLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9pbml0U2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5faW5pdFBvcyk7XG4gICAgdGhpcy51cGRhdGVBc3BlY3RSYXRpbygpO1xuICAgIHRoaXMudXBkYXRlQ29udGFpbm1lbnQoKTtcbiAgfVxuXG4gIC8qKiBBIG1ldGhvZCB0byByZXNldCBzaXplICovXG4gIHB1YmxpYyByZXNldFNpemUoKSB7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMuZG9SZXNpemUoKTtcbiAgfVxuXG4gIC8qKiBBIG1ldGhvZCB0byBnZXQgY3VycmVudCBzdGF0dXMgKi9cbiAgcHVibGljIGdldFN0YXR1cygpIHtcbiAgICBpZiAoIXRoaXMuX2N1cnJQb3MgfHwgIXRoaXMuX2N1cnJTaXplKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2l6ZToge1xuICAgICAgICB3aWR0aDogdGhpcy5fY3VyclNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5fY3VyclNpemUuaGVpZ2h0XG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgdG9wOiB0aGlzLl9jdXJyUG9zLnksXG4gICAgICAgIGxlZnQ6IHRoaXMuX2N1cnJQb3MueFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVJlc2l6YWJsZSgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gY2xlYXIgaGFuZGxlczpcbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1yZXNpemFibGUnKTtcbiAgICB0aGlzLnJlbW92ZUhhbmRsZXMoKTtcblxuICAgIC8vIGNyZWF0ZSBuZXcgb25lczpcbiAgICBpZiAodGhpcy5fcmVzaXphYmxlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1yZXNpemFibGUnKTtcbiAgICAgIHRoaXMuY3JlYXRlSGFuZGxlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gdXBkYXRlIGFzcGVjdCAqL1xuICBwcml2YXRlIHVwZGF0ZUFzcGVjdFJhdGlvKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekFzcGVjdFJhdGlvID09PSAnYm9vbGVhbicpIHtcbiAgICAgIGlmICh0aGlzLnJ6QXNwZWN0UmF0aW8gJiYgdGhpcy5fY3VyclNpemUuaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gKHRoaXMuX2N1cnJTaXplLndpZHRoIC8gdGhpcy5fY3VyclNpemUuaGVpZ2h0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHIgPSBOdW1iZXIodGhpcy5yekFzcGVjdFJhdGlvKTtcbiAgICAgIHRoaXMuX2FzcGVjdFJhdGlvID0gaXNOYU4ocikgPyAwIDogcjtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBjb250YWlubWVudCAqL1xuICBwcml2YXRlIHVwZGF0ZUNvbnRhaW5tZW50KCkge1xuICAgIGlmICghdGhpcy5yekNvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLl9jb250YWlubWVudCA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6Q29udGFpbm1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekNvbnRhaW5tZW50ID09PSAncGFyZW50Jykge1xuICAgICAgICB0aGlzLl9jb250YWlubWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50Pih0aGlzLnJ6Q29udGFpbm1lbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb250YWlubWVudCA9IHRoaXMucnpDb250YWlubWVudDtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBoYW5kbGUgZGl2cyAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZXMoKSB7XG4gICAgaWYgKCF0aGlzLnJ6SGFuZGxlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0bXBIYW5kbGVUeXBlczogc3RyaW5nW107XG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6SGFuZGxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICh0aGlzLnJ6SGFuZGxlcyA9PT0gJ2FsbCcpIHtcbiAgICAgICAgdG1wSGFuZGxlVHlwZXMgPSBbJ24nLCAnZScsICdzJywgJ3cnLCAnbmUnLCAnc2UnLCAnbncnLCAnc3cnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gdGhpcy5yekhhbmRsZXMucmVwbGFjZSgvIC9nLCAnJykudG9Mb3dlckNhc2UoKS5zcGxpdCgnLCcpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCB0eXBlIG9mIHRtcEhhbmRsZVR5cGVzKSB7XG4gICAgICAgIC8vIGRlZmF1bHQgaGFuZGxlIHRoZW1lOiBuZy1yZXNpemFibGUtJHR5cGUuXG4gICAgICAgIGxldCBoYW5kbGUgPSB0aGlzLmNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlLCBgbmctcmVzaXphYmxlLSR7dHlwZX1gKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcEhhbmRsZVR5cGVzID0gT2JqZWN0LmtleXModGhpcy5yekhhbmRsZXMpO1xuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBjdXN0b20gaGFuZGxlIHRoZW1lLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgdGhpcy5yekhhbmRsZXNbdHlwZV0pO1xuICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlVHlwZS5wdXNoKHR5cGUpO1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0gPSBoYW5kbGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gY3JlYXRlIGEgaGFuZGxlICovXG4gIHByaXZhdGUgY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGU6IHN0cmluZywgY3NzOiBzdHJpbmcpOiBSZXNpemVIYW5kbGUge1xuICAgIGNvbnN0IF9lbCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICghdHlwZS5tYXRjaCgvXihzZXxzd3xuZXxud3xufGV8c3x3KSQvKSkge1xuICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBoYW5kbGUgdHlwZTonLCB0eXBlKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzaXplSGFuZGxlKF9lbCwgdGhpcy5yZW5kZXJlciwgdHlwZSwgY3NzLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVIYW5kbGVzKCkge1xuICAgIGZvciAobGV0IHR5cGUgb2YgdGhpcy5faGFuZGxlVHlwZSkge1xuICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlVHlwZSA9IFtdO1xuICAgIHRoaXMuX2hhbmRsZXMgPSB7fTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgaGFuZGxlOiBSZXNpemVIYW5kbGUpIHtcbiAgICAvLyBza2lwIHJpZ2h0IGNsaWNrO1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IGV2ZW50c1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoIXRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5zdGFydFJlc2l6ZShoYW5kbGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAvLyAxLiBza2lwIHJpZ2h0IGNsaWNrO1xuICAgICAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcpIHtcbiAgICAgICAgICB0aGlzLnN0b3BSZXNpemUoKTtcbiAgICAgICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMiA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAvLyAxLiBza2lwIHJpZ2h0IGNsaWNrO1xuICAgICAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcpIHtcbiAgICAgICAgICB0aGlzLnN0b3BSZXNpemUoKTtcbiAgICAgICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGVSZXNpemluZyAmJiB0aGlzLl9yZXNpemFibGUgJiYgdGhpcy5fb3JpZ01vdXNlUG9zICYmIHRoaXMuX29yaWdQb3MgJiYgdGhpcy5fb3JpZ1NpemUpIHtcbiAgICAgICAgICB0aGlzLnJlc2l6ZVRvKFBvc2l0aW9uLmZyb21FdmVudChldmVudCkpO1xuICAgICAgICAgIHRoaXMub25SZXNpemluZygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRSZXNpemUoaGFuZGxlOiBSZXNpemVIYW5kbGUpIHtcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fb3JpZ1NpemUgPSBTaXplLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9vcmlnUG9zID0gUG9zaXRpb24uZ2V0Q3VycmVudChlbG0pOyAvLyB4OiBsZWZ0LCB5OiB0b3BcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9vcmlnU2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5fb3JpZ1Bvcyk7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLmdldEJvdW5kaW5nKCk7XG4gICAgfVxuICAgIHRoaXMuZ2V0R3JpZFNpemUoKTtcblxuICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXppbmcgPSBoYW5kbGU7XG4gICAgdGhpcy51cGRhdGVEaXJlY3Rpb24oKTtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMucnpTdGFydC5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKSk7XG4gIH1cblxuICBwcml2YXRlIHN0b3BSZXNpemUoKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLnJlbW92ZSgpO1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5yelN0b3AuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSkpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gbnVsbDtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX29yaWdTaXplID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnUG9zID0gbnVsbDtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMucmVzZXRCb3VuZGluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25SZXNpemluZygpIHtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMucnpSZXNpemluZy5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlc2l6aW5nRXZlbnQoKTogSVJlc2l6ZUV2ZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgaG9zdDogdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgaGFuZGxlOiB0aGlzLl9oYW5kbGVSZXNpemluZyA/IHRoaXMuX2hhbmRsZVJlc2l6aW5nLmVsIDogbnVsbCxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEaXJlY3Rpb24oKSB7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0ge1xuICAgICAgbjogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9uLyksXG4gICAgICBzOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL3MvKSxcbiAgICAgIHc6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvdy8pLFxuICAgICAgZTogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9lLylcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZXNpemVUbyhwOiBQb3NpdGlvbikge1xuICAgIHAuc3VidHJhY3QodGhpcy5fb3JpZ01vdXNlUG9zKTtcblxuICAgIGNvbnN0IHRtcFggPSBNYXRoLnJvdW5kKHAueCAvIHRoaXMuX2dyaWRTaXplLnggLyB0aGlzLnNjYWxlKSAqIHRoaXMuX2dyaWRTaXplLng7XG4gICAgY29uc3QgdG1wWSA9IE1hdGgucm91bmQocC55IC8gdGhpcy5fZ3JpZFNpemUueSAvIHRoaXMuc2NhbGUpICogdGhpcy5fZ3JpZFNpemUueTtcblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgLy8gbiwgbmUsIG53XG4gICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyB0bXBZO1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdG1wWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi5zKSB7XG4gICAgICAvLyBzLCBzZSwgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCArIHRtcFk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5lKSB7XG4gICAgICAvLyBlLCBuZSwgc2VcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggKyB0bXBYO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgIC8vIHcsIG53LCBzd1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIHRtcFg7XG4gICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyB0bXBYO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICB0aGlzLmNoZWNrU2l6ZSgpO1xuICAgIHRoaXMuYWRqdXN0QnlSYXRpbygpO1xuICAgIHRoaXMuZG9SZXNpemUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9SZXNpemUoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnaGVpZ2h0JywgdGhpcy5fY3VyclNpemUuaGVpZ2h0ICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd3aWR0aCcsIHRoaXMuX2N1cnJTaXplLndpZHRoICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdsZWZ0JywgdGhpcy5fY3VyclBvcy54ICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCB0aGlzLl9jdXJyUG9zLnkgKyAncHgnKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRqdXN0QnlSYXRpbygpIHtcbiAgICBpZiAodGhpcy5fYXNwZWN0UmF0aW8pIHtcbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSB8fCB0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMuX2N1cnJTaXplLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQm91bmRzKCkge1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9ib3VuZGluZy53aWR0aCAtIHRoaXMuX2JvdW5kaW5nLnByIC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQgLSB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5fYm91bmRpbmcuaGVpZ2h0IC0gdGhpcy5fYm91bmRpbmcucGIgLSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uICYmICh0aGlzLl9jdXJyUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZKSA8IDApIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gLXRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCArIHRoaXMuX29yaWdQb3MueSArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udyAmJiAodGhpcy5fY3VyclBvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdGhpcy5fb3JpZ1Bvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLndpZHRoID4gbWF4V2lkdGgpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBtYXhXaWR0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja1NpemUoKSB7XG4gICAgY29uc3QgbWluSGVpZ2h0ID0gIXRoaXMucnpNaW5IZWlnaHQgPyAxIDogdGhpcy5yek1pbkhlaWdodDtcbiAgICBjb25zdCBtaW5XaWR0aCA9ICF0aGlzLnJ6TWluV2lkdGggPyAxIDogdGhpcy5yek1pbldpZHRoO1xuXG4gICAgaWYgKHRoaXMuX2N1cnJTaXplLmhlaWdodCA8IG1pbkhlaWdodCkge1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbWluSGVpZ2h0O1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgKHRoaXMuX29yaWdTaXplLmhlaWdodCAtIG1pbkhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2N1cnJTaXplLndpZHRoIDwgbWluV2lkdGgpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWluV2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSBtaW5XaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhIZWlnaHQgJiYgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID4gdGhpcy5yek1heEhlaWdodCkge1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5yek1heEhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSB0aGlzLnJ6TWF4SGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yek1heFdpZHRoICYmIHRoaXMuX2N1cnJTaXplLndpZHRoID4gdGhpcy5yek1heFdpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMucnpNYXhXaWR0aDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArICh0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIHRoaXMucnpNYXhXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRCb3VuZGluZygpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX2NvbnRhaW5tZW50O1xuICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgbGV0IHAgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpO1xuXG4gICAgICBjb25zdCBuYXRpdmVFbCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICBsZXQgdHJhbnNmb3JtcyA9IG5hdGl2ZUVsLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpLnJlcGxhY2UoL1teLVxcZCxdL2csICcnKS5zcGxpdCgnLCcpO1xuXG4gICAgICB0aGlzLl9ib3VuZGluZyA9IHt9O1xuICAgICAgdGhpcy5fYm91bmRpbmcud2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLmhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLnByID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpLCAxMCk7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wYiA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcblxuICAgICAgaWYgKHRyYW5zZm9ybXMubGVuZ3RoID49IDYpIHtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCA9IHBhcnNlSW50KHRyYW5zZm9ybXNbNF0sIDEwKTtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IHBhcnNlSW50KHRyYW5zZm9ybXNbNV0sIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSAwO1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpO1xuXG4gICAgICBpZiAocCA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShlbCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldEJvdW5kaW5nKCkge1xuICAgIGlmICh0aGlzLl9ib3VuZGluZyAmJiB0aGlzLl9ib3VuZGluZy5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fY29udGFpbm1lbnQsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgIH1cbiAgICB0aGlzLl9ib3VuZGluZyA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldEdyaWRTaXplKCkge1xuICAgIC8vIHNldCBkZWZhdWx0IHZhbHVlOlxuICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiAxLCB5OiAxIH07XG5cbiAgICBpZiAodGhpcy5yekdyaWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5yekdyaWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZCwgeTogdGhpcy5yekdyaWQgfTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnJ6R3JpZCkpIHtcbiAgICAgICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IHRoaXMucnpHcmlkWzBdLCB5OiB0aGlzLnJ6R3JpZFsxXSB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9hbmd1bGFyLXJlc2l6YWJsZS5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUsXG4gICAgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSxcbiAgICBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQU1FLFlBQW1CLENBQVMsRUFBUyxDQUFTO1FBQTNCLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO0tBQUs7Ozs7O0lBRW5ELE9BQU8sU0FBUyxDQUFDLENBQTBCO1FBQ3pDLElBQUksQ0FBQyxZQUFZLFVBQVUsRUFBRTtZQUMzQixPQUFPLElB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SSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoRix1QkFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUVoRixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFOztZQUVyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3REO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTs7WUFFNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3REO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTs7WUFFckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQ3BEO2FBQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTs7WUFFNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElB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