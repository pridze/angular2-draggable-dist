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
        function AngularDraggableDirective(el, renderer, zone) {
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
                    this.zone.run(function () {
                        return _this.movingOffset.emit({
                            x: _this.tempTrans.x + _this.oldTrans.x,
                            y: _this.tempTrans.y + _this.oldTrans.y
                        });
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
                    this.zone.run(function () {
                        return _this.endOffset.emit({
                            x: _this.tempTrans.x + _this.oldTrans.x,
                            y: _this.tempTrans.y + _this.oldTrans.y
                        });
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItZHJhZ2dhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9tb2RlbHMvcG9zaXRpb24udHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9oZWxwZXItYmxvY2sudHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIixudWxsLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9yZXNpemUtaGFuZGxlLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9zaXplLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHBvcy54ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIHBvcy55ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBQb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oMCwgMCkuc2V0KHApO1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggPSBwLng7XG4gICAgdGhpcy55ID0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEhlbHBlckJsb2NrIHtcbiAgcHJvdGVjdGVkIF9oZWxwZXI6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX2FkZGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoZWxwZXIgZGl2XG4gICAgbGV0IGhlbHBlciA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnYmFja2dyb3VuZC1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3RvcCcsICcwJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnbGVmdCcsICcwJyk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGVscGVyID0gaGVscGVyO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICF0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hlbHBlciA9IG51bGw7XG4gICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVscGVyO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIzOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBAT3V0cHV0KCkgc3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3RvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBNYWtlIHRoZSBoYW5kbGUgSFRNTEVsZW1lbnQgZHJhZ2dhYmxlICovXG4gIEBJbnB1dCgpIGhhbmRsZTogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFNldCB0aGUgYm91bmRzIEhUTUxFbGVtZW50ICovXG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIExpc3Qgb2YgYWxsb3dlZCBvdXQgb2YgYm91bmRzIGVkZ2VzICoqL1xuICBASW5wdXQoKSBvdXRPZkJvdW5kcyA9IHtcbiAgICB0b3A6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBib3R0b206IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFJvdW5kIHRoZSBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgKi9cbiAgQElucHV0KCkgZ3JpZFNpemUgPSAxO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHpJbmRleE1vdmluZzogc3RyaW5nO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIG5vdCBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSBzZXQgekluZGV4KHNldHRpbmc6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHNldHRpbmcpO1xuICAgIHRoaXMuX3pJbmRleCA9IHNldHRpbmc7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdG8gbGltaXQgdGhlIGVsZW1lbnQgc3RheSBpbiB0aGUgYm91bmRzICovXG4gIEBJbnB1dCgpIGluQm91bmRzID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIHVzZSBpdCdzIHByZXZpb3VzIGRyYWcgcG9zaXRpb24gb24gYSBuZXcgZHJhZyBldmVudC4gKi9cbiAgQElucHV0KCkgdHJhY2tQb3NpdGlvbiA9IHRydWU7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHByZXZlbnQgZGVmYXVsdCBldmVudCAqL1xuICBASW5wdXQoKSBwcmV2ZW50RGVmYXVsdEV2ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFNldCBpbml0aWFsIHBvc2l0aW9uIGJ5IG9mZnNldHMgKi9cbiAgQElucHV0KCkgcG9zaXRpb246IElQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBtb3ZpbmcgKi9cbiAgQE91dHB1dCgpIG1vdmluZ09mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBwdXQgYmFjayAqL1xuICBAT3V0cHV0KCkgZW5kT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG5nRHJhZ2dhYmxlKHNldHRpbmc6IGFueSkge1xuICAgIGlmIChzZXR0aW5nICE9PSB1bmRlZmluZWQgJiYgc2V0dGluZyAhPT0gbnVsbCAmJiBzZXR0aW5nICE9PSAnJykge1xuICAgICAgdGhpcy5hbGxvd0RyYWcgPSAhIXNldHRpbmc7XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5oYW5kbGUgPyB0aGlzLmhhbmRsZSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMubW92aW5nT2Zmc2V0LmVtaXQoe1xuICAgICAgICB4OiB0aGlzLnRlbXBUcmFucy54ICsgdGhpcy5vbGRUcmFucy54LFxuICAgICAgICB5OiB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG5cbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmVuZE9mZnNldC5lbWl0KHtcbiAgICAgICAgeDogdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueCxcbiAgICAgICAgeTogdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueVxuICAgICAgfSkpO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0hhbmRsZVRhcmdldCh0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaXMgdGhlIGVsZW1lbnQgY2xpY2tlZCwgdGhlbiBjaGVja3MgZWFjaCBjaGlsZCBlbGVtZW50IG9mIGVsZW1lbnQgYXMgd2VsbFxuICAgIC8vIElnbm9yZXMgYnV0dG9uIGNsaWNrc1xuXG4gICAgLy8gSWdub3JlIGVsZW1lbnRzIG9mIHR5cGUgYnV0dG9uXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IHdhcyBmb3VuZCwgcmV0dXJuIHRydWUgKGhhbmRsZSB3YXMgZm91bmQpXG4gICAgaWYgKGVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzaXZlbHkgaXRlcmF0ZSB0aGlzIGVsZW1lbnRzIGNoaWxkcmVuXG4gICAgZm9yIChsZXQgY2hpbGQgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgZWxlbWVudC5jaGlsZHJlbltjaGlsZF0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGxpbmVhZ2VcbiAgICAvLyBOb3RlOiByZXR1cm4gZmFsc2UgaXMgaWdub3JlIHVubGVzcyBpdCBpcyB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnBpY2tVcCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnB1dEJhY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICAgICAgdGhpcy5tb3ZlVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGUge1xuICBwcm90ZWN0ZWQgX2hhbmRsZTogRWxlbWVudDtcbiAgcHJpdmF0ZSBfb25SZXNpemU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjc3M6IHN0cmluZyxcbiAgICBwcml2YXRlIG9uTW91c2VEb3duOiBhbnlcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGFuZGxlIGRpdlxuICAgIGxldCBoYW5kbGUgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtaGFuZGxlJyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCBjc3MpO1xuXG4gICAgLy8gYXBwZW5kIGRpdiB0byBwYXJlbnRcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhbmQgcmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLl9vblJlc2l6ZSA9IChldmVudCkgPT4geyBvbk1vdXNlRG93bihldmVudCwgdGhpcyk7IH07XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uUmVzaXplKTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oYW5kbGUgPSBoYW5kbGU7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hhbmRsZSk7XG4gICAgfVxuICAgIHRoaXMuX2hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fb25SZXNpemUgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGU7XG4gIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVNpemUge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFNpemUgaW1wbGVtZW50cyBJU2l6ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB3aWR0aDogbnVtYmVyLCBwdWJsaWMgaGVpZ2h0OiBudW1iZXIpIHsgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHNpemUgPSBuZXcgU2l6ZSgwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHNpemUud2lkdGggPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCd3aWR0aCcpLCAxMCk7XG4gICAgICAgIHNpemUuaGVpZ2h0ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0JyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdOb3QgU3VwcG9ydGVkIScpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNvcHkoczogU2l6ZSkge1xuICAgIHJldHVybiBuZXcgU2l6ZSgwLCAwKS5zZXQocyk7XG4gIH1cblxuICBzZXQoczogSVNpemUpIHtcbiAgICB0aGlzLndpZHRoID0gcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHMuaGVpZ2h0O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEhlbHBlckJsb2NrIH0gZnJvbSAnLi93aWRnZXRzL2hlbHBlci1ibG9jayc7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGUgfSBmcm9tICcuL3dpZGdldHMvcmVzaXplLWhhbmRsZSc7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGVUeXBlIH0gZnJvbSAnLi9tb2RlbHMvcmVzaXplLWhhbmRsZS10eXBlJztcbmltcG9ydCB7IFBvc2l0aW9uLCBJUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi9tb2RlbHMvc2l6ZSc7XG5pbXBvcnQgeyBJUmVzaXplRXZlbnQgfSBmcm9tICcuL21vZGVscy9yZXNpemUtZXZlbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdSZXNpemFibGVdJyxcbiAgZXhwb3J0QXM6ICduZ1Jlc2l6YWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIF9yZXNpemFibGUgPSB0cnVlO1xuICBwcml2YXRlIF9oYW5kbGVzOiB7IFtrZXk6IHN0cmluZ106IFJlc2l6ZUhhbmRsZSB9ID0ge307XG4gIHByaXZhdGUgX2hhbmRsZVR5cGU6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgX2hhbmRsZVJlc2l6aW5nOiBSZXNpemVIYW5kbGUgPSBudWxsO1xuICBwcml2YXRlIF9kaXJlY3Rpb246IHsgJ24nOiBib29sZWFuLCAncyc6IGJvb2xlYW4sICd3JzogYm9vbGVhbiwgJ2UnOiBib29sZWFuIH0gPSBudWxsO1xuICBwcml2YXRlIF9hc3BlY3RSYXRpbyA9IDA7XG4gIHByaXZhdGUgX2NvbnRhaW5tZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XG4gIHByaXZhdGUgX29yaWdNb3VzZVBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBPcmlnaW5hbCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9vcmlnU2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX29yaWdQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogQ3VycmVudCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9jdXJyU2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX2N1cnJQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogSW5pdGlhbCBTaXplIGFuZCBQb3NpdGlvbiAqL1xuICBwcml2YXRlIF9pbml0U2l6ZTogU2l6ZSA9IG51bGw7XG4gIHByaXZhdGUgX2luaXRQb3M6IFBvc2l0aW9uID0gbnVsbDtcblxuICAvKiogU25hcCB0byBnaXJkICovXG4gIHByaXZhdGUgX2dyaWRTaXplOiBJUG9zaXRpb24gPSBudWxsO1xuXG4gIHByaXZhdGUgX2JvdW5kaW5nOiBhbnkgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBCdWdmaXg6IGlGcmFtZXMsIGFuZCBjb250ZXh0IHVucmVsYXRlZCBlbGVtZW50cyBibG9jayBhbGwgZXZlbnRzLCBhbmQgYXJlIHVudXNhYmxlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvODRcbiAgICovXG4gIHByaXZhdGUgX2hlbHBlckJsb2NrOiBIZWxwZXJCbG9jayA9IG51bGw7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMTogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIyOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjM6ICgpID0+IHZvaWQ7XG5cbiAgLyoqIERpc2FibGVzIHRoZSByZXNpemFibGUgaWYgc2V0IHRvIGZhbHNlLiAqL1xuICBASW5wdXQoKSBzZXQgbmdSZXNpemFibGUodjogYW55KSB7XG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9PSBudWxsICYmIHYgIT09ICcnKSB7XG4gICAgICB0aGlzLl9yZXNpemFibGUgPSAhIXY7XG4gICAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGljaCBoYW5kbGVzIGNhbiBiZSB1c2VkIGZvciByZXNpemluZy5cbiAgICogQGV4YW1wbGVcbiAgICogW3J6SGFuZGxlc10gPSBcIiduLGUscyx3LHNlLG5lLHN3LG53J1wiXG4gICAqIGVxdWFscyB0bzogW3J6SGFuZGxlc10gPSBcIidhbGwnXCJcbiAgICpcbiAgICogKi9cbiAgQElucHV0KCkgcnpIYW5kbGVzOiBSZXNpemVIYW5kbGVUeXBlID0gJ2UscyxzZSc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIGJlIGNvbnN0cmFpbmVkIHRvIGEgc3BlY2lmaWMgYXNwZWN0IHJhdGlvLlxuICAgKiAgTXVsdGlwbGUgdHlwZXMgc3VwcG9ydGVkOlxuICAgKiAgYm9vbGVhbjogV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGVsZW1lbnQgd2lsbCBtYWludGFpbiBpdHMgb3JpZ2luYWwgYXNwZWN0IHJhdGlvLlxuICAgKiAgbnVtYmVyOiBGb3JjZSB0aGUgZWxlbWVudCB0byBtYWludGFpbiBhIHNwZWNpZmljIGFzcGVjdCByYXRpbyBkdXJpbmcgcmVzaXppbmcuXG4gICAqL1xuICBASW5wdXQoKSByekFzcGVjdFJhdGlvOiBib29sZWFuIHwgbnVtYmVyID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cmFpbnMgcmVzaXppbmcgdG8gd2l0aGluIHRoZSBib3VuZHMgb2YgdGhlIHNwZWNpZmllZCBlbGVtZW50IG9yIHJlZ2lvbi5cbiAgICogIE11bHRpcGxlIHR5cGVzIHN1cHBvcnRlZDpcbiAgICogIFNlbGVjdG9yOiBUaGUgcmVzaXphYmxlIGVsZW1lbnQgd2lsbCBiZSBjb250YWluZWQgdG8gdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZmlyc3QgZWxlbWVudCBmb3VuZCBieSB0aGUgc2VsZWN0b3IuXG4gICAqICAgICAgICAgICAgSWYgbm8gZWxlbWVudCBpcyBmb3VuZCwgbm8gY29udGFpbm1lbnQgd2lsbCBiZSBzZXQuXG4gICAqICBFbGVtZW50OiBUaGUgcmVzaXphYmxlIGVsZW1lbnQgd2lsbCBiZSBjb250YWluZWQgdG8gdGhlIGJvdW5kaW5nIGJveCBvZiB0aGlzIGVsZW1lbnQuXG4gICAqICBTdHJpbmc6IFBvc3NpYmxlIHZhbHVlczogXCJwYXJlbnRcIi5cbiAgICovXG4gIEBJbnB1dCgpIHJ6Q29udGFpbm1lbnQ6IHN0cmluZyB8IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICAvKipcbiAgICogU25hcHMgdGhlIHJlc2l6aW5nIGVsZW1lbnQgdG8gYSBncmlkLCBldmVyeSB4IGFuZCB5IHBpeGVscy5cbiAgICogQSBudW1iZXIgZm9yIGJvdGggd2lkdGggYW5kIGhlaWdodCBvciBhbiBhcnJheSB2YWx1ZXMgbGlrZSBbIHgsIHkgXVxuICAgKi9cbiAgQElucHV0KCkgcnpHcmlkOiBudW1iZXIgfCBudW1iZXJbXSA9IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHdpZHRoIHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1pbldpZHRoOiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSBoZWlnaHQgdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWluSGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSB3aWR0aCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNYXhXaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gaGVpZ2h0IHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1heEhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdGFydCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpSZXNpemluZyA9IG5ldyBFdmVudEVtaXR0ZXI8SVJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RvcCByZXNpemluZyAqL1xuICBAT3V0cHV0KCkgcnpTdG9wID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgIHByaXZhdGUgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBuZXcgSGVscGVyQmxvY2soZWwubmF0aXZlRWxlbWVudCwgcmVuZGVyZXIpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydyekhhbmRsZXMnXSAmJiAhY2hhbmdlc1sncnpIYW5kbGVzJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekFzcGVjdFJhdGlvJ10gJiYgIWNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sncnpDb250YWlubWVudCddICYmICFjaGFuZ2VzWydyekNvbnRhaW5tZW50J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJlbW92ZUhhbmRsZXMoKTtcbiAgICB0aGlzLl9jb250YWlubWVudCA9IG51bGw7XG4gICAgdGhpcy5faGVscGVyQmxvY2suZGlzcG9zZSgpO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbnVsbDtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEoKTtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIoKTtcbiAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5faW5pdFNpemUgPSBTaXplLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9pbml0UG9zID0gUG9zaXRpb24uZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLnVwZGF0ZUFzcGVjdFJhdGlvKCk7XG4gICAgdGhpcy51cGRhdGVDb250YWlubWVudCgpO1xuICB9XG5cbiAgLyoqIEEgbWV0aG9kIHRvIHJlc2V0IHNpemUgKi9cbiAgcHVibGljIHJlc2V0U2l6ZSgpIHtcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9pbml0U2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5faW5pdFBvcyk7XG4gICAgdGhpcy5kb1Jlc2l6ZSgpO1xuICB9XG5cbiAgLyoqIEEgbWV0aG9kIHRvIGdldCBjdXJyZW50IHN0YXR1cyAqL1xuICBwdWJsaWMgZ2V0U3RhdHVzKCkge1xuICAgIGlmICghdGhpcy5fY3VyclBvcyB8fCAhdGhpcy5fY3VyclNpemUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzaXplOiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9jdXJyU2l6ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHRcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0b3A6IHRoaXMuX2N1cnJQb3MueSxcbiAgICAgICAgbGVmdDogdGhpcy5fY3VyclBvcy54XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlUmVzaXphYmxlKCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBjbGVhciBoYW5kbGVzOlxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLXJlc2l6YWJsZScpO1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuXG4gICAgLy8gY3JlYXRlIG5ldyBvbmVzOlxuICAgIGlmICh0aGlzLl9yZXNpemFibGUpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLXJlc2l6YWJsZScpO1xuICAgICAgdGhpcy5jcmVhdGVIYW5kbGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgYXNwZWN0ICovXG4gIHByaXZhdGUgdXBkYXRlQXNwZWN0UmF0aW8oKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnJ6QXNwZWN0UmF0aW8gPT09ICdib29sZWFuJykge1xuICAgICAgaWYgKHRoaXMucnpBc3BlY3RSYXRpbyAmJiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSAodGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgciA9IE51bWJlcih0aGlzLnJ6QXNwZWN0UmF0aW8pO1xuICAgICAgdGhpcy5fYXNwZWN0UmF0aW8gPSBpc05hTihyKSA/IDAgOiByO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gdXBkYXRlIGNvbnRhaW5tZW50ICovXG4gIHByaXZhdGUgdXBkYXRlQ29udGFpbm1lbnQoKSB7XG4gICAgaWYgKCF0aGlzLnJ6Q29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucnpDb250YWlubWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICh0aGlzLnJ6Q29udGFpbm1lbnQgPT09ICdwYXJlbnQnKSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb250YWlubWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KHRoaXMucnpDb250YWlubWVudCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gdGhpcy5yekNvbnRhaW5tZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBVc2UgaXQgdG8gY3JlYXRlIGhhbmRsZSBkaXZzICovXG4gIHByaXZhdGUgY3JlYXRlSGFuZGxlcygpIHtcbiAgICBpZiAoIXRoaXMucnpIYW5kbGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRtcEhhbmRsZVR5cGVzOiBzdHJpbmdbXTtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpIYW5kbGVzID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpIYW5kbGVzID09PSAnYWxsJykge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IFsnbicsICdlJywgJ3MnLCAndycsICduZScsICdzZScsICdudycsICdzdyddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wSGFuZGxlVHlwZXMgPSB0aGlzLnJ6SGFuZGxlcy5yZXBsYWNlKC8gL2csICcnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJyk7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gZGVmYXVsdCBoYW5kbGUgdGhlbWU6IG5nLXJlc2l6YWJsZS0kdHlwZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIGBuZy1yZXNpemFibGUtJHt0eXBlfWApO1xuICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlVHlwZS5wdXNoKHR5cGUpO1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0gPSBoYW5kbGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG1wSGFuZGxlVHlwZXMgPSBPYmplY3Qua2V5cyh0aGlzLnJ6SGFuZGxlcyk7XG4gICAgICBmb3IgKGxldCB0eXBlIG9mIHRtcEhhbmRsZVR5cGVzKSB7XG4gICAgICAgIC8vIGN1c3RvbSBoYW5kbGUgdGhlbWUuXG4gICAgICAgIGxldCBoYW5kbGUgPSB0aGlzLmNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlLCB0aGlzLnJ6SGFuZGxlc1t0eXBlXSk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgYSBoYW5kbGUgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVCeVR5cGUodHlwZTogc3RyaW5nLCBjc3M6IHN0cmluZyk6IFJlc2l6ZUhhbmRsZSB7XG4gICAgY29uc3QgX2VsID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCF0eXBlLm1hdGNoKC9eKHNlfHN3fG5lfG53fG58ZXxzfHcpJC8pKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGhhbmRsZSB0eXBlOicsIHR5cGUpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBSZXNpemVIYW5kbGUoX2VsLCB0aGlzLnJlbmRlcmVyLCB0eXBlLCBjc3MsIHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUhhbmRsZXMoKSB7XG4gICAgZm9yIChsZXQgdHlwZSBvZiB0aGlzLl9oYW5kbGVUeXBlKSB7XG4gICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdLmRpc3Bvc2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kbGVUeXBlID0gW107XG4gICAgdGhpcy5faGFuZGxlcyA9IHt9O1xuICB9XG5cbiAgb25Nb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBoYW5kbGU6IFJlc2l6ZUhhbmRsZSkge1xuICAgIC8vIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5idXR0b24gPT09IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgZXZlbnRzXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICghdGhpcy5faGFuZGxlUmVzaXppbmcpIHtcbiAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IFBvc2l0aW9uLmZyb21FdmVudChldmVudCk7XG4gICAgICB0aGlzLnN0YXJ0UmVzaXplKGhhbmRsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYmluZEV2ZW50cygpIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgICAgIHRoaXMuc3RvcFJlc2l6ZSgpO1xuICAgICAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmICh0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgICAgIHRoaXMuc3RvcFJlc2l6ZSgpO1xuICAgICAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nICYmIHRoaXMuX3Jlc2l6YWJsZSAmJiB0aGlzLl9vcmlnTW91c2VQb3MgJiYgdGhpcy5fb3JpZ1BvcyAmJiB0aGlzLl9vcmlnU2l6ZSkge1xuICAgICAgICAgIHRoaXMucmVzaXplVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgICAgdGhpcy5vblJlc2l6aW5nKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydFJlc2l6ZShoYW5kbGU6IFJlc2l6ZUhhbmRsZSkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9vcmlnU2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX29yaWdQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7IC8vIHg6IGxlZnQsIHk6IHRvcFxuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX29yaWdTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9vcmlnUG9zKTtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMuZ2V0Qm91bmRpbmcoKTtcbiAgICB9XG4gICAgdGhpcy5nZXRHcmlkU2l6ZSgpO1xuXG4gICAgLy8gQWRkIGEgdHJhbnNwYXJlbnQgaGVscGVyIGRpdjpcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5hZGQoKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemluZyA9IGhhbmRsZTtcbiAgICB0aGlzLnVwZGF0ZURpcmVjdGlvbigpO1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5yelN0YXJ0LmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RvcFJlc2l6ZSgpIHtcbiAgICAvLyBSZW1vdmUgdGhlIGhlbHBlciBkaXY6XG4gICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnJ6U3RvcC5lbWl0KHRoaXMuZ2V0UmVzaXppbmdFdmVudCgpKSk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXppbmcgPSBudWxsO1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ1NpemUgPSBudWxsO1xuICAgIHRoaXMuX29yaWdQb3MgPSBudWxsO1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgdGhpcy5yZXNldEJvdW5kaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblJlc2l6aW5nKCkge1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5yelJlc2l6aW5nLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVzaXppbmdFdmVudCgpOiBJUmVzaXplRXZlbnQge1xuICAgIHJldHVybiB7XG4gICAgICBob3N0OiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICBoYW5kbGU6IHRoaXMuX2hhbmRsZVJlc2l6aW5nID8gdGhpcy5faGFuZGxlUmVzaXppbmcuZWwgOiBudWxsLFxuICAgICAgc2l6ZToge1xuICAgICAgICB3aWR0aDogdGhpcy5fY3VyclNpemUud2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5fY3VyclNpemUuaGVpZ2h0XG4gICAgICB9LFxuICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgdG9wOiB0aGlzLl9jdXJyUG9zLnksXG4gICAgICAgIGxlZnQ6IHRoaXMuX2N1cnJQb3MueFxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB7XG4gICAgICBuOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL24vKSxcbiAgICAgIHM6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvcy8pLFxuICAgICAgdzogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC93LyksXG4gICAgICBlOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL2UvKVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZVRvKHA6IFBvc2l0aW9uKSB7XG4gICAgcC5zdWJ0cmFjdCh0aGlzLl9vcmlnTW91c2VQb3MpO1xuXG4gICAgY29uc3QgdG1wWCA9IE1hdGgucm91bmQocC54IC8gdGhpcy5fZ3JpZFNpemUueCAvIHRoaXMuc2NhbGUpICogdGhpcy5fZ3JpZFNpemUueDtcbiAgICBjb25zdCB0bXBZID0gTWF0aC5yb3VuZChwLnkgLyB0aGlzLl9ncmlkU2l6ZS55IC8gdGhpcy5zY2FsZSkgKiB0aGlzLl9ncmlkU2l6ZS55O1xuXG4gICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAvLyBuLCBuZSwgbndcbiAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArIHRtcFk7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSB0bXBZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGlyZWN0aW9uLnMpIHtcbiAgICAgIC8vIHMsIHNlLCBzd1xuICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0ICsgdG1wWTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLmUpIHtcbiAgICAgIC8vIGUsIG5lLCBzZVxuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCArIHRtcFg7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgLy8gdywgbncsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoIC0gdG1wWDtcbiAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArIHRtcFg7XG4gICAgfVxuXG4gICAgdGhpcy5jaGVja0JvdW5kcygpO1xuICAgIHRoaXMuY2hlY2tTaXplKCk7XG4gICAgdGhpcy5hZGp1c3RCeVJhdGlvKCk7XG4gICAgdGhpcy5kb1Jlc2l6ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb1Jlc2l6ZSgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdoZWlnaHQnLCB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3dpZHRoJywgdGhpcy5fY3VyclNpemUud2lkdGggKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCB0aGlzLl9jdXJyUG9zLnggKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHRoaXMuX2N1cnJQb3MueSArICdweCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGp1c3RCeVJhdGlvKCkge1xuICAgIGlmICh0aGlzLl9hc3BlY3RSYXRpbykge1xuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5lIHx8IHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX2N1cnJTaXplLndpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5fY3VyclNpemUuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tCb3VuZHMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuX2JvdW5kaW5nLndpZHRoIC0gdGhpcy5fYm91bmRpbmcucHIgLSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICBjb25zdCBtYXhIZWlnaHQgPSB0aGlzLl9ib3VuZGluZy5oZWlnaHQgLSB0aGlzLl9ib3VuZGluZy5wYiAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLSB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4gJiYgKHRoaXMuX2N1cnJQb3MueSArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkpIDwgMCkge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSAtdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fb3JpZ1NpemUuaGVpZ2h0ICsgdGhpcy5fb3JpZ1Bvcy55ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53ICYmICh0aGlzLl9jdXJyUG9zLnggKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYKSA8IDApIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gLXRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggKyB0aGlzLl9vcmlnUG9zLnggKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY3VyclNpemUud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1heFdpZHRoO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY3VyclNpemUuaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1heEhlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrU2l6ZSgpIHtcbiAgICBjb25zdCBtaW5IZWlnaHQgPSAhdGhpcy5yek1pbkhlaWdodCA/IDEgOiB0aGlzLnJ6TWluSGVpZ2h0O1xuICAgIGNvbnN0IG1pbldpZHRoID0gIXRoaXMucnpNaW5XaWR0aCA/IDEgOiB0aGlzLnJ6TWluV2lkdGg7XG5cbiAgICBpZiAodGhpcy5fY3VyclNpemUuaGVpZ2h0IDwgbWluSGVpZ2h0KSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtaW5IZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gbWluSGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY3VyclNpemUud2lkdGggPCBtaW5XaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBtaW5XaWR0aDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IHRoaXMuX29yaWdQb3MueCArICh0aGlzLl9vcmlnU2l6ZS53aWR0aCAtIG1pbldpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yek1heEhlaWdodCAmJiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPiB0aGlzLnJ6TWF4SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLnJ6TWF4SGVpZ2h0O1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgKHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRoaXMucnpNYXhIZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4V2lkdGggJiYgdGhpcy5fY3VyclNpemUud2lkdGggPiB0aGlzLnJ6TWF4V2lkdGgpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5yek1heFdpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gdGhpcy5yek1heFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEJvdW5kaW5nKCkge1xuICAgIGNvbnN0IGVsID0gdGhpcy5fY29udGFpbm1lbnQ7XG4gICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICBsZXQgcCA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgIGNvbnN0IG5hdGl2ZUVsID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIGxldCB0cmFuc2Zvcm1zID0gbmF0aXZlRWwuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykucmVwbGFjZSgvW14tXFxkLF0vZywgJycpLnNwbGl0KCcsJyk7XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nID0ge307XG4gICAgICB0aGlzLl9ib3VuZGluZy53aWR0aCA9IGVsLmNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fYm91bmRpbmcuaGVpZ2h0ID0gZWwuY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy5fYm91bmRpbmcucHIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXJpZ2h0JyksIDEwKTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBiID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1ib3R0b20nKSwgMTApO1xuXG4gICAgICBpZiAodHJhbnNmb3Jtcy5sZW5ndGggPj0gNikge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gcGFyc2VJbnQodHJhbnNmb3Jtc1s0XSwgMTApO1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZID0gcGFyc2VJbnQodHJhbnNmb3Jtc1s1XSwgMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCA9IDA7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9ib3VuZGluZy5wb3NpdGlvbiA9IGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgIGlmIChwID09PSAnc3RhdGljJykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGVsLCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0Qm91bmRpbmcoKSB7XG4gICAgaWYgKHRoaXMuX2JvdW5kaW5nICYmIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9jb250YWlubWVudCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgfVxuICAgIHRoaXMuX2JvdW5kaW5nID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JpZFNpemUoKSB7XG4gICAgLy8gc2V0IGRlZmF1bHQgdmFsdWU6XG4gICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IDEsIHk6IDEgfTtcblxuICAgIGlmICh0aGlzLnJ6R3JpZCkge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnJ6R3JpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy5fZ3JpZFNpemUgPSB7IHg6IHRoaXMucnpHcmlkLCB5OiB0aGlzLnJ6R3JpZCB9O1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRoaXMucnpHcmlkKSkge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWRbMF0sIHk6IHRoaXMucnpHcmlkWzFdIH07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmUgfSBmcm9tICcuL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSxcbiAgICBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlLFxuICAgIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyRHJhZ2dhYmxlTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkRpcmVjdGl2ZSIsIkVsZW1lbnRSZWYiLCJSZW5kZXJlcjIiLCJOZ1pvbmUiLCJPdXRwdXQiLCJJbnB1dCIsInRzbGliXzEuX192YWx1ZXMiLCJOZ01vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQUtBO1FBQ0Usa0JBQW1C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QUFTLENBQUMsVUFBVSxDQUFDO29CQUUxSCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFO3dCQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO3dCQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztxQkFDN0Y7b0JBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRTt3QkFDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQzt3QkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7cUJBQzNGO29CQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxFQUFFO3dCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7cUJBQ2pDO29CQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO3dCQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7cUJBQ25DO2lCQUNGOzs7OztRQUdLLDZDQUFTOzs7O2dC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