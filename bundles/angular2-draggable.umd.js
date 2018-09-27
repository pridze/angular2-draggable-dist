(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('angular2-draggable', ['exports', '@angular/core'], factory) :
    (factory((global['angular2-draggable'] = {}),global.ng.core));
}(this, (function (exports,core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Position = (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * @param {?} e
         * @return {?}
         */
        Position.fromEvent = /**
         * @param {?} e
         * @return {?}
         */
            function (e) {
                if (e instanceof MouseEvent) {
                    return new Position(e.clientX, e.clientY);
                }
                else {
                    return new Position(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }
            };
        /**
         * @param {?} obj
         * @return {?}
         */
        Position.isIPosition = /**
         * @param {?} obj
         * @return {?}
         */
            function (obj) {
                return !!obj && ('x' in obj) && ('y' in obj);
            };
        /**
         * @param {?} el
         * @return {?}
         */
        Position.getCurrent = /**
         * @param {?} el
         * @return {?}
         */
            function (el) {
                var /** @type {?} */ pos = new Position(0, 0);
                if (window) {
                    var /** @type {?} */ computed = window.getComputedStyle(el);
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
            };
        /**
         * @param {?} p
         * @return {?}
         */
        Position.copy = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                return new Position(0, 0).set(p);
            };
        /**
         * @param {?} p
         * @return {?}
         */
        Position.prototype.add = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                this.x += p.x;
                this.y += p.y;
                return this;
            };
        /**
         * @param {?} p
         * @return {?}
         */
        Position.prototype.subtract = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                this.x -= p.x;
                this.y -= p.y;
                return this;
            };
        /**
         * @return {?}
         */
        Position.prototype.reset = /**
         * @return {?}
         */
            function () {
                this.x = 0;
                this.y = 0;
                return this;
            };
        /**
         * @param {?} p
         * @return {?}
         */
        Position.prototype.set = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                this.x = p.x;
                this.y = p.y;
                return this;
            };
        return Position;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var HelperBlock = (function () {
        function HelperBlock(parent, renderer) {
            this.parent = parent;
            this.renderer = renderer;
            this._added = false;
            // generate helper div
            var /** @type {?} */ helper = renderer.createElement('div');
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
        HelperBlock.prototype.add = /**
         * @return {?}
         */
            function () {
                // append div to parent
                if (this.parent && !this._added) {
                    this.parent.appendChild(this._helper);
                    this._added = true;
                }
            };
        /**
         * @return {?}
         */
        HelperBlock.prototype.remove = /**
         * @return {?}
         */
            function () {
                if (this.parent && this._added) {
                    this.parent.removeChild(this._helper);
                    this._added = false;
                }
            };
        /**
         * @return {?}
         */
        HelperBlock.prototype.dispose = /**
         * @return {?}
         */
            function () {
                this._helper = null;
                this._added = false;
            };
        Object.defineProperty(HelperBlock.prototype, "el", {
            get: /**
             * @return {?}
             */ function () {
                return this._helper;
            },
            enumerable: true,
            configurable: true
        });
        return HelperBlock;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var AngularDraggableDirective = (function () {
        function AngularDraggableDirective(el, renderer) {
            this.el = el;
            this.renderer = renderer;
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
            this.started = new core.EventEmitter();
            this.stopped = new core.EventEmitter();
            this.edge = new core.EventEmitter();
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
            this.movingOffset = new core.EventEmitter();
            /**
             * Emit position offsets when put back
             */
            this.endOffset = new core.EventEmitter();
            this._helperBlock = new HelperBlock(el.nativeElement, renderer);
        }
        Object.defineProperty(AngularDraggableDirective.prototype, "zIndex", {
            /** Set z-index when not dragging */
            set: /**
             * Set z-index when not dragging
             * @param {?} setting
             * @return {?}
             */ function (setting) {
                this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
                this._zIndex = setting;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularDraggableDirective.prototype, "ngDraggable", {
            set: /**
             * @param {?} setting
             * @return {?}
             */ function (setting) {
                if (setting !== undefined && setting !== null && setting !== '') {
                    this.allowDrag = !!setting;
                    var /** @type {?} */ element = this.handle ? this.handle : this.el.nativeElement;
                    if (this.allowDrag) {
                        this.renderer.addClass(element, 'ng-draggable');
                    }
                    else {
                        this.renderer.removeClass(element, 'ng-draggable');
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                if (this.allowDrag) {
                    var /** @type {?} */ element = this.handle ? this.handle : this.el.nativeElement;
                    this.renderer.addClass(element, 'ng-draggable');
                }
                this.resetPosition();
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.bounds = null;
                this.handle = null;
                this.orignal = null;
                this.oldTrans = null;
                this.tempTrans = null;
                this._helperBlock.dispose();
                this._helperBlock = null;
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes['position'] && !changes['position'].isFirstChange()) {
                    var /** @type {?} */ p = changes['position'].currentValue;
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
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                if (this.inBounds) {
                    this.boundsCheck();
                    this.oldTrans.add(this.tempTrans);
                    this.tempTrans.reset();
                }
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.resetPosition = /**
         * @return {?}
         */
            function () {
                if (Position.isIPosition(this.position)) {
                    this.oldTrans.set(this.position);
                }
                else {
                    this.oldTrans.reset();
                }
                this.tempTrans.reset();
                this.transform();
            };
        /**
         * @param {?} p
         * @return {?}
         */
        AngularDraggableDirective.prototype.moveTo = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                if (this.orignal) {
                    p.subtract(this.orignal);
                    this.tempTrans.set({ x: p.x / this.scale, y: p.y / this.scale });
                    this.transform();
                    if (this.bounds) {
                        this.edge.emit(this.boundsCheck());
                    }
                    this.movingOffset.emit({
                        x: this.tempTrans.x + this.oldTrans.x,
                        y: this.tempTrans.y + this.oldTrans.y
                    });
                }
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.transform = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ translateX = this.tempTrans.x + this.oldTrans.x;
                var /** @type {?} */ translateY = this.tempTrans.y + this.oldTrans.y;
                // Snap to grid: by grid size
                if (this.gridSize > 1) {
                    translateX = Math.round(translateX / this.gridSize) * this.gridSize;
                    translateY = Math.round(translateY / this.gridSize) * this.gridSize;
                }
                var /** @type {?} */ value = "translate(" + translateX + "px, " + translateY + "px)";
                this.renderer.setStyle(this.el.nativeElement, 'transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.pickUp = /**
         * @return {?}
         */
            function () {
                // get old z-index:
                this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
                if (window) {
                    this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('z-index');
                }
                if (this.zIndexMoving) {
                    this.renderer.setStyle(this.el.nativeElement, 'z-index', this.zIndexMoving);
                }
                if (!this.moving) {
                    this.started.emit(this.el.nativeElement);
                    this.moving = true;
                }
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.boundsCheck = /**
         * @return {?}
         */
            function () {
                if (this.bounds) {
                    var /** @type {?} */ boundary = this.bounds.getBoundingClientRect();
                    var /** @type {?} */ elem = this.el.nativeElement.getBoundingClientRect();
                    var /** @type {?} */ result = {
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
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.putBack = /**
         * @return {?}
         */
            function () {
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
                    this.stopped.emit(this.el.nativeElement);
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
                        this.edge.emit(this.boundsCheck());
                    }
                    this.moving = false;
                    this.endOffset.emit({
                        x: this.tempTrans.x + this.oldTrans.x,
                        y: this.tempTrans.y + this.oldTrans.y
                    });
                    if (this.trackPosition) {
                        this.oldTrans.add(this.tempTrans);
                    }
                    this.tempTrans.reset();
                    if (!this.trackPosition) {
                        this.transform();
                    }
                }
            };
        /**
         * @param {?} target
         * @param {?} element
         * @return {?}
         */
        AngularDraggableDirective.prototype.checkHandleTarget = /**
         * @param {?} target
         * @param {?} element
         * @return {?}
         */
            function (target, element) {
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
                for (var /** @type {?} */ child in element.children) {
                    if (element.children.hasOwnProperty(child)) {
                        if (this.checkHandleTarget(target, element.children[child])) {
                            return true;
                        }
                    }
                }
                // Handle was not found in this lineage
                // Note: return false is ignore unless it is the parent element
                return false;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularDraggableDirective.prototype.onMouseDown = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                // 1. skip right click;
                if (event instanceof MouseEvent && event.button === 2) {
                    return;
                }
                // 2. if handle is set, the element can only be moved by handle
                var /** @type {?} */ target = event.target || event.srcElement;
                if (this.handle !== undefined && !this.checkHandleTarget(target, this.handle)) {
                    return;
                }
                if (this.preventDefaultEvent) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                this.orignal = Position.fromEvent(event);
                this.pickUp();
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.onMouseLeave = /**
         * @return {?}
         */
            function () {
                this.putBack();
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularDraggableDirective.prototype.onMouseMove = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.moving && this.allowDrag) {
                    if (this.preventDefaultEvent) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    // Add a transparent helper div:
                    this._helperBlock.add();
                    this.moveTo(Position.fromEvent(event));
                }
            };
        AngularDraggableDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngDraggable]',
                        exportAs: 'ngDraggable'
                    },] },
        ];
        /** @nocollapse */
        AngularDraggableDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 }
            ];
        };
        AngularDraggableDirective.propDecorators = {
            started: [{ type: core.Output }],
            stopped: [{ type: core.Output }],
            edge: [{ type: core.Output }],
            handle: [{ type: core.Input }],
            bounds: [{ type: core.Input }],
            outOfBounds: [{ type: core.Input }],
            gridSize: [{ type: core.Input }],
            zIndexMoving: [{ type: core.Input }],
            zIndex: [{ type: core.Input }],
            inBounds: [{ type: core.Input }],
            trackPosition: [{ type: core.Input }],
            scale: [{ type: core.Input }],
            preventDefaultEvent: [{ type: core.Input }],
            position: [{ type: core.Input }],
            movingOffset: [{ type: core.Output }],
            endOffset: [{ type: core.Output }],
            ngDraggable: [{ type: core.Input }],
            onMouseDown: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }, { type: core.HostListener, args: ['touchstart', ['$event'],] }],
            onMouseLeave: [{ type: core.HostListener, args: ['document:mouseup',] }, { type: core.HostListener, args: ['document:mouseleave',] }, { type: core.HostListener, args: ['document:touchend',] }, { type: core.HostListener, args: ['document:touchcancel',] }],
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }, { type: core.HostListener, args: ['document:touchmove', ['$event'],] }]
        };
        return AngularDraggableDirective;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ResizeHandle = (function () {
        function ResizeHandle(parent, renderer, type, css, onMouseDown) {
            var _this = this;
            this.parent = parent;
            this.renderer = renderer;
            this.type = type;
            this.css = css;
            this.onMouseDown = onMouseDown;
            // generate handle div
            var /** @type {?} */ handle = renderer.createElement('div');
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
            this._onResize = function (event) { onMouseDown(event, _this); };
            handle.addEventListener('mousedown', this._onResize);
            handle.addEventListener('touchstart', this._onResize);
            // done
            this._handle = handle;
        }
        /**
         * @return {?}
         */
        ResizeHandle.prototype.dispose = /**
         * @return {?}
         */
            function () {
                this._handle.removeEventListener('mousedown', this._onResize);
                this._handle.removeEventListener('touchstart', this._onResize);
                if (this.parent) {
                    this.parent.removeChild(this._handle);
                }
                this._handle = null;
                this._onResize = null;
            };
        Object.defineProperty(ResizeHandle.prototype, "el", {
            get: /**
             * @return {?}
             */ function () {
                return this._handle;
            },
            enumerable: true,
            configurable: true
        });
        return ResizeHandle;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        /**
         * @param {?} el
         * @return {?}
         */
        Size.getCurrent = /**
         * @param {?} el
         * @return {?}
         */
            function (el) {
                var /** @type {?} */ size = new Size(0, 0);
                if (window) {
                    var /** @type {?} */ computed = window.getComputedStyle(el);
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
            };
        /**
         * @param {?} s
         * @return {?}
         */
        Size.copy = /**
         * @param {?} s
         * @return {?}
         */
            function (s) {
                return new Size(0, 0).set(s);
            };
        /**
         * @param {?} s
         * @return {?}
         */
        Size.prototype.set = /**
         * @param {?} s
         * @return {?}
         */
            function (s) {
                this.width = s.width;
                this.height = s.height;
                return this;
            };
        return Size;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var AngularResizableDirective = (function () {
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
            this.rzStart = new core.EventEmitter();
            /**
             * emitted when start resizing
             */
            this.rzResizing = new core.EventEmitter();
            /**
             * emitted when stop resizing
             */
            this.rzStop = new core.EventEmitter();
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
             */ function (v) {
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
                        for (var tmpHandleTypes_1 = __values(tmpHandleTypes), tmpHandleTypes_1_1 = tmpHandleTypes_1.next(); !tmpHandleTypes_1_1.done; tmpHandleTypes_1_1 = tmpHandleTypes_1.next()) {
                            var type = tmpHandleTypes_1_1.value;
                            // default handle theme: ng-resizable-$type.
                            var /** @type {?} */ handle = this.createHandleByType(type, "ng-resizable-" + type);
                            if (handle) {
                                this._handleType.push(type);
                                this._handles[type] = handle;
                            }
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (tmpHandleTypes_1_1 && !tmpHandleTypes_1_1.done && (_a = tmpHandleTypes_1.return))
                                _a.call(tmpHandleTypes_1);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                }
                else {
                    tmpHandleTypes = Object.keys(this.rzHandles);
                    try {
                        for (var tmpHandleTypes_2 = __values(tmpHandleTypes), tmpHandleTypes_2_1 = tmpHandleTypes_2.next(); !tmpHandleTypes_2_1.done; tmpHandleTypes_2_1 = tmpHandleTypes_2.next()) {
                            var type = tmpHandleTypes_2_1.value;
                            // custom handle theme.
                            var /** @type {?} */ handle = this.createHandleByType(type, this.rzHandles[type]);
                            if (handle) {
                                this._handleType.push(type);
                                this._handles[type] = handle;
                            }
                        }
                    }
                    catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    }
                    finally {
                        try {
                            if (tmpHandleTypes_2_1 && !tmpHandleTypes_2_1.done && (_b = tmpHandleTypes_2.return))
                                _b.call(tmpHandleTypes_2);
                        }
                        finally {
                            if (e_2)
                                throw e_2.error;
                        }
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
                    for (var _a = __values(this._handleType), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var type = _b.value;
                        this._handles[type].dispose();
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return))
                            _c.call(_a);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
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
            { type: core.Directive, args: [{
                        selector: '[ngResizable]',
                        exportAs: 'ngResizable'
                    },] },
        ];
        /** @nocollapse */
        AngularResizableDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 }
            ];
        };
        AngularResizableDirective.propDecorators = {
            ngResizable: [{ type: core.Input }],
            rzHandles: [{ type: core.Input }],
            rzAspectRatio: [{ type: core.Input }],
            rzContainment: [{ type: core.Input }],
            rzGrid: [{ type: core.Input }],
            rzMinWidth: [{ type: core.Input }],
            rzMinHeight: [{ type: core.Input }],
            rzMaxWidth: [{ type: core.Input }],
            rzMaxHeight: [{ type: core.Input }],
            rzStart: [{ type: core.Output }],
            rzResizing: [{ type: core.Output }],
            rzStop: [{ type: core.Output }],
            scale: [{ type: core.Input }],
            onMouseLeave: [{ type: core.HostListener, args: ['document:mouseup',] }, { type: core.HostListener, args: ['document:mouseleave',] }, { type: core.HostListener, args: ['document:touchend',] }, { type: core.HostListener, args: ['document:touchcancel',] }],
            onMouseMove: [{ type: core.HostListener, args: ['document:mousemove', ['$event'],] }, { type: core.HostListener, args: ['document:touchmove', ['$event'],] }]
        };
        return AngularResizableDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var AngularDraggableModule = (function () {
        function AngularDraggableModule() {
        }
        AngularDraggableModule.decorators = [
            { type: core.NgModule, args: [{
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
        return AngularDraggableModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.AngularDraggableDirective = AngularDraggableDirective;
    exports.AngularResizableDirective = AngularResizableDirective;
    exports.AngularDraggableModule = AngularDraggableModule;
    exports.Position = Position;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItZHJhZ2dhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9tb2RlbHMvcG9zaXRpb24udHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9oZWxwZXItYmxvY2sudHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIixudWxsLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9yZXNpemUtaGFuZGxlLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9zaXplLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHBvcy54ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIHBvcy55ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBQb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oMCwgMCkuc2V0KHApO1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggPSBwLng7XG4gICAgdGhpcy55ID0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEhlbHBlckJsb2NrIHtcbiAgcHJvdGVjdGVkIF9oZWxwZXI6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX2FkZGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoZWxwZXIgZGl2XG4gICAgbGV0IGhlbHBlciA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnYmFja2dyb3VuZC1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3RvcCcsICcwJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnbGVmdCcsICcwJyk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGVscGVyID0gaGVscGVyO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICF0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hlbHBlciA9IG51bGw7XG4gICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVscGVyO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBIb3N0TGlzdGVuZXIsXG4gIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBCdWdmaXg6IGlGcmFtZXMsIGFuZCBjb250ZXh0IHVucmVsYXRlZCBlbGVtZW50cyBibG9jayBhbGwgZXZlbnRzLCBhbmQgYXJlIHVudXNhYmxlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvODRcbiAgICovXG4gIHByaXZhdGUgX2hlbHBlckJsb2NrOiBIZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgQE91dHB1dCgpIHN0YXJ0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHN0b3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGVkZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogTWFrZSB0aGUgaGFuZGxlIEhUTUxFbGVtZW50IGRyYWdnYWJsZSAqL1xuICBASW5wdXQoKSBoYW5kbGU6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBTZXQgdGhlIGJvdW5kcyBIVE1MRWxlbWVudCAqL1xuICBASW5wdXQoKSBib3VuZHM6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBMaXN0IG9mIGFsbG93ZWQgb3V0IG9mIGJvdW5kcyBlZGdlcyAqKi9cbiAgQElucHV0KCkgb3V0T2ZCb3VuZHMgPSB7XG4gICAgdG9wOiBmYWxzZSxcbiAgICByaWdodDogZmFsc2UsXG4gICAgYm90dG9tOiBmYWxzZSxcbiAgICBsZWZ0OiBmYWxzZVxuICB9O1xuXG4gIC8qKiBSb3VuZCB0aGUgcG9zaXRpb24gdG8gbmVhcmVzdCBncmlkICovXG4gIEBJbnB1dCgpIGdyaWRTaXplID0gMTtcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSB6SW5kZXhNb3Zpbmc6IHN0cmluZztcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBub3QgZHJhZ2dpbmcgKi9cbiAgQElucHV0KCkgc2V0IHpJbmRleChzZXR0aW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCBzZXR0aW5nKTtcbiAgICB0aGlzLl96SW5kZXggPSBzZXR0aW5nO1xuICB9XG4gIC8qKiBXaGV0aGVyIHRvIGxpbWl0IHRoZSBlbGVtZW50IHN0YXkgaW4gdGhlIGJvdW5kcyAqL1xuICBASW5wdXQoKSBpbkJvdW5kcyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCB1c2UgaXQncyBwcmV2aW91cyBkcmFnIHBvc2l0aW9uIG9uIGEgbmV3IGRyYWcgZXZlbnQuICovXG4gIEBJbnB1dCgpIHRyYWNrUG9zaXRpb24gPSB0cnVlO1xuXG4gIC8qKiBJbnB1dCBjc3Mgc2NhbGUgdHJhbnNmb3JtIG9mIGVsZW1lbnQgc28gdHJhbnNsYXRpb25zIGFyZSBjb3JyZWN0ICovXG4gIEBJbnB1dCgpIHNjYWxlID0gMTtcblxuICAvKiogV2hldGhlciB0byBwcmV2ZW50IGRlZmF1bHQgZXZlbnQgKi9cbiAgQElucHV0KCkgcHJldmVudERlZmF1bHRFdmVudCA9IGZhbHNlO1xuXG4gIC8qKiBTZXQgaW5pdGlhbCBwb3NpdGlvbiBieSBvZmZzZXRzICovXG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBJUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gbW92aW5nICovXG4gIEBPdXRwdXQoKSBtb3ZpbmdPZmZzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPElQb3NpdGlvbj4oKTtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gcHV0IGJhY2sgKi9cbiAgQE91dHB1dCgpIGVuZE9mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0RyYWdnYWJsZShzZXR0aW5nOiBhbnkpIHtcbiAgICBpZiAoc2V0dGluZyAhPT0gdW5kZWZpbmVkICYmIHNldHRpbmcgIT09IG51bGwgJiYgc2V0dGluZyAhPT0gJycpIHtcbiAgICAgIHRoaXMuYWxsb3dEcmFnID0gISFzZXR0aW5nO1xuXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuaGFuZGxlID8gdGhpcy5oYW5kbGUgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLmVkZ2UuZW1pdCh0aGlzLmJvdW5kc0NoZWNrKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZ09mZnNldC5lbWl0KHtcbiAgICAgICAgeDogdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueCxcbiAgICAgICAgeTogdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG5cbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy5zdG9wcGVkLmVtaXQodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLmVkZ2UuZW1pdCh0aGlzLmJvdW5kc0NoZWNrKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmRPZmZzZXQuZW1pdCh7XG4gICAgICAgIHg6IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLngsXG4gICAgICAgIHk6IHRoaXMudGVtcFRyYW5zLnkgKyB0aGlzLm9sZFRyYW5zLnlcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0hhbmRsZVRhcmdldCh0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaXMgdGhlIGVsZW1lbnQgY2xpY2tlZCwgdGhlbiBjaGVja3MgZWFjaCBjaGlsZCBlbGVtZW50IG9mIGVsZW1lbnQgYXMgd2VsbFxuICAgIC8vIElnbm9yZXMgYnV0dG9uIGNsaWNrc1xuXG4gICAgLy8gSWdub3JlIGVsZW1lbnRzIG9mIHR5cGUgYnV0dG9uXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IHdhcyBmb3VuZCwgcmV0dXJuIHRydWUgKGhhbmRsZSB3YXMgZm91bmQpXG4gICAgaWYgKGVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzaXZlbHkgaXRlcmF0ZSB0aGlzIGVsZW1lbnRzIGNoaWxkcmVuXG4gICAgZm9yIChsZXQgY2hpbGQgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgZWxlbWVudC5jaGlsZHJlbltjaGlsZF0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGxpbmVhZ2VcbiAgICAvLyBOb3RlOiByZXR1cm4gZmFsc2UgaXMgaWdub3JlIHVubGVzcyBpdCBpcyB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCddKVxuICBASG9zdExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgLy8gMS4gc2tpcCByaWdodCBjbGljaztcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyAyLiBpZiBoYW5kbGUgaXMgc2V0LCB0aGUgZWxlbWVudCBjYW4gb25seSBiZSBtb3ZlZCBieSBoYW5kbGVcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgaWYgKHRoaXMuaGFuZGxlICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0LCB0aGlzLmhhbmRsZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnbmFsID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KTtcbiAgICB0aGlzLnBpY2tVcCgpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2V1cCcpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50Om1vdXNlbGVhdmUnKVxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaGVuZCcpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNoY2FuY2VsJylcbiAgb25Nb3VzZUxlYXZlKCkge1xuICAgIHRoaXMucHV0QmFjaygpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICB0aGlzLm1vdmVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUhhbmRsZSB7XG4gIHByb3RlY3RlZCBfaGFuZGxlOiBFbGVtZW50O1xuICBwcml2YXRlIF9vblJlc2l6ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBFbGVtZW50LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNzczogc3RyaW5nLFxuICAgIHByaXZhdGUgb25Nb3VzZURvd246IGFueVxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoYW5kbGUgZGl2XG4gICAgbGV0IGhhbmRsZSA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgJ25nLXJlc2l6YWJsZS1oYW5kbGUnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsIGNzcyk7XG5cbiAgICAvLyBhZGQgZGVmYXVsdCBkaWFnb25hbCBmb3Igc2UgaGFuZGxlXG4gICAgaWYgKHR5cGUgPT09ICdzZScpIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgJ25nLXJlc2l6YWJsZS1kaWFnb25hbCcpO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYW5kIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAgdGhpcy5fb25SZXNpemUgPSAoZXZlbnQpID0+IHsgb25Nb3VzZURvd24oZXZlbnQsIHRoaXMpOyB9O1xuICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGFuZGxlID0gaGFuZGxlO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oYW5kbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oYW5kbGUpO1xuICAgIH1cbiAgICB0aGlzLl9oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuX29uUmVzaXplID0gbnVsbDtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xuICB9XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIElTaXplIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaXplIGltcGxlbWVudHMgSVNpemUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgd2lkdGg6IG51bWJlciwgcHVibGljIGhlaWdodDogbnVtYmVyKSB7IH1cblxuICBzdGF0aWMgZ2V0Q3VycmVudChlbDogRWxlbWVudCkge1xuICAgIGxldCBzaXplID0gbmV3IFNpemUoMCwgMCk7XG5cbiAgICBpZiAod2luZG93KSB7XG4gICAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICBzaXplLndpZHRoID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSwgMTApO1xuICAgICAgICBzaXplLmhlaWdodCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpLCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm90IFN1cHBvcnRlZCEnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjb3B5KHM6IFNpemUpIHtcbiAgICByZXR1cm4gbmV3IFNpemUoMCwgMCkuc2V0KHMpO1xuICB9XG5cbiAgc2V0KHM6IElTaXplKSB7XG4gICAgdGhpcy53aWR0aCA9IHMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzLmhlaWdodDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsXG4gIElucHV0LCBPdXRwdXQsIE9uSW5pdCwgSG9zdExpc3RlbmVyLFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlIH0gZnJvbSAnLi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUnO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlVHlwZSB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1oYW5kbGUtdHlwZSc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgSVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlbHMvcG9zaXRpb24nO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4vbW9kZWxzL3NpemUnO1xuaW1wb3J0IHsgSVJlc2l6ZUV2ZW50IH0gZnJvbSAnLi9tb2RlbHMvcmVzaXplLWV2ZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nUmVzaXphYmxlXScsXG4gIGV4cG9ydEFzOiAnbmdSZXNpemFibGUnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBfcmVzaXphYmxlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfaGFuZGxlczogeyBba2V5OiBzdHJpbmddOiBSZXNpemVIYW5kbGUgfSA9IHt9O1xuICBwcml2YXRlIF9oYW5kbGVUeXBlOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9oYW5kbGVSZXNpemluZzogUmVzaXplSGFuZGxlID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uOiB7ICduJzogYm9vbGVhbiwgJ3MnOiBib29sZWFuLCAndyc6IGJvb2xlYW4sICdlJzogYm9vbGVhbiB9ID0gbnVsbDtcbiAgcHJpdmF0ZSBfYXNwZWN0UmF0aW8gPSAwO1xuICBwcml2YXRlIF9jb250YWlubWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xuICBwcml2YXRlIF9vcmlnTW91c2VQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogT3JpZ2luYWwgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfb3JpZ1NpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9vcmlnUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIEN1cnJlbnQgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfY3VyclNpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9jdXJyUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIEluaXRpYWwgU2l6ZSBhbmQgUG9zaXRpb24gKi9cbiAgcHJpdmF0ZSBfaW5pdFNpemU6IFNpemUgPSBudWxsO1xuICBwcml2YXRlIF9pbml0UG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIFNuYXAgdG8gZ2lyZCAqL1xuICBwcml2YXRlIF9ncmlkU2l6ZTogSVBvc2l0aW9uID0gbnVsbDtcblxuICBwcml2YXRlIF9ib3VuZGluZzogYW55ID0gbnVsbDtcblxuICAvKipcbiAgICogQnVnZml4OiBpRnJhbWVzLCBhbmQgY29udGV4dCB1bnJlbGF0ZWQgZWxlbWVudHMgYmxvY2sgYWxsIGV2ZW50cywgYW5kIGFyZSB1bnVzYWJsZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzg0XG4gICAqL1xuICBwcml2YXRlIF9oZWxwZXJCbG9jazogSGVscGVyQmxvY2sgPSBudWxsO1xuXG4gIC8qKiBEaXNhYmxlcyB0aGUgcmVzaXphYmxlIGlmIHNldCB0byBmYWxzZS4gKi9cbiAgQElucHV0KCkgc2V0IG5nUmVzaXphYmxlKHY6IGFueSkge1xuICAgIGlmICh2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gbnVsbCAmJiB2ICE9PSAnJykge1xuICAgICAgdGhpcy5fcmVzaXphYmxlID0gISF2O1xuICAgICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hpY2ggaGFuZGxlcyBjYW4gYmUgdXNlZCBmb3IgcmVzaXppbmcuXG4gICAqIEBleGFtcGxlXG4gICAqIFtyekhhbmRsZXNdID0gXCInbixlLHMsdyxzZSxuZSxzdyxudydcIlxuICAgKiBlcXVhbHMgdG86IFtyekhhbmRsZXNdID0gXCInYWxsJ1wiXG4gICAqXG4gICAqICovXG4gIEBJbnB1dCgpIHJ6SGFuZGxlczogUmVzaXplSGFuZGxlVHlwZSA9ICdlLHMsc2UnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBiZSBjb25zdHJhaW5lZCB0byBhIHNwZWNpZmljIGFzcGVjdCByYXRpby5cbiAgICogIE11bHRpcGxlIHR5cGVzIHN1cHBvcnRlZDpcbiAgICogIGJvb2xlYW46IFdoZW4gc2V0IHRvIHRydWUsIHRoZSBlbGVtZW50IHdpbGwgbWFpbnRhaW4gaXRzIG9yaWdpbmFsIGFzcGVjdCByYXRpby5cbiAgICogIG51bWJlcjogRm9yY2UgdGhlIGVsZW1lbnQgdG8gbWFpbnRhaW4gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8gZHVyaW5nIHJlc2l6aW5nLlxuICAgKi9cbiAgQElucHV0KCkgcnpBc3BlY3RSYXRpbzogYm9vbGVhbiB8IG51bWJlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDb25zdHJhaW5zIHJlc2l6aW5nIHRvIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBvciByZWdpb24uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBTZWxlY3RvcjogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZpcnN0IGVsZW1lbnQgZm91bmQgYnkgdGhlIHNlbGVjdG9yLlxuICAgKiAgICAgICAgICAgIElmIG5vIGVsZW1lbnQgaXMgZm91bmQsIG5vIGNvbnRhaW5tZW50IHdpbGwgYmUgc2V0LlxuICAgKiAgRWxlbWVudDogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhpcyBlbGVtZW50LlxuICAgKiAgU3RyaW5nOiBQb3NzaWJsZSB2YWx1ZXM6IFwicGFyZW50XCIuXG4gICAqL1xuICBASW5wdXQoKSByekNvbnRhaW5tZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFNuYXBzIHRoZSByZXNpemluZyBlbGVtZW50IHRvIGEgZ3JpZCwgZXZlcnkgeCBhbmQgeSBwaXhlbHMuXG4gICAqIEEgbnVtYmVyIGZvciBib3RoIHdpZHRoIGFuZCBoZWlnaHQgb3IgYW4gYXJyYXkgdmFsdWVzIGxpa2UgWyB4LCB5IF1cbiAgICovXG4gIEBJbnB1dCgpIHJ6R3JpZDogbnVtYmVyIHwgbnVtYmVyW10gPSBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSB3aWR0aCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5XaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gaGVpZ2h0IHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1pbkhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4V2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNYXhIZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdGFydCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpTdGFydCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6UmVzaXppbmcgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0b3AgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RvcCA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBJbnB1dCBjc3Mgc2NhbGUgdHJhbnNmb3JtIG9mIGVsZW1lbnQgc28gdHJhbnNsYXRpb25zIGFyZSBjb3JyZWN0ICovXG4gIEBJbnB1dCgpIHNjYWxlID0gMTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBuZXcgSGVscGVyQmxvY2soZWwubmF0aXZlRWxlbWVudCwgcmVuZGVyZXIpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydyekhhbmRsZXMnXSAmJiAhY2hhbmdlc1sncnpIYW5kbGVzJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekFzcGVjdFJhdGlvJ10gJiYgIWNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sncnpDb250YWlubWVudCddICYmICFjaGFuZ2VzWydyekNvbnRhaW5tZW50J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5kaXNwb3NlKCk7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBudWxsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9pbml0U2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2luaXRQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gcmVzZXQgc2l6ZSAqL1xuICBwdWJsaWMgcmVzZXRTaXplKCkge1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgc3RhdHVzICovXG4gIHB1YmxpYyBnZXRTdGF0dXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyUG9zIHx8ICF0aGlzLl9jdXJyU2l6ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZXNpemFibGUoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNsZWFyIGhhbmRsZXM6XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG5cbiAgICAvLyBjcmVhdGUgbmV3IG9uZXM6XG4gICAgaWYgKHRoaXMuX3Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgICB0aGlzLmNyZWF0ZUhhbmRsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBhc3BlY3QgKi9cbiAgcHJpdmF0ZSB1cGRhdGVBc3BlY3RSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpBc3BlY3RSYXRpbyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpZiAodGhpcy5yekFzcGVjdFJhdGlvICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCkge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9ICh0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2N1cnJTaXplLmhlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByID0gTnVtYmVyKHRoaXMucnpBc3BlY3RSYXRpbyk7XG4gICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IGlzTmFOKHIpID8gMCA6IHI7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgY29udGFpbm1lbnQgKi9cbiAgcHJpdmF0ZSB1cGRhdGVDb250YWlubWVudCgpIHtcbiAgICBpZiAoIXRoaXMucnpDb250YWlubWVudCkge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5yekNvbnRhaW5tZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpDb250YWlubWVudCA9PT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4odGhpcy5yekNvbnRhaW5tZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLnJ6Q29udGFpbm1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgaGFuZGxlIGRpdnMgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVzKCkge1xuICAgIGlmICghdGhpcy5yekhhbmRsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG1wSGFuZGxlVHlwZXM6IHN0cmluZ1tdO1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekhhbmRsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekhhbmRsZXMgPT09ICdhbGwnKSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ253JywgJ3N3J107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IHRoaXMucnpIYW5kbGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBkZWZhdWx0IGhhbmRsZSB0aGVtZTogbmctcmVzaXphYmxlLSR0eXBlLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgYG5nLXJlc2l6YWJsZS0ke3R5cGV9YCk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0bXBIYW5kbGVUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMucnpIYW5kbGVzKTtcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gY3VzdG9tIGhhbmRsZSB0aGVtZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIHRoaXMucnpIYW5kbGVzW3R5cGVdKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBhIGhhbmRsZSAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlOiBzdHJpbmcsIGNzczogc3RyaW5nKTogUmVzaXplSGFuZGxlIHtcbiAgICBjb25zdCBfZWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXR5cGUubWF0Y2goL14oc2V8c3d8bmV8bnd8bnxlfHN8dykkLykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgaGFuZGxlIHR5cGU6JywgdHlwZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc2l6ZUhhbmRsZShfZWwsIHRoaXMucmVuZGVyZXIsIHR5cGUsIGNzcywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlSGFuZGxlcygpIHtcbiAgICBmb3IgKGxldCB0eXBlIG9mIHRoaXMuX2hhbmRsZVR5cGUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0uZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZVR5cGUgPSBbXTtcbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gIH1cblxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgLy8gc2tpcCByaWdodCBjbGljaztcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBldmVudHNcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKCF0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuc3RhcnRSZXNpemUoaGFuZGxlKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZXVwJylcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2VsZWF2ZScpXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OnRvdWNoZW5kJylcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2hjYW5jZWwnKVxuICBvbk1vdXNlTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICB0aGlzLnN0b3BSZXNpemUoKTtcbiAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW91c2Vtb3ZlJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6dG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nICYmIHRoaXMuX3Jlc2l6YWJsZSAmJiB0aGlzLl9vcmlnTW91c2VQb3MgJiYgdGhpcy5fb3JpZ1BvcyAmJiB0aGlzLl9vcmlnU2l6ZSkge1xuICAgICAgdGhpcy5yZXNpemVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgIHRoaXMub25SZXNpemluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRSZXNpemUoaGFuZGxlOiBSZXNpemVIYW5kbGUpIHtcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fb3JpZ1NpemUgPSBTaXplLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9vcmlnUG9zID0gUG9zaXRpb24uZ2V0Q3VycmVudChlbG0pOyAvLyB4OiBsZWZ0LCB5OiB0b3BcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9vcmlnU2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5fb3JpZ1Bvcyk7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLmdldEJvdW5kaW5nKCk7XG4gICAgfVxuICAgIHRoaXMuZ2V0R3JpZFNpemUoKTtcblxuICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXppbmcgPSBoYW5kbGU7XG4gICAgdGhpcy51cGRhdGVEaXJlY3Rpb24oKTtcbiAgICB0aGlzLnJ6U3RhcnQuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHN0b3BSZXNpemUoKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLnJlbW92ZSgpO1xuICAgIHRoaXMucnpTdG9wLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gbnVsbDtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX29yaWdTaXplID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnUG9zID0gbnVsbDtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMucmVzZXRCb3VuZGluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25SZXNpemluZygpIHtcbiAgICB0aGlzLnJ6UmVzaXppbmcuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlc2l6aW5nRXZlbnQoKTogSVJlc2l6ZUV2ZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgaG9zdDogdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgaGFuZGxlOiB0aGlzLl9oYW5kbGVSZXNpemluZyA/IHRoaXMuX2hhbmRsZVJlc2l6aW5nLmVsIDogbnVsbCxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEaXJlY3Rpb24oKSB7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0ge1xuICAgICAgbjogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9uLyksXG4gICAgICBzOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL3MvKSxcbiAgICAgIHc6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvdy8pLFxuICAgICAgZTogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9lLylcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZXNpemVUbyhwOiBQb3NpdGlvbikge1xuICAgIHAuc3VidHJhY3QodGhpcy5fb3JpZ01vdXNlUG9zKTtcblxuICAgIGNvbnN0IHRtcFggPSBNYXRoLnJvdW5kKHAueCAvIHRoaXMuX2dyaWRTaXplLnggLyB0aGlzLnNjYWxlKSAqIHRoaXMuX2dyaWRTaXplLng7XG4gICAgY29uc3QgdG1wWSA9IE1hdGgucm91bmQocC55IC8gdGhpcy5fZ3JpZFNpemUueSAvIHRoaXMuc2NhbGUpICogdGhpcy5fZ3JpZFNpemUueTtcblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgLy8gbiwgbmUsIG53XG4gICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyB0bXBZO1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdG1wWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi5zKSB7XG4gICAgICAvLyBzLCBzZSwgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCArIHRtcFk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5lKSB7XG4gICAgICAvLyBlLCBuZSwgc2VcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggKyB0bXBYO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgIC8vIHcsIG53LCBzd1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIHRtcFg7XG4gICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyB0bXBYO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tCb3VuZHMoKTtcbiAgICB0aGlzLmNoZWNrU2l6ZSgpO1xuICAgIHRoaXMuYWRqdXN0QnlSYXRpbygpO1xuICAgIHRoaXMuZG9SZXNpemUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZG9SZXNpemUoKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnaGVpZ2h0JywgdGhpcy5fY3VyclNpemUuaGVpZ2h0ICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd3aWR0aCcsIHRoaXMuX2N1cnJTaXplLndpZHRoICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdsZWZ0JywgdGhpcy5fY3VyclBvcy54ICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCB0aGlzLl9jdXJyUG9zLnkgKyAncHgnKTtcbiAgfVxuXG4gIHByaXZhdGUgYWRqdXN0QnlSYXRpbygpIHtcbiAgICBpZiAodGhpcy5fYXNwZWN0UmF0aW8pIHtcbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSB8fCB0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMuX2N1cnJTaXplLmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQm91bmRzKCkge1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9ib3VuZGluZy53aWR0aCAtIHRoaXMuX2JvdW5kaW5nLnByIC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQgLSB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5fYm91bmRpbmcuaGVpZ2h0IC0gdGhpcy5fYm91bmRpbmcucGIgLSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uICYmICh0aGlzLl9jdXJyUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZKSA8IDApIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gLXRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCArIHRoaXMuX29yaWdQb3MueSArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udyAmJiAodGhpcy5fY3VyclBvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdGhpcy5fb3JpZ1Bvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLndpZHRoID4gbWF4V2lkdGgpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBtYXhXaWR0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja1NpemUoKSB7XG4gICAgY29uc3QgbWluSGVpZ2h0ID0gIXRoaXMucnpNaW5IZWlnaHQgPyAxIDogdGhpcy5yek1pbkhlaWdodDtcbiAgICBjb25zdCBtaW5XaWR0aCA9ICF0aGlzLnJ6TWluV2lkdGggPyAxIDogdGhpcy5yek1pbldpZHRoO1xuXG4gICAgaWYgKHRoaXMuX2N1cnJTaXplLmhlaWdodCA8IG1pbkhlaWdodCkge1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbWluSGVpZ2h0O1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgKHRoaXMuX29yaWdTaXplLmhlaWdodCAtIG1pbkhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2N1cnJTaXplLndpZHRoIDwgbWluV2lkdGgpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWluV2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSBtaW5XaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhIZWlnaHQgJiYgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID4gdGhpcy5yek1heEhlaWdodCkge1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5yek1heEhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSB0aGlzLnJ6TWF4SGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yek1heFdpZHRoICYmIHRoaXMuX2N1cnJTaXplLndpZHRoID4gdGhpcy5yek1heFdpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMucnpNYXhXaWR0aDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArICh0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIHRoaXMucnpNYXhXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRCb3VuZGluZygpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX2NvbnRhaW5tZW50O1xuICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgbGV0IHAgPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpO1xuXG4gICAgICBjb25zdCBuYXRpdmVFbCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICBsZXQgdHJhbnNmb3JtcyA9IG5hdGl2ZUVsLmdldFByb3BlcnR5VmFsdWUoJ3RyYW5zZm9ybScpLnJlcGxhY2UoL1teLVxcZCxdL2csICcnKS5zcGxpdCgnLCcpO1xuXG4gICAgICB0aGlzLl9ib3VuZGluZyA9IHt9O1xuICAgICAgdGhpcy5fYm91bmRpbmcud2lkdGggPSBlbC5jbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLmhlaWdodCA9IGVsLmNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLnByID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1yaWdodCcpLCAxMCk7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wYiA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctYm90dG9tJyksIDEwKTtcblxuICAgICAgaWYgKHRyYW5zZm9ybXMubGVuZ3RoID49IDYpIHtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCA9IHBhcnNlSW50KHRyYW5zZm9ybXNbNF0sIDEwKTtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IHBhcnNlSW50KHRyYW5zZm9ybXNbNV0sIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSAwO1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPSBjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwb3NpdGlvbicpO1xuXG4gICAgICBpZiAocCA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShlbCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldEJvdW5kaW5nKCkge1xuICAgIGlmICh0aGlzLl9ib3VuZGluZyAmJiB0aGlzLl9ib3VuZGluZy5wb3NpdGlvbiA9PT0gJ3N0YXRpYycpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5fY29udGFpbm1lbnQsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgIH1cbiAgICB0aGlzLl9ib3VuZGluZyA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGdldEdyaWRTaXplKCkge1xuICAgIC8vIHNldCBkZWZhdWx0IHZhbHVlOlxuICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiAxLCB5OiAxIH07XG5cbiAgICBpZiAodGhpcy5yekdyaWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5yekdyaWQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZCwgeTogdGhpcy5yekdyaWQgfTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnJ6R3JpZCkpIHtcbiAgICAgICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IHRoaXMucnpHcmlkWzBdLCB5OiB0aGlzLnJ6R3JpZFsxXSB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9hbmd1bGFyLXJlc2l6YWJsZS5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUsXG4gICAgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSxcbiAgICBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZU1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJEaXJlY3RpdmUiLCJFbGVtZW50UmVmIiwiUmVuZGVyZXIyIiwiT3V0cHV0IiwiSW5wdXQiLCJIb3N0TGlzdGVuZXIiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiTmdNb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFLQTtRQUNFLGtCQUFtQixDQUFTLEVBQVMsQ0FBUztZQUEzQixNQUFDLEdBQUQsQ0FBQyxDQUFRO1lBQVMsTUFBQyxHQUFELENBQUMsQ0FBUTtTQUFLOzs7OztRQUU1QyxrQkFBUzs7OztZQUFoQixVQUFpQixDQUEwQjtnQkFDekMs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