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
        Object.defineProperty(Position.prototype, "value", {
            get: /**
             * @return {?}
             */ function () {
                return { x: this.x, y: this.y };
            },
            enumerable: true,
            configurable: true
        });
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
        function AngularDraggableDirective(el, renderer, zone) {
            this.el = el;
            this.renderer = renderer;
            this.zone = zone;
            this.allowDrag = true;
            this.moving = false;
            this.orignal = null;
            this.oldTrans = new Position(0, 0);
            this.tempTrans = new Position(0, 0);
            this.currTrans = new Position(0, 0);
            this.oldZIndex = '';
            this._zIndex = '';
            this.needTransform = false;
            this._isGridSnapEnabled = false;
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
                this._bindEvents();
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
                this.currTrans = null;
                this._helperBlock.dispose();
                this._helperBlock = null;
                this._removeListener1();
                this._removeListener2();
                this._removeListener3();
                this._removeListener4();
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
                var _this = this;
                if (this.orignal) {
                    p.subtract(this.orignal);
                    this.tempTrans.set({ x: p.x / this.scale, y: p.y / this.scale });
                    this.transform();
                    if (this.bounds) {
                        this.zone.run(function () { return _this.edge.emit(_this.boundsCheck()); });
                    }
                    this.zone.run(function () { return _this.movingOffset.emit(_this.currTrans.value); });
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
                if (this.gridSize > 1 && this._isGridSnapEnabled) {
                    translateX = Math.round(translateX / this.gridSize) * this.gridSize;
                    translateY = Math.round(translateY / this.gridSize) * this.gridSize;
                }
                var /** @type {?} */ value = "translate(" + translateX + "px, " + translateY + "px)";
                this.renderer.setStyle(this.el.nativeElement, 'transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
                // save current position
                this.currTrans.x = translateX;
                this.currTrans.y = translateY;
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.pickUp = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // get old z-index:
                this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
                if (window) {
                    this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('z-index');
                }
                if (this.zIndexMoving) {
                    this.renderer.setStyle(this.el.nativeElement, 'z-index', this.zIndexMoving);
                }
                if (!this.moving) {
                    this.zone.run(function () { return _this.started.emit(_this.el.nativeElement); });
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
        /** Get current offset */
        /**
         * Get current offset
         * @return {?}
         */
        AngularDraggableDirective.prototype.getCurrentOffset = /**
         * Get current offset
         * @return {?}
         */
            function () {
                return this.currTrans.value;
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.putBack = /**
         * @return {?}
         */
            function () {
                var _this = this;
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
                    this.zone.run(function () { return _this.stopped.emit(_this.el.nativeElement); });
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
                        this.zone.run(function () { return _this.edge.emit(_this.boundsCheck()); });
                    }
                    this.moving = false;
                    this.zone.run(function () { return _this.endOffset.emit(_this.currTrans.value); });
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
         * @return {?}
         */
        AngularDraggableDirective.prototype._bindEvents = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.zone.runOutsideAngular(function () {
                    _this._removeListener1 = _this.renderer.listen(_this.el.nativeElement, 'mousedown', function (event) {
                        // 1. skip right click;
                        if (event instanceof MouseEvent && event.button === 2) {
                            return;
                        }
                        // 2. if handle is set, the element can only be moved by handle
                        var /** @type {?} */ target = event.target || event.srcElement;
                        if (_this.handle !== undefined && !_this.checkHandleTarget(target, _this.handle)) {
                            return;
                        }
                        if (_this.preventDefaultEvent) {
                            event.stopPropagation();
                            event.preventDefault();
                        }
                        _this.orignal = Position.fromEvent(event);
                        _this.pickUp();
                    });
                    _this._removeListener2 = _this.renderer.listen('document', 'mouseup', function () {
                        _this.putBack();
                    });
                    _this._removeListener3 = _this.renderer.listen('document', 'mouseleave', function () {
                        _this.putBack();
                    });
                    _this._removeListener4 = _this.renderer.listen('document', 'mousemove', function (event) {
                        if (_this.moving && _this.allowDrag) {
                            if (_this.preventDefaultEvent) {
                                event.stopPropagation();
                                event.preventDefault();
                            }
                            // Only when shift key is pressed
                            // Only when shift key is pressed
                            _this._isGridSnapEnabled = !!event.shiftKey;
                            // Add a transparent helper div:
                            // Add a transparent helper div:
                            _this._helperBlock.add();
                            _this.moveTo(Position.fromEvent(event));
                        }
                    });
                });
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
                { type: core.Renderer2 },
                { type: core.NgZone }
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
            ngDraggable: [{ type: core.Input }]
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
            // append div to parent
            if (this.parent) {
                parent.appendChild(handle);
            }
            // create and register event listener
            this._onResize = function (event) { onMouseDown(event, _this); };
            handle.addEventListener('mousedown', this._onResize);
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
        function AngularResizableDirective(el, renderer, zone) {
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
                this._bindEvents();
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
                this._removeListener1();
                this._removeListener2();
                this._removeListener3();
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
        AngularResizableDirective.prototype._bindEvents = /**
         * @return {?}
         */
            function () {
                var _this = this;
                this.zone.runOutsideAngular(function () {
                    _this._removeListener1 = _this.renderer.listen('document', 'mouseup', function () {
                        // 1. skip right click;
                        if (_this._handleResizing) {
                            _this.stopResize();
                            _this._origMousePos = null;
                        }
                    });
                    _this._removeListener2 = _this.renderer.listen('document', 'mouseleave', function () {
                        // 1. skip right click;
                        if (_this._handleResizing) {
                            _this.stopResize();
                            _this._origMousePos = null;
                        }
                    });
                    _this._removeListener3 = _this.renderer.listen('document', 'mousemove', function (event) {
                        if (_this._handleResizing && _this._resizable && _this._origMousePos && _this._origPos && _this._origSize) {
                            _this.resizeTo(Position.fromEvent(event));
                            _this.onResizing();
                        }
                    });
                });
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
                var _this = this;
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
                this.zone.run(function () { return _this.rzStart.emit(_this.getResizingEvent()); });
            };
        /**
         * @return {?}
         */
        AngularResizableDirective.prototype.stopResize = /**
         * @return {?}
         */
            function () {
                var _this = this;
                // Remove the helper div:
                this._helperBlock.remove();
                this.zone.run(function () { return _this.rzStop.emit(_this.getResizingEvent()); });
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
                var _this = this;
                this.zone.run(function () { return _this.rzResizing.emit(_this.getResizingEvent()); });
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
                { type: core.Renderer2 },
                { type: core.NgZone }
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
            scale: [{ type: core.Input }]
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItZHJhZ2dhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9tb2RlbHMvcG9zaXRpb24udHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9oZWxwZXItYmxvY2sudHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIixudWxsLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9yZXNpemUtaGFuZGxlLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9zaXplLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHBvcy54ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIHBvcy55ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBQb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oMCwgMCkuc2V0KHApO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IElQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfTtcbiAgfVxuXG4gIGFkZChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggKz0gcC54O1xuICAgIHRoaXMueSArPSBwLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdWJ0cmFjdChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggLT0gcC54O1xuICAgIHRoaXMueSAtPSBwLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocDogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy54ID0gcC54O1xuICAgIHRoaXMueSA9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBIZWxwZXJCbG9jayB7XG4gIHByb3RlY3RlZCBfaGVscGVyOiBFbGVtZW50O1xuICBwcml2YXRlIF9hZGRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IEVsZW1lbnQsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGVscGVyIGRpdlxuICAgIGxldCBoZWxwZXIgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2JhY2tncm91bmQtY29sb3InLCAndHJhbnNwYXJlbnQnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICd0b3AnLCAnMCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2xlZnQnLCAnMCcpO1xuXG4gICAgLy8gZG9uZVxuICAgIHRoaXMuX2hlbHBlciA9IGhlbHBlcjtcbiAgfVxuXG4gIGFkZCgpIHtcbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCAmJiAhdGhpcy5fYWRkZWQpIHtcbiAgICAgIHRoaXMucGFyZW50LmFwcGVuZENoaWxkKHRoaXMuX2hlbHBlcik7XG4gICAgICB0aGlzLl9hZGRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oZWxwZXIgPSBudWxsO1xuICAgIHRoaXMuX2FkZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlbHBlcjtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsXG4gIElucHV0LCBPdXRwdXQsIE9uSW5pdCxcbiAgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsXG4gIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCwgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJUG9zaXRpb24sIFBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlbHMvcG9zaXRpb24nO1xuaW1wb3J0IHsgSGVscGVyQmxvY2sgfSBmcm9tICcuL3dpZGdldHMvaGVscGVyLWJsb2NrJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nRHJhZ2dhYmxlXScsXG4gIGV4cG9ydEFzOiAnbmdEcmFnZ2FibGUnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBhbGxvd0RyYWcgPSB0cnVlO1xuICBwcml2YXRlIG1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIG9yaWduYWw6IFBvc2l0aW9uID0gbnVsbDtcbiAgcHJpdmF0ZSBvbGRUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSB0ZW1wVHJhbnMgPSBuZXcgUG9zaXRpb24oMCwgMCk7XG4gIHByaXZhdGUgY3VyclRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIG9sZFpJbmRleCA9ICcnO1xuICBwcml2YXRlIF96SW5kZXggPSAnJztcbiAgcHJpdmF0ZSBuZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMTogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIyOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjM6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyNDogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfaXNHcmlkU25hcEVuYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQnVnZml4OiBpRnJhbWVzLCBhbmQgY29udGV4dCB1bnJlbGF0ZWQgZWxlbWVudHMgYmxvY2sgYWxsIGV2ZW50cywgYW5kIGFyZSB1bnVzYWJsZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzg0XG4gICAqL1xuICBwcml2YXRlIF9oZWxwZXJCbG9jazogSGVscGVyQmxvY2sgPSBudWxsO1xuXG4gIEBPdXRwdXQoKSBzdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzdG9wcGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBlZGdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqIE1ha2UgdGhlIGhhbmRsZSBIVE1MRWxlbWVudCBkcmFnZ2FibGUgKi9cbiAgQElucHV0KCkgaGFuZGxlOiBIVE1MRWxlbWVudDtcblxuICAvKiogU2V0IHRoZSBib3VuZHMgSFRNTEVsZW1lbnQgKi9cbiAgQElucHV0KCkgYm91bmRzOiBIVE1MRWxlbWVudDtcblxuICAvKiogTGlzdCBvZiBhbGxvd2VkIG91dCBvZiBib3VuZHMgZWRnZXMgKiovXG4gIEBJbnB1dCgpIG91dE9mQm91bmRzID0ge1xuICAgIHRvcDogZmFsc2UsXG4gICAgcmlnaHQ6IGZhbHNlLFxuICAgIGJvdHRvbTogZmFsc2UsXG4gICAgbGVmdDogZmFsc2VcbiAgfTtcblxuICAvKiogUm91bmQgdGhlIHBvc2l0aW9uIHRvIG5lYXJlc3QgZ3JpZCAqL1xuICBASW5wdXQoKSBncmlkU2l6ZSA9IDE7XG5cbiAgLyoqIFNldCB6LWluZGV4IHdoZW4gZHJhZ2dpbmcgKi9cbiAgQElucHV0KCkgekluZGV4TW92aW5nOiBzdHJpbmc7XG5cbiAgLyoqIFNldCB6LWluZGV4IHdoZW4gbm90IGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHNldCB6SW5kZXgoc2V0dGluZzogc3RyaW5nKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4Jywgc2V0dGluZyk7XG4gICAgdGhpcy5fekluZGV4ID0gc2V0dGluZztcbiAgfVxuICAvKiogV2hldGhlciB0byBsaW1pdCB0aGUgZWxlbWVudCBzdGF5IGluIHRoZSBib3VuZHMgKi9cbiAgQElucHV0KCkgaW5Cb3VuZHMgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgdXNlIGl0J3MgcHJldmlvdXMgZHJhZyBwb3NpdGlvbiBvbiBhIG5ldyBkcmFnIGV2ZW50LiAqL1xuICBASW5wdXQoKSB0cmFja1Bvc2l0aW9uID0gdHJ1ZTtcblxuICAvKiogSW5wdXQgY3NzIHNjYWxlIHRyYW5zZm9ybSBvZiBlbGVtZW50IHNvIHRyYW5zbGF0aW9ucyBhcmUgY29ycmVjdCAqL1xuICBASW5wdXQoKSBzY2FsZSA9IDE7XG5cbiAgLyoqIFdoZXRoZXIgdG8gcHJldmVudCBkZWZhdWx0IGV2ZW50ICovXG4gIEBJbnB1dCgpIHByZXZlbnREZWZhdWx0RXZlbnQgPSBmYWxzZTtcblxuICAvKiogU2V0IGluaXRpYWwgcG9zaXRpb24gYnkgb2Zmc2V0cyAqL1xuICBASW5wdXQoKSBwb3NpdGlvbjogSVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG5cbiAgLyoqIEVtaXQgcG9zaXRpb24gb2Zmc2V0cyB3aGVuIG1vdmluZyAqL1xuICBAT3V0cHV0KCkgbW92aW5nT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgLyoqIEVtaXQgcG9zaXRpb24gb2Zmc2V0cyB3aGVuIHB1dCBiYWNrICovXG4gIEBPdXRwdXQoKSBlbmRPZmZzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPElQb3NpdGlvbj4oKTtcblxuICBASW5wdXQoKVxuICBzZXQgbmdEcmFnZ2FibGUoc2V0dGluZzogYW55KSB7XG4gICAgaWYgKHNldHRpbmcgIT09IHVuZGVmaW5lZCAmJiBzZXR0aW5nICE9PSBudWxsICYmIHNldHRpbmcgIT09ICcnKSB7XG4gICAgICB0aGlzLmFsbG93RHJhZyA9ICEhc2V0dGluZztcblxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIHByaXZhdGUgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBuZXcgSGVscGVyQmxvY2soZWwubmF0aXZlRWxlbWVudCwgcmVuZGVyZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuXG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuaGFuZGxlID8gdGhpcy5oYW5kbGUgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYm91bmRzID0gbnVsbDtcbiAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5vcmlnbmFsID0gbnVsbDtcbiAgICB0aGlzLm9sZFRyYW5zID0gbnVsbDtcbiAgICB0aGlzLnRlbXBUcmFucyA9IG51bGw7XG4gICAgdGhpcy5jdXJyVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMubW92aW5nT2Zmc2V0LmVtaXQodGhpcy5jdXJyVHJhbnMudmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybSgpIHtcblxuICAgIGxldCB0cmFuc2xhdGVYID0gdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueDtcbiAgICBsZXQgdHJhbnNsYXRlWSA9IHRoaXMudGVtcFRyYW5zLnkgKyB0aGlzLm9sZFRyYW5zLnk7XG5cbiAgICAvLyBTbmFwIHRvIGdyaWQ6IGJ5IGdyaWQgc2l6ZVxuICAgIGlmICh0aGlzLmdyaWRTaXplID4gMSAmJiB0aGlzLl9pc0dyaWRTbmFwRW5hYmxlZCkge1xuICAgICAgdHJhbnNsYXRlWCA9IE1hdGgucm91bmQodHJhbnNsYXRlWCAvIHRoaXMuZ3JpZFNpemUpICogdGhpcy5ncmlkU2l6ZTtcbiAgICAgIHRyYW5zbGF0ZVkgPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVkgLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0gYHRyYW5zbGF0ZSgke3RyYW5zbGF0ZVh9cHgsICR7dHJhbnNsYXRlWX1weClgO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctd2Via2l0LXRyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy1tcy10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbW96LXRyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy1vLXRyYW5zZm9ybScsIHZhbHVlKTtcblxuICAgIC8vIHNhdmUgY3VycmVudCBwb3NpdGlvblxuICAgIHRoaXMuY3VyclRyYW5zLnggPSB0cmFuc2xhdGVYO1xuICAgIHRoaXMuY3VyclRyYW5zLnkgPSB0cmFuc2xhdGVZO1xuICB9XG5cbiAgcHJpdmF0ZSBwaWNrVXAoKSB7XG4gICAgLy8gZ2V0IG9sZCB6LWluZGV4OlxuICAgIHRoaXMub2xkWkluZGV4ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggOiAnJztcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIHRoaXMub2xkWkluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCd6LWluZGV4Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuekluZGV4TW92aW5nKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCB0aGlzLnpJbmRleE1vdmluZyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnN0YXJ0ZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBib3VuZHNDaGVjaygpIHtcbiAgICBpZiAodGhpcy5ib3VuZHMpIHtcbiAgICAgIGxldCBib3VuZGFyeSA9IHRoaXMuYm91bmRzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAndG9wJzogdGhpcy5vdXRPZkJvdW5kcy50b3AgPyB0cnVlIDogYm91bmRhcnkudG9wIDwgZWxlbS50b3AsXG4gICAgICAgICdyaWdodCc6IHRoaXMub3V0T2ZCb3VuZHMucmlnaHQgPyB0cnVlIDogYm91bmRhcnkucmlnaHQgPiBlbGVtLnJpZ2h0LFxuICAgICAgICAnYm90dG9tJzogdGhpcy5vdXRPZkJvdW5kcy5ib3R0b20gPyB0cnVlIDogYm91bmRhcnkuYm90dG9tID4gZWxlbS5ib3R0b20sXG4gICAgICAgICdsZWZ0JzogdGhpcy5vdXRPZkJvdW5kcy5sZWZ0ID8gdHJ1ZSA6IGJvdW5kYXJ5LmxlZnQgPCBlbGVtLmxlZnRcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmluQm91bmRzKSB7XG4gICAgICAgIGlmICghcmVzdWx0LnRvcCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0udG9wIC0gYm91bmRhcnkudG9wKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5ib3R0b20pIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy55IC09IChlbGVtLmJvdHRvbSAtIGJvdW5kYXJ5LmJvdHRvbSkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQucmlnaHQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLnJpZ2h0IC0gYm91bmRhcnkucmlnaHQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmxlZnQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLmxlZnQgLSBib3VuZGFyeS5sZWZ0KSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXQgY3VycmVudCBvZmZzZXQgKi9cbiAgZ2V0Q3VycmVudE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyVHJhbnMudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHB1dEJhY2soKSB7XG4gICAgaWYgKHRoaXMuX3pJbmRleCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5fekluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuekluZGV4TW92aW5nKSB7XG4gICAgICBpZiAodGhpcy5vbGRaSW5kZXgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5vbGRaSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd6LWluZGV4Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuc3RvcHBlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGhlbHBlciBkaXY6XG4gICAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcblxuICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24odGhpcy5wb3NpdGlvbikpIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnNldCh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5lZGdlLmVtaXQodGhpcy5ib3VuZHNDaGVjaygpKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZW5kT2Zmc2V0LmVtaXQodGhpcy5jdXJyVHJhbnMudmFsdWUpKTtcblxuICAgICAgaWYgKHRoaXMudHJhY2tQb3NpdGlvbikge1xuICAgICAgICB0aGlzLm9sZFRyYW5zLmFkZCh0aGlzLnRlbXBUcmFucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG5cbiAgICAgIGlmICghdGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0OiBFdmVudFRhcmdldCwgZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGlzIHRoZSBlbGVtZW50IGNsaWNrZWQsIHRoZW4gY2hlY2tzIGVhY2ggY2hpbGQgZWxlbWVudCBvZiBlbGVtZW50IGFzIHdlbGxcbiAgICAvLyBJZ25vcmVzIGJ1dHRvbiBjbGlja3NcblxuICAgIC8vIElnbm9yZSBlbGVtZW50cyBvZiB0eXBlIGJ1dHRvblxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRhcmdldCB3YXMgZm91bmQsIHJldHVybiB0cnVlIChoYW5kbGUgd2FzIGZvdW5kKVxuICAgIGlmIChlbGVtZW50ID09PSB0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGl0ZXJhdGUgdGhpcyBlbGVtZW50cyBjaGlsZHJlblxuICAgIGZvciAobGV0IGNoaWxkIGluIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkKSkge1xuICAgICAgICBpZiAodGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRdKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHdhcyBub3QgZm91bmQgaW4gdGhpcyBsaW5lYWdlXG4gICAgLy8gTm90ZTogcmV0dXJuIGZhbHNlIGlzIGlnbm9yZSB1bmxlc3MgaXQgaXMgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnbW91c2Vkb3duJywgKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAvLyAxLiBza2lwIHJpZ2h0IGNsaWNrO1xuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyAyLiBpZiBoYW5kbGUgaXMgc2V0LCB0aGUgZWxlbWVudCBjYW4gb25seSBiZSBtb3ZlZCBieSBoYW5kbGVcbiAgICAgICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xuICAgICAgICBpZiAodGhpcy5oYW5kbGUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIHRoaXMuaGFuZGxlKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcmlnbmFsID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgICAgdGhpcy5waWNrVXAoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucHV0QmFjaygpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjMgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyNCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1vdmluZyAmJiB0aGlzLmFsbG93RHJhZykge1xuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBPbmx5IHdoZW4gc2hpZnQga2V5IGlzIHByZXNzZWRcbiAgICAgICAgICB0aGlzLl9pc0dyaWRTbmFwRW5hYmxlZCA9ICAhIWV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgICAgLy8gQWRkIGEgdHJhbnNwYXJlbnQgaGVscGVyIGRpdjpcbiAgICAgICAgICB0aGlzLl9oZWxwZXJCbG9jay5hZGQoKTtcbiAgICAgICAgICB0aGlzLm1vdmVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUhhbmRsZSB7XG4gIHByb3RlY3RlZCBfaGFuZGxlOiBFbGVtZW50O1xuICBwcml2YXRlIF9vblJlc2l6ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBFbGVtZW50LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNzczogc3RyaW5nLFxuICAgIHByaXZhdGUgb25Nb3VzZURvd246IGFueVxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoYW5kbGUgZGl2XG4gICAgbGV0IGhhbmRsZSA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgJ25nLXJlc2l6YWJsZS1oYW5kbGUnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsIGNzcyk7XG5cbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGFuZCByZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMuX29uUmVzaXplID0gKGV2ZW50KSA9PiB7IG9uTW91c2VEb3duKGV2ZW50LCB0aGlzKTsgfTtcbiAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgLy8gZG9uZVxuICAgIHRoaXMuX2hhbmRsZSA9IGhhbmRsZTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5faGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uUmVzaXplKTtcblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5faGFuZGxlKTtcbiAgICB9XG4gICAgdGhpcy5faGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLl9vblJlc2l6ZSA9IG51bGw7XG4gIH1cblxuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhbmRsZTtcbiAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU2l6ZSBpbXBsZW1lbnRzIElTaXplIHtcbiAgY29uc3RydWN0b3IocHVibGljIHdpZHRoOiBudW1iZXIsIHB1YmxpYyBoZWlnaHQ6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGdldEN1cnJlbnQoZWw6IEVsZW1lbnQpIHtcbiAgICBsZXQgc2l6ZSA9IG5ldyBTaXplKDAsIDApO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgc2l6ZS53aWR0aCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyksIDEwKTtcbiAgICAgICAgc2l6ZS5oZWlnaHQgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSwgMTApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShzOiBTaXplKSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKDAsIDApLnNldChzKTtcbiAgfVxuXG4gIHNldChzOiBJU2l6ZSkge1xuICAgIHRoaXMud2lkdGggPSBzLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gcy5oZWlnaHQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsXG4gIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLFxuICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSGVscGVyQmxvY2sgfSBmcm9tICcuL3dpZGdldHMvaGVscGVyLWJsb2NrJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZSB9IGZyb20gJy4vd2lkZ2V0cy9yZXNpemUtaGFuZGxlJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZVR5cGUgfSBmcm9tICcuL21vZGVscy9yZXNpemUtaGFuZGxlLXR5cGUnO1xuaW1wb3J0IHsgUG9zaXRpb24sIElQb3NpdGlvbiB9IGZyb20gJy4vbW9kZWxzL3Bvc2l0aW9uJztcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuL21vZGVscy9zaXplJztcbmltcG9ydCB7IElSZXNpemVFdmVudCB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1ldmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ1Jlc2l6YWJsZV0nLFxuICBleHBvcnRBczogJ25nUmVzaXphYmxlJ1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX3Jlc2l6YWJsZSA9IHRydWU7XG4gIHByaXZhdGUgX2hhbmRsZXM6IHsgW2tleTogc3RyaW5nXTogUmVzaXplSGFuZGxlIH0gPSB7fTtcbiAgcHJpdmF0ZSBfaGFuZGxlVHlwZTogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfaGFuZGxlUmVzaXppbmc6IFJlc2l6ZUhhbmRsZSA9IG51bGw7XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogeyAnbic6IGJvb2xlYW4sICdzJzogYm9vbGVhbiwgJ3cnOiBib29sZWFuLCAnZSc6IGJvb2xlYW4gfSA9IG51bGw7XG4gIHByaXZhdGUgX2FzcGVjdFJhdGlvID0gMDtcbiAgcHJpdmF0ZSBfY29udGFpbm1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ01vdXNlUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIE9yaWdpbmFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX29yaWdTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ1BvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBDdXJyZW50IFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2N1cnJTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VyclBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBJbml0aWFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2luaXRTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfaW5pdFBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBTbmFwIHRvIGdpcmQgKi9cbiAgcHJpdmF0ZSBfZ3JpZFNpemU6IElQb3NpdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfYm91bmRpbmc6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIxOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjI6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMzogKCkgPT4gdm9pZDtcblxuICAvKiogRGlzYWJsZXMgdGhlIHJlc2l6YWJsZSBpZiBzZXQgdG8gZmFsc2UuICovXG4gIEBJbnB1dCgpIHNldCBuZ1Jlc2l6YWJsZSh2OiBhbnkpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHYgIT09IG51bGwgJiYgdiAhPT0gJycpIHtcbiAgICAgIHRoaXMuX3Jlc2l6YWJsZSA9ICEhdjtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoaWNoIGhhbmRsZXMgY2FuIGJlIHVzZWQgZm9yIHJlc2l6aW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKiBbcnpIYW5kbGVzXSA9IFwiJ24sZSxzLHcsc2UsbmUsc3csbncnXCJcbiAgICogZXF1YWxzIHRvOiBbcnpIYW5kbGVzXSA9IFwiJ2FsbCdcIlxuICAgKlxuICAgKiAqL1xuICBASW5wdXQoKSByekhhbmRsZXM6IFJlc2l6ZUhhbmRsZVR5cGUgPSAnZSxzLHNlJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgYmUgY29uc3RyYWluZWQgdG8gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBib29sZWFuOiBXaGVuIHNldCB0byB0cnVlLCB0aGUgZWxlbWVudCB3aWxsIG1haW50YWluIGl0cyBvcmlnaW5hbCBhc3BlY3QgcmF0aW8uXG4gICAqICBudW1iZXI6IEZvcmNlIHRoZSBlbGVtZW50IHRvIG1haW50YWluIGEgc3BlY2lmaWMgYXNwZWN0IHJhdGlvIGR1cmluZyByZXNpemluZy5cbiAgICovXG4gIEBJbnB1dCgpIHJ6QXNwZWN0UmF0aW86IGJvb2xlYW4gfCBudW1iZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RyYWlucyByZXNpemluZyB0byB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgb3IgcmVnaW9uLlxuICAgKiAgTXVsdGlwbGUgdHlwZXMgc3VwcG9ydGVkOlxuICAgKiAgU2VsZWN0b3I6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmaXJzdCBlbGVtZW50IGZvdW5kIGJ5IHRoZSBzZWxlY3Rvci5cbiAgICogICAgICAgICAgICBJZiBubyBlbGVtZW50IGlzIGZvdW5kLCBubyBjb250YWlubWVudCB3aWxsIGJlIHNldC5cbiAgICogIEVsZW1lbnQ6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoaXMgZWxlbWVudC5cbiAgICogIFN0cmluZzogUG9zc2libGUgdmFsdWVzOiBcInBhcmVudFwiLlxuICAgKi9cbiAgQElucHV0KCkgcnpDb250YWlubWVudDogc3RyaW5nIHwgSFRNTEVsZW1lbnQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBTbmFwcyB0aGUgcmVzaXppbmcgZWxlbWVudCB0byBhIGdyaWQsIGV2ZXJ5IHggYW5kIHkgcGl4ZWxzLlxuICAgKiBBIG51bWJlciBmb3IgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IG9yIGFuIGFycmF5IHZhbHVlcyBsaWtlIFsgeCwgeSBdXG4gICAqL1xuICBASW5wdXQoKSByekdyaWQ6IG51bWJlciB8IG51bWJlcltdID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWluV2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5IZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHdpZHRoIHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1heFdpZHRoOiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBoZWlnaHQgdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4SGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdG9wIHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0b3AgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogSW5wdXQgY3NzIHNjYWxlIHRyYW5zZm9ybSBvZiBlbGVtZW50IHNvIHRyYW5zbGF0aW9ucyBhcmUgY29ycmVjdCAqL1xuICBASW5wdXQoKSBzY2FsZSA9IDE7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG5ldyBIZWxwZXJCbG9jayhlbC5uYXRpdmVFbGVtZW50LCByZW5kZXJlcik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3J6SGFuZGxlcyddICYmICFjaGFuZ2VzWydyekhhbmRsZXMnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXSAmJiAhY2hhbmdlc1sncnpBc3BlY3RSYXRpbyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVBc3BlY3RSYXRpbygpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekNvbnRhaW5tZW50J10gJiYgIWNoYW5nZXNbJ3J6Q29udGFpbm1lbnQnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29udGFpbm1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5kaXNwb3NlKCk7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBudWxsO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMSgpO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMigpO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9pbml0U2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2luaXRQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gcmVzZXQgc2l6ZSAqL1xuICBwdWJsaWMgcmVzZXRTaXplKCkge1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgc3RhdHVzICovXG4gIHB1YmxpYyBnZXRTdGF0dXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyUG9zIHx8ICF0aGlzLl9jdXJyU2l6ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZXNpemFibGUoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNsZWFyIGhhbmRsZXM6XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG5cbiAgICAvLyBjcmVhdGUgbmV3IG9uZXM6XG4gICAgaWYgKHRoaXMuX3Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgICB0aGlzLmNyZWF0ZUhhbmRsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBhc3BlY3QgKi9cbiAgcHJpdmF0ZSB1cGRhdGVBc3BlY3RSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpBc3BlY3RSYXRpbyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpZiAodGhpcy5yekFzcGVjdFJhdGlvICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCkge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9ICh0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2N1cnJTaXplLmhlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByID0gTnVtYmVyKHRoaXMucnpBc3BlY3RSYXRpbyk7XG4gICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IGlzTmFOKHIpID8gMCA6IHI7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgY29udGFpbm1lbnQgKi9cbiAgcHJpdmF0ZSB1cGRhdGVDb250YWlubWVudCgpIHtcbiAgICBpZiAoIXRoaXMucnpDb250YWlubWVudCkge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5yekNvbnRhaW5tZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpDb250YWlubWVudCA9PT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4odGhpcy5yekNvbnRhaW5tZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLnJ6Q29udGFpbm1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgaGFuZGxlIGRpdnMgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVzKCkge1xuICAgIGlmICghdGhpcy5yekhhbmRsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG1wSGFuZGxlVHlwZXM6IHN0cmluZ1tdO1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekhhbmRsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekhhbmRsZXMgPT09ICdhbGwnKSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ253JywgJ3N3J107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IHRoaXMucnpIYW5kbGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBkZWZhdWx0IGhhbmRsZSB0aGVtZTogbmctcmVzaXphYmxlLSR0eXBlLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgYG5nLXJlc2l6YWJsZS0ke3R5cGV9YCk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0bXBIYW5kbGVUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMucnpIYW5kbGVzKTtcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gY3VzdG9tIGhhbmRsZSB0aGVtZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIHRoaXMucnpIYW5kbGVzW3R5cGVdKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBhIGhhbmRsZSAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlOiBzdHJpbmcsIGNzczogc3RyaW5nKTogUmVzaXplSGFuZGxlIHtcbiAgICBjb25zdCBfZWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXR5cGUubWF0Y2goL14oc2V8c3d8bmV8bnd8bnxlfHN8dykkLykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgaGFuZGxlIHR5cGU6JywgdHlwZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc2l6ZUhhbmRsZShfZWwsIHRoaXMucmVuZGVyZXIsIHR5cGUsIGNzcywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlSGFuZGxlcygpIHtcbiAgICBmb3IgKGxldCB0eXBlIG9mIHRoaXMuX2hhbmRsZVR5cGUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0uZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZVR5cGUgPSBbXTtcbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gIH1cblxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgLy8gc2tpcCByaWdodCBjbGljaztcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBldmVudHNcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKCF0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuc3RhcnRSZXNpemUoaGFuZGxlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgLy8gMS4gc2tpcCByaWdodCBjbGljaztcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICAgICAgdGhpcy5zdG9wUmVzaXplKCk7XG4gICAgICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgLy8gMS4gc2tpcCByaWdodCBjbGljaztcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICAgICAgdGhpcy5zdG9wUmVzaXplKCk7XG4gICAgICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjMgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2Vtb3ZlJywgKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcgJiYgdGhpcy5fcmVzaXphYmxlICYmIHRoaXMuX29yaWdNb3VzZVBvcyAmJiB0aGlzLl9vcmlnUG9zICYmIHRoaXMuX29yaWdTaXplKSB7XG4gICAgICAgICAgdGhpcy5yZXNpemVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgICAgICB0aGlzLm9uUmVzaXppbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0UmVzaXplKGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX29yaWdTaXplID0gU2l6ZS5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IFBvc2l0aW9uLmdldEN1cnJlbnQoZWxtKTsgLy8geDogbGVmdCwgeTogdG9wXG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5fb3JpZ1NpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX29yaWdQb3MpO1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgdGhpcy5nZXRCb3VuZGluZygpO1xuICAgIH1cbiAgICB0aGlzLmdldEdyaWRTaXplKCk7XG5cbiAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLmFkZCgpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gaGFuZGxlO1xuICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKCk7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnJ6U3RhcnQuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wUmVzaXplKCkge1xuICAgIC8vIFJlbW92ZSB0aGUgaGVscGVyIGRpdjpcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMucnpTdG9wLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemluZyA9IG51bGw7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IG51bGw7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLnJlc2V0Qm91bmRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uUmVzaXppbmcoKSB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnJ6UmVzaXppbmcuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemluZ0V2ZW50KCk6IElSZXNpemVFdmVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvc3Q6IHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgIGhhbmRsZTogdGhpcy5faGFuZGxlUmVzaXppbmcgPyB0aGlzLl9oYW5kbGVSZXNpemluZy5lbCA6IG51bGwsXG4gICAgICBzaXplOiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9jdXJyU2l6ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHRcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0b3A6IHRoaXMuX2N1cnJQb3MueSxcbiAgICAgICAgbGVmdDogdGhpcy5fY3VyclBvcy54XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IHtcbiAgICAgIG46ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvbi8pLFxuICAgICAgczogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9zLyksXG4gICAgICB3OiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL3cvKSxcbiAgICAgIGU6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvZS8pXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplVG8ocDogUG9zaXRpb24pIHtcbiAgICBwLnN1YnRyYWN0KHRoaXMuX29yaWdNb3VzZVBvcyk7XG5cbiAgICBjb25zdCB0bXBYID0gTWF0aC5yb3VuZChwLnggLyB0aGlzLl9ncmlkU2l6ZS54IC8gdGhpcy5zY2FsZSkgKiB0aGlzLl9ncmlkU2l6ZS54O1xuICAgIGNvbnN0IHRtcFkgPSBNYXRoLnJvdW5kKHAueSAvIHRoaXMuX2dyaWRTaXplLnkgLyB0aGlzLnNjYWxlKSAqIHRoaXMuX2dyaWRTaXplLnk7XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgIC8vIG4sIG5lLCBud1xuICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgdG1wWTtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRtcFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24ucykge1xuICAgICAgLy8gcywgc2UsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0bXBZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSkge1xuICAgICAgLy8gZSwgbmUsIHNlXG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdG1wWDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAvLyB3LCBudywgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggLSB0bXBYO1xuICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgdG1wWDtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgdGhpcy5jaGVja1NpemUoKTtcbiAgICB0aGlzLmFkanVzdEJ5UmF0aW8oKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICBwcml2YXRlIGRvUmVzaXplKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2hlaWdodCcsIHRoaXMuX2N1cnJTaXplLmhlaWdodCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCB0aGlzLl9jdXJyU2l6ZS53aWR0aCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHRoaXMuX2N1cnJQb3MueCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgdGhpcy5fY3VyclBvcy55ICsgJ3B4Jyk7XG4gIH1cblxuICBwcml2YXRlIGFkanVzdEJ5UmF0aW8oKSB7XG4gICAgaWYgKHRoaXMuX2FzcGVjdFJhdGlvKSB7XG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLmUgfHwgdGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fYm91bmRpbmcud2lkdGggLSB0aGlzLl9ib3VuZGluZy5wciAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuX2JvdW5kaW5nLmhlaWdodCAtIHRoaXMuX2JvdW5kaW5nLnBiIC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCAtIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubiAmJiAodGhpcy5fY3VyclBvcy55ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0aGlzLl9vcmlnUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncgJiYgKHRoaXMuX2N1cnJQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVgpIDwgMCkge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSAtdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCArIHRoaXMuX29yaWdQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWF4V2lkdGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tTaXplKCkge1xuICAgIGNvbnN0IG1pbkhlaWdodCA9ICF0aGlzLnJ6TWluSGVpZ2h0ID8gMSA6IHRoaXMucnpNaW5IZWlnaHQ7XG4gICAgY29uc3QgbWluV2lkdGggPSAhdGhpcy5yek1pbldpZHRoID8gMSA6IHRoaXMucnpNaW5XaWR0aDtcblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPCBtaW5IZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1pbkhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSBtaW5IZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA8IG1pbldpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1pbldpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gbWluV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4SGVpZ2h0ICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IHRoaXMucnpNYXhIZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMucnpNYXhIZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdGhpcy5yek1heEhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhXaWR0aCAmJiB0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IHRoaXMucnpNYXhXaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLnJ6TWF4V2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSB0aGlzLnJ6TWF4V2lkdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Qm91bmRpbmcoKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9jb250YWlubWVudDtcbiAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgIGxldCBwID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgY29uc3QgbmF0aXZlRWwgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgbGV0IHRyYW5zZm9ybXMgPSBuYXRpdmVFbC5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKS5yZXBsYWNlKC9bXi1cXGQsXS9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgdGhpcy5fYm91bmRpbmcgPSB7fTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLndpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9ib3VuZGluZy5oZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wciA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSwgMTApO1xuICAgICAgdGhpcy5fYm91bmRpbmcucGIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1zLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSBwYXJzZUludCh0cmFuc2Zvcm1zWzRdLCAxMCk7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSBwYXJzZUludCh0cmFuc2Zvcm1zWzVdLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgaWYgKHAgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWwsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRCb3VuZGluZygpIHtcbiAgICBpZiAodGhpcy5fYm91bmRpbmcgJiYgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRhaW5tZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICB9XG4gICAgdGhpcy5fYm91bmRpbmcgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcmlkU2l6ZSgpIHtcbiAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZTpcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogMSwgeTogMSB9O1xuXG4gICAgaWYgKHRoaXMucnpHcmlkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucnpHcmlkID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWQsIHk6IHRoaXMucnpHcmlkIH07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yekdyaWQpKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZFswXSwgeTogdGhpcy5yekdyaWRbMV0gfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9hbmd1bGFyLWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vYW5ndWxhci1yZXNpemFibGUuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlLFxuICAgIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUsXG4gICAgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJEcmFnZ2FibGVNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiRGlyZWN0aXZlIiwiRWxlbWVudFJlZiIsIlJlbmRlcmVyMiIsIk5nWm9uZSIsIk91dHB1dCIsIklucHV0IiwidHNsaWJfMS5fX3ZhbHVlcyIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBS0E7UUFDRSxrQkFBbUIsQ0FBUyxFQUFTLENBQVM7WUFBM0IsTUFBQyxHQUFELENBQUMsQ0FBUTtZQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7U0FBSzs7Ozs7UUFFNUMsa0JBQVM7Ozs7WUFBaEIsVUFBaUIsQ0FBMEI7Z0JBQ3pDLElBQUksQ0FBQyxZQUFZLFVBQVUsRUFBRTtvQkFDM0IsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0M7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMvRTthQUNGOzs7OztRQUVNLG9CQUFXOzs7O1lBQWxCLFVBQW1CLEdBQUc7Z0JBQ3BCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQzlDOzs7OztRQUVNLG1CQUFVOzs7O1lBQWpCLFVBQWtCLEVBQVc7Z0JBQzNCLHFCQUFJLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLElBQUksTUFBTSxFQUFFO29CQUNWLHFCQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzdDLElBQUksUUFBUSxFQUFFO3dCQUNaLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDeEQsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUN4RDtvQkFDRCxPQUFPLEdBQUcsQ0FBQztpQkFDWjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7b0JBQ2hDLE9BQU8sSUFBSSxDQUFDO2lCQUNiO2FBQ0Y7Ozs7O1FBRU0sYUFBSTs7OztZQUFYLFVBQVksQ0FBVztnQkFDckIsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xDO1FBRUQsc0JBQUksMkJBQUs7OztnQkFBVDtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNqQzs7O1dBQUE7Ozs7O1FBRUQsc0JBQUc7Ozs7WUFBSCxVQUFJLENBQVk7Z0JBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZCxPQUFPLElBQUksQ0FBQzthQUNiOzs7OztRQUVELDJCQUFROzs7O1lBQVIsVUFBUyxDQUFZO2dCQUNuQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sSUFBSSxDQUFDO2FBQ2I7Ozs7UUFFRCx3QkFBSzs7O1lBQUw7Z0JBQ0UsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1gsT0FBTyxJQUFJLENBQUM7YUFDYjs7Ozs7UUFFRCxzQkFBRzs7OztZQUFILFVBQUksQ0FBWTtnQkFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDO2FBQ2I7dUJBbEVIO1FBbUVDOzs7Ozs7SUNqRUQsSUFBQTtRQUlFLHFCQUNZLE1BQWUsRUFDZixRQUFtQjtZQURuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1lBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBVzswQkFKZCxLQUFLOztZQU9wQixxQkFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM1QyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztZQUd2QyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztTQUN2Qjs7OztRQUVELHlCQUFHOzs7WUFBSDs7Z0JBRUUsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztpQkFDcEI7YUFDRjs7OztRQUVELDRCQUFNOzs7WUFBTjtnQkFDRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztpQkFDckI7YUFDRjs7OztRQUVELDZCQUFPOzs7WUFBUDtnQkFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDckI7UUFFRCxzQkFBSSwyQkFBRTs7O2dCQUFOO2dCQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNyQjs7O1dBQUE7MEJBN0NIO1FBOENDLENBQUE7Ozs7OztBQzlDRDtRQXFHRSxtQ0FBb0IsRUFBYyxFQUNkLFVBQ0E7WUFGQSxPQUFFLEdBQUYsRUFBRSxDQUFZO1lBQ2QsYUFBUSxHQUFSLFFBQVE7WUFDUixTQUFJLEdBQUosSUFBSTs2QkF4RkosSUFBSTswQkFDUCxLQUFLOzJCQUNNLElBQUk7NEJBQ2IsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDakIsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDbEIsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs2QkFDbEIsRUFBRTsyQkFDSixFQUFFO2lDQUNJLEtBQUs7c0NBS0EsS0FBSzs7Ozs7Z0NBTUUsSUFBSTsyQkFFcEIsSUFBSUEsaUJBQVksRUFBTzsyQkFDdkIsSUFBSUEsaUJBQVksRUFBTzt3QkFDMUIsSUFBSUEsaUJBQVksRUFBTzs7OzsrQkFTakI7Z0JBQ3JCLEdBQUcsRUFBRSxLQUFLO2dCQUNWLEtBQUssRUFBRSxLQUFLO2dCQUNaLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2FBQ1o7Ozs7NEJBR21CLENBQUM7Ozs7NEJBV0QsS0FBSzs7OztpQ0FHQSxJQUFJOzs7O3lCQUdaLENBQUM7Ozs7dUNBR2EsS0FBSzs7Ozs0QkFHTCxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7OztnQ0FHcEIsSUFBSUEsaUJBQVksRUFBYTs7Ozs2QkFHaEMsSUFBSUEsaUJBQVksRUFBYTtZQW9CakQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2pFO1FBNUNELHNCQUFhLDZDQUFNOzs7Ozs7Z0JBQW5CLFVBQW9CLE9BQWU7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDeEI7OztXQUFBO1FBc0JELHNCQUNJLGtEQUFXOzs7O2dCQURmLFVBQ2dCLE9BQVk7Z0JBQzFCLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxFQUFFLEVBQUU7b0JBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFFM0IscUJBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFFaEUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7cUJBQ2pEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztxQkFDcEQ7aUJBQ0Y7YUFDRjs7O1dBQUE7Ozs7UUFRRCw0Q0FBUTs7O1lBQVI7Z0JBQ0UsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUVuQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLHFCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztpQkFDakQ7Z0JBRUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3RCOzs7O1FBRUQsK0NBQVc7OztZQUFYO2dCQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN6Qjs7Ozs7UUFFRCwrQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO29CQUMvRCxxQkFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQztvQkFFekMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ2hCLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3RCOzZCQUFNOzRCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7eUJBQ3ZCO3dCQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztxQkFDbEI7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7cUJBQzNCO2lCQUNGO2FBQ0Y7Ozs7UUFFRCxtREFBZTs7O1lBQWY7Z0JBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDeEI7YUFDRjs7OztRQUVELGlEQUFhOzs7WUFBYjtnQkFDRSxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3ZCO2dCQUNELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQjs7Ozs7UUFFTywwQ0FBTTs7OztzQkFBQyxDQUFXOztnQkFDeEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNoQixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO29CQUMvRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBRWpCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUEsQ0FBQyxDQUFDO3FCQUN6RDtvQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBQSxDQUFDLENBQUM7aUJBQ25FOzs7OztRQUdLLDZDQUFTOzs7O2dCQUVmLHFCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEQscUJBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztnQkFHcEQsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7b0JBQ2hELFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDcEUsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2lCQUNyRTtnQkFFRCxxQkFBSSxLQUFLLEdBQUcsZUFBYSxVQUFVLFlBQU8sVUFBVSxRQUFLLENBQUM7Z0JBRTFELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDdEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Z0JBR3JFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDOzs7OztRQUd4QiwwQ0FBTTs7Ozs7O2dCQUVaLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFFOUYsSUFBSSxNQUFNLEVBQUU7b0JBQ1YsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ25HO2dCQUVELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDN0U7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFBLENBQUMsQ0FBQztvQkFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ3BCOzs7OztRQUdILCtDQUFXOzs7WUFBWDtnQkFDRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2YscUJBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztvQkFDbkQscUJBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUM7b0JBQ3pELHFCQUFJLE1BQU0sR0FBRzt3QkFDWCxLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUc7d0JBQzVELE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSzt3QkFDcEUsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNO3dCQUN4RSxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7cUJBQ2pFLENBQUM7b0JBRUYsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTs0QkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO3lCQUM1RDt3QkFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTs0QkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQzt5QkFDbEU7d0JBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7NEJBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7eUJBQ2hFO3dCQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzRCQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO3lCQUM5RDt3QkFFRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7cUJBQ2xCO29CQUVELE9BQU8sTUFBTSxDQUFDO2lCQUNmO2FBQ0Y7Ozs7OztRQUdELG9EQUFnQjs7OztZQUFoQjtnQkFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO2FBQzdCOzs7O1FBRU8sMkNBQU87Ozs7O2dCQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDeEU7cUJBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUM1QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7d0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzFFO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3ZEO2lCQUNGO2dCQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBQSxDQUFDLENBQUM7O29CQUc5RCxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUUzQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ3RCLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7NEJBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDbEM7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt5QkFDdkI7d0JBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztxQkFDNUI7b0JBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBQSxDQUFDLENBQUM7cUJBQ3pEO29CQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBQSxDQUFDLENBQUM7b0JBRS9ELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUNuQztvQkFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDdkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUNsQjtpQkFDRjs7Ozs7OztRQUdILHFEQUFpQjs7Ozs7WUFBakIsVUFBa0IsTUFBbUIsRUFBRSxPQUFnQjs7OztnQkFLckQsSUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDaEMsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7O2dCQUdELElBQUksT0FBTyxLQUFLLE1BQU0sRUFBRTtvQkFDdEIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7O2dCQUdELEtBQUsscUJBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7b0JBQ2xDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQzFDLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7NEJBQzNELE9BQU8sSUFBSSxDQUFDO3lCQUNiO3FCQUNGO2lCQUNGOzs7Z0JBSUQsT0FBTyxLQUFLLENBQUM7YUFDZDs7OztRQUVPLCtDQUFXOzs7OztnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDMUIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxVQUFDLEtBQThCOzt3QkFFOUcsSUFBSSxLQUFLLFlBQVksVUFBVSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUNyRCxPQUFPO3lCQUNSOzt3QkFFRCxxQkFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDO3dCQUM5QyxJQUFJLEtBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQzdFLE9BQU87eUJBQ1I7d0JBRUQsSUFBSSxLQUFJLENBQUMsbUJBQW1CLEVBQUU7NEJBQzVCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQzs0QkFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3lCQUN4Qjt3QkFFRCxLQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3pDLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDZixDQUFDLENBQUM7b0JBQ0gsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUU7d0JBQ2xFLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztxQkFDaEIsQ0FBQyxDQUFDO29CQUNILEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFO3dCQUNyRSxLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQ2hCLENBQUMsQ0FBQztvQkFDSCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxVQUFDLEtBQThCO3dCQUNuRyxJQUFJLEtBQUksQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLFNBQVMsRUFBRTs0QkFDakMsSUFBSSxLQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0NBQzVCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQ0FDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzZCQUN4Qjs7OzRCQUdELEtBQUksQ0FBQyxrQkFBa0IsR0FBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQzs7OzRCQUc1QyxLQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDOzRCQUN4QixLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt5QkFDeEM7cUJBQ0YsQ0FBQyxDQUFDO2lCQUNKLENBQUMsQ0FBQzs7O29CQXBYTkMsY0FBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxlQUFlO3dCQUN6QixRQUFRLEVBQUUsYUFBYTtxQkFDeEI7Ozs7O3dCQVpZQyxlQUFVO3dCQUFFQyxjQUFTO3dCQUdOQyxXQUFNOzs7OzhCQWdDL0JDLFdBQU07OEJBQ05BLFdBQU07MkJBQ05BLFdBQU07NkJBR05DLFVBQUs7NkJBR0xBLFVBQUs7a0NBR0xBLFVBQUs7K0JBUUxBLFVBQUs7bUNBR0xBLFVBQUs7NkJBR0xBLFVBQUs7K0JBS0xBLFVBQUs7b0NBR0xBLFVBQUs7NEJBR0xBLFVBQUs7MENBR0xBLFVBQUs7K0JBR0xBLFVBQUs7bUNBR0xELFdBQU07Z0NBR05BLFdBQU07a0NBRU5DLFVBQUs7O3dDQXRGUjs7O0lDQUE7Ozs7Ozs7Ozs7Ozs7O0FBY0Esc0JBc0Z5QixDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDO1lBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNO29CQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDM0M7U0FDSixDQUFDO0lBQ04sQ0FBQzs7Ozs7O0lDM0dELElBQUE7UUFJRSxzQkFDWSxNQUFlLEVBQ2YsUUFBbUIsRUFDdEIsTUFDQSxLQUNDO1lBTFYsaUJBdUJDO1lBdEJXLFdBQU0sR0FBTixNQUFNLENBQVM7WUFDZixhQUFRLEdBQVIsUUFBUSxDQUFXO1lBQ3RCLFNBQUksR0FBSixJQUFJO1lBQ0osUUFBRyxHQUFILEdBQUc7WUFDRixnQkFBVyxHQUFYLFdBQVc7O1lBR25CLHFCQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFDakQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O1lBRy9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzVCOztZQUdELElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBQyxLQUFLLElBQU8sV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDMUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O1lBR3JELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOzs7O1FBRUQsOEJBQU87OztZQUFQO2dCQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFOUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ3ZCO1FBRUQsc0JBQUksNEJBQUU7OztnQkFBTjtnQkFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDckI7OztXQUFBOzJCQTNDSDtRQTRDQyxDQUFBOzs7Ozs7SUN2Q0QsSUFBQTtRQUNFLGNBQW1CLEtBQWEsRUFBUyxNQUFjO1lBQXBDLFVBQUssR0FBTCxLQUFLLENBQVE7WUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO1NBQUs7Ozs7O1FBRXJELGVBQVU7Ozs7WUFBakIsVUFBa0IsRUFBVztnQkFDM0IscUJBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFMUIsSUFBSSxNQUFNLEVBQUU7b0JBQ1YscUJBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDN0MsSUFBSSxRQUFRLEVBQUU7d0JBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUM5RCxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7cUJBQ2pFO29CQUNELE9BQU8sSUFBSSxDQUFDO2lCQUNiO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDaEMsT0FBTyxJQUFJLENBQUM7aUJBQ2I7YUFDRjs7Ozs7UUFFTSxTQUFJOzs7O1lBQVgsVUFBWSxDQUFPO2dCQUNqQixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUI7Ozs7O1FBRUQsa0JBQUc7Ozs7WUFBSCxVQUFJLENBQVE7Z0JBQ1YsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7bUJBaENIO1FBaUNDLENBQUE7Ozs7Ozs7UUNzRkMsbUNBQW9CLEVBQTJCLEVBQzNCLFVBQ0E7WUFGQSxPQUFFLEdBQUYsRUFBRSxDQUF5QjtZQUMzQixhQUFRLEdBQVIsUUFBUTtZQUNSLFNBQUksR0FBSixJQUFJOzhCQXRHSCxJQUFJOzRCQUMyQixFQUFFOytCQUN0QixFQUFFO21DQUNNLElBQUk7OEJBQ3FDLElBQUk7Z0NBQzlELENBQUM7Z0NBQ1ksSUFBSTtpQ0FDTixJQUFJOzs7OzZCQUdaLElBQUk7NEJBQ0QsSUFBSTs7Ozs2QkFHUCxJQUFJOzRCQUNELElBQUk7Ozs7NkJBR1AsSUFBSTs0QkFDRCxJQUFJOzs7OzZCQUdGLElBQUk7NkJBRVYsSUFBSTs7Ozs7Z0NBTU8sSUFBSTs7Ozs7Ozs7OzZCQW9CRCxRQUFROzs7Ozs7O2lDQVFKLEtBQUs7Ozs7Ozs7OztpQ0FVRCxJQUFJOzs7OzswQkFNZCxJQUFJOzs7OzhCQUdYLElBQUk7Ozs7K0JBR0gsSUFBSTs7Ozs4QkFHTCxJQUFJOzs7OytCQUdILElBQUk7Ozs7MkJBR2YsSUFBSU4saUJBQVksRUFBZ0I7Ozs7OEJBRzdCLElBQUlBLGlCQUFZLEVBQWdCOzs7OzBCQUdwQyxJQUFJQSxpQkFBWSxFQUFnQjs7Ozt5QkFHbEMsQ0FBQztZQUtoQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDakU7UUFwRUQsc0JBQWEsa0RBQVc7Ozs7OztnQkFBeEIsVUFBeUIsQ0FBTTtnQkFDN0IsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRTtvQkFDN0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3hCO2FBQ0Y7OztXQUFBOzs7OztRQWlFRCwrQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO29CQUNqRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3hCO2dCQUVELElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFO29CQUN6RSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztpQkFDMUI7Z0JBRUQsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7b0JBQ3pFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2lCQUMxQjthQUNGOzs7O1FBRUQsNENBQVE7OztZQUFSO2dCQUNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3hCOzs7O1FBRUQsK0NBQVc7OztZQUFYO2dCQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3pCOzs7O1FBRUQsbURBQWU7OztZQUFmO2dCQUNFLHFCQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUMxQjs7Ozs7UUFHTSw2Q0FBUzs7Ozs7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7Ozs7UUFJWCw2Q0FBUzs7Ozs7Z0JBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNyQyxPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFFRCxPQUFPO29CQUNMLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLO3dCQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO3FCQUM5QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDdEI7aUJBQ0YsQ0FBQzs7Ozs7UUFHSSxtREFBZTs7OztnQkFDckIscUJBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDOztnQkFHdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7O2dCQUdyQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0Qjs7Ozs7O1FBSUsscURBQWlCOzs7OztnQkFDdkIsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFO29CQUMzQyxJQUFJLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7d0JBQy9DLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDcEU7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7cUJBQ3ZCO2lCQUNGO3FCQUFNO29CQUNMLHFCQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN0Qzs7Ozs7O1FBSUsscURBQWlCOzs7OztnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUN6QixPQUFPO2lCQUNSO2dCQUVELElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRTtvQkFDMUMsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRTt3QkFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7cUJBQ3pEO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBYyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7cUJBQzdFO2lCQUNGO3FCQUFNO29CQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztpQkFDeEM7Ozs7OztRQUlLLGlEQUFhOzs7OztnQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ25CLE9BQU87aUJBQ1I7Z0JBRUQscUJBQUksY0FBd0IsQ0FBQztnQkFDN0IsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFFO29CQUN0QyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO3dCQUM1QixjQUFjLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQy9EO3lCQUFNO3dCQUNMLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUM1RTs7d0JBRUQsS0FBaUIsSUFBQSxtQkFBQU8sU0FBQSxjQUFjLENBQUEsOENBQUE7NEJBQTFCLElBQUksSUFBSSwyQkFBQTs7NEJBRVgscUJBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsa0JBQWdCLElBQU0sQ0FBQyxDQUFDOzRCQUNuRSxJQUFJLE1BQU0sRUFBRTtnQ0FDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7NkJBQzlCO3lCQUNGOzs7Ozs7Ozs7Ozs7Ozs7aUJBQ0Y7cUJBQU07b0JBQ0wsY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzt3QkFDN0MsS0FBaUIsSUFBQSxtQkFBQUEsU0FBQSxjQUFjLENBQUEsOENBQUE7NEJBQTFCLElBQUksSUFBSSwyQkFBQTs7NEJBRVgscUJBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzRCQUNqRSxJQUFJLE1BQU0sRUFBRTtnQ0FDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7NkJBQzlCO3lCQUNGOzs7Ozs7Ozs7Ozs7Ozs7aUJBQ0Y7Ozs7Ozs7OztRQUtLLHNEQUFrQjs7Ozs7O3NCQUFDLElBQVksRUFBRSxHQUFXO2dCQUNsRCxxQkFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBRWxDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLEVBQUU7b0JBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzVDLE9BQU8sSUFBSSxDQUFDO2lCQUNiO2dCQUVELE9BQU8sSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7OztRQUc5RSxpREFBYTs7Ozs7b0JBQ25CLEtBQWlCLElBQUEsS0FBQUEsU0FBQSxJQUFJLENBQUMsV0FBVyxDQUFBLGdCQUFBO3dCQUE1QixJQUFJLElBQUksV0FBQTt3QkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO3FCQUMvQjs7Ozs7Ozs7Ozs7Ozs7O2dCQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7UUFHckIsK0NBQVc7Ozs7O1lBQVgsVUFBWSxLQUE4QixFQUFFLE1BQW9COztnQkFFOUQsSUFBSSxLQUFLLFlBQVksVUFBVSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNyRCxPQUFPO2lCQUNSOztnQkFHRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDMUI7YUFDRjs7OztRQUVPLCtDQUFXOzs7OztnQkFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDMUIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUU7O3dCQUVsRSxJQUFJLEtBQUksQ0FBQyxlQUFlLEVBQUU7NEJBQ3hCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs0QkFDbEIsS0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7eUJBQzNCO3FCQUNGLENBQUMsQ0FBQztvQkFDSCxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTs7d0JBRXJFLElBQUksS0FBSSxDQUFDLGVBQWUsRUFBRTs0QkFDeEIsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOzRCQUNsQixLQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzt5QkFDM0I7cUJBQ0YsQ0FBQyxDQUFDO29CQUNILEtBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFVBQUMsS0FBOEI7d0JBQ25HLElBQUksS0FBSSxDQUFDLGVBQWUsSUFBSSxLQUFJLENBQUMsVUFBVSxJQUFJLEtBQUksQ0FBQyxhQUFhLElBQUksS0FBSSxDQUFDLFFBQVEsSUFBSSxLQUFJLENBQUMsU0FBUyxFQUFFOzRCQUNwRyxLQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDekMsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3lCQUNuQjtxQkFDRixDQUFDLENBQUM7aUJBQ0osQ0FBQyxDQUFDOzs7Ozs7UUFHRywrQ0FBVzs7OztzQkFBQyxNQUFvQjs7Z0JBQ3RDLHFCQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzdDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNwQjtnQkFDRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7O2dCQUduQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztnQkFDOUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsR0FBQSxDQUFDLENBQUM7Ozs7O1FBRzFELDhDQUFVOzs7Ozs7Z0JBRWhCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFBLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0Qjs7Ozs7UUFHSyw4Q0FBVTs7Ozs7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFBLENBQUMsQ0FBQzs7Ozs7UUFHN0Qsb0RBQWdCOzs7O2dCQUN0QixPQUFPO29CQUNMLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7b0JBQzNCLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxHQUFHLElBQUk7b0JBQzdELElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLO3dCQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO3FCQUM5QjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDdEI7aUJBQ0YsQ0FBQzs7Ozs7UUFHSSxtREFBZTs7OztnQkFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRztvQkFDaEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO29CQUN6QyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7b0JBQ3pDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztvQkFDekMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO2lCQUMxQyxDQUFDOzs7Ozs7UUFHSSw0Q0FBUTs7OztzQkFBQyxDQUFXO2dCQUMxQixDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFL0IscUJBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hGLHFCQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUVoRixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFOztvQkFFckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ3REO3FCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7O29CQUU1QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7aUJBQ3REO2dCQUVELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7O29CQUVyQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7aUJBQ3BEO3FCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7O29CQUU1QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7b0JBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDMUM7Z0JBRUQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOzs7OztRQUdWLDRDQUFROzs7O2dCQUNkLHFCQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQzs7Ozs7UUFHM0QsaURBQWE7Ozs7Z0JBQ25CLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztxQkFDbEU7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztxQkFDbEU7aUJBQ0Y7Ozs7O1FBR0ssK0NBQVc7Ozs7Z0JBQ2pCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDckIscUJBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFDekgscUJBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFFMUgsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRTt3QkFDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzt3QkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7cUJBQzdGO29CQUVELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsSUFBSSxDQUFDLEVBQUU7d0JBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7d0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO3FCQUMzRjtvQkFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRTt3QkFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO3FCQUNqQztvQkFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTt3QkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO3FCQUNuQztpQkFDRjs7Ozs7UUFHSyw2Q0FBUzs7OztnQkFDZixxQkFBTSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUMzRCxxQkFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUV4RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtvQkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO29CQUVsQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO3dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQztxQkFDekU7aUJBQ0Y7Z0JBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUU7b0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztvQkFFaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7cUJBQ3ZFO2lCQUNGO2dCQUVELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUV6QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO3dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ2hGO2lCQUNGO2dCQUVELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUM3RCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUV2QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO3dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQzlFO2lCQUNGOzs7OztRQUdLLCtDQUFXOzs7O2dCQUNqQixxQkFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDN0IscUJBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxRQUFRLEVBQUU7b0JBQ1oscUJBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFFOUMscUJBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRSxxQkFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUUzRixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDN0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUU5RSxJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO3dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3dCQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUN6RDt5QkFBTTt3QkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7d0JBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztxQkFDL0I7b0JBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUVoRSxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7d0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQ3BEO2lCQUNGOzs7OztRQUdLLGlEQUFhOzs7O2dCQUNuQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO29CQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDbkU7Z0JBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Ozs7O1FBR2hCLCtDQUFXOzs7OztnQkFFakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUVoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2YsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFO3dCQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDckQ7eUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7cUJBQzNEO2lCQUNGOzs7b0JBeGhCSk4sY0FBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxlQUFlO3dCQUN6QixRQUFRLEVBQUUsYUFBYTtxQkFDeEI7Ozs7O3dCQWhCWUMsZUFBVTt3QkFBRUMsY0FBUzt3QkFHTkMsV0FBTTs7OztrQ0FtRC9CRSxVQUFLO2dDQWNMQSxVQUFLO29DQVFMQSxVQUFLO29DQVVMQSxVQUFLOzZCQU1MQSxVQUFLO2lDQUdMQSxVQUFLO2tDQUdMQSxVQUFLO2lDQUdMQSxVQUFLO2tDQUdMQSxVQUFLOzhCQUdMRCxXQUFNO2lDQUdOQSxXQUFNOzZCQUdOQSxXQUFNOzRCQUdOQyxVQUFLOzt3Q0FySFI7Ozs7Ozs7QUNBQTs7OztvQkFJQ0UsYUFBUSxTQUFDO3dCQUNSLE9BQU8sRUFBRSxFQUNSO3dCQUNELFlBQVksRUFBRTs0QkFDWix5QkFBeUI7NEJBQ3pCLHlCQUF5Qjt5QkFDMUI7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLHlCQUF5Qjs0QkFDekIseUJBQXlCO3lCQUMxQjtxQkFDRjs7cUNBZkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9