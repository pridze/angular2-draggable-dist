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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjItZHJhZ2dhYmxlLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9tb2RlbHMvcG9zaXRpb24udHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9oZWxwZXItYmxvY2sudHMiLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLnRzIixudWxsLCJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS9saWIvd2lkZ2V0cy9yZXNpemUtaGFuZGxlLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL21vZGVscy9zaXplLnRzIiwibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvbGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyIsIm5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlL2xpYi9hbmd1bGFyLWRyYWdnYWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgTW91c2VFdmVudCkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIHBvcy54ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIHBvcy55ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBQb3NpdGlvbikge1xuICAgIHJldHVybiBuZXcgUG9zaXRpb24oMCwgMCkuc2V0KHApO1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldChwOiBJUG9zaXRpb24pIHtcbiAgICB0aGlzLnggPSBwLng7XG4gICAgdGhpcy55ID0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIEhlbHBlckJsb2NrIHtcbiAgcHJvdGVjdGVkIF9oZWxwZXI6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX2FkZGVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICAvLyBnZW5lcmF0ZSBoZWxwZXIgZGl2XG4gICAgbGV0IGhlbHBlciA9IHJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2hlaWdodCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnYmFja2dyb3VuZC1jb2xvcicsICd0cmFuc3BhcmVudCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3RvcCcsICcwJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnbGVmdCcsICcwJyk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGVscGVyID0gaGVscGVyO1xuICB9XG5cbiAgYWRkKCkge1xuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICF0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmIHRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hlbHBlciA9IG51bGw7XG4gICAgdGhpcy5fYWRkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVscGVyO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIzOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBAT3V0cHV0KCkgc3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3RvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBNYWtlIHRoZSBoYW5kbGUgSFRNTEVsZW1lbnQgZHJhZ2dhYmxlICovXG4gIEBJbnB1dCgpIGhhbmRsZTogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFNldCB0aGUgYm91bmRzIEhUTUxFbGVtZW50ICovXG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIExpc3Qgb2YgYWxsb3dlZCBvdXQgb2YgYm91bmRzIGVkZ2VzICoqL1xuICBASW5wdXQoKSBvdXRPZkJvdW5kcyA9IHtcbiAgICB0b3A6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBib3R0b206IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFJvdW5kIHRoZSBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgKi9cbiAgQElucHV0KCkgZ3JpZFNpemUgPSAxO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHpJbmRleE1vdmluZzogc3RyaW5nO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIG5vdCBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSBzZXQgekluZGV4KHNldHRpbmc6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHNldHRpbmcpO1xuICAgIHRoaXMuX3pJbmRleCA9IHNldHRpbmc7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdG8gbGltaXQgdGhlIGVsZW1lbnQgc3RheSBpbiB0aGUgYm91bmRzICovXG4gIEBJbnB1dCgpIGluQm91bmRzID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIHVzZSBpdCdzIHByZXZpb3VzIGRyYWcgcG9zaXRpb24gb24gYSBuZXcgZHJhZyBldmVudC4gKi9cbiAgQElucHV0KCkgdHJhY2tQb3NpdGlvbiA9IHRydWU7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHByZXZlbnQgZGVmYXVsdCBldmVudCAqL1xuICBASW5wdXQoKSBwcmV2ZW50RGVmYXVsdEV2ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFNldCBpbml0aWFsIHBvc2l0aW9uIGJ5IG9mZnNldHMgKi9cbiAgQElucHV0KCkgcG9zaXRpb246IElQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBtb3ZpbmcgKi9cbiAgQE91dHB1dCgpIG1vdmluZ09mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBwdXQgYmFjayAqL1xuICBAT3V0cHV0KCkgZW5kT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG5nRHJhZ2dhYmxlKHNldHRpbmc6IGFueSkge1xuICAgIGlmIChzZXR0aW5nICE9PSB1bmRlZmluZWQgJiYgc2V0dGluZyAhPT0gbnVsbCAmJiBzZXR0aW5nICE9PSAnJykge1xuICAgICAgdGhpcy5hbGxvd0RyYWcgPSAhIXNldHRpbmc7XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5oYW5kbGUgPyB0aGlzLmhhbmRsZSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMubW92aW5nT2Zmc2V0LmVtaXQoe1xuICAgICAgICB4OiB0aGlzLnRlbXBUcmFucy54ICsgdGhpcy5vbGRUcmFucy54LFxuICAgICAgICB5OiB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG5cbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmVuZE9mZnNldC5lbWl0KHtcbiAgICAgICAgeDogdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueCxcbiAgICAgICAgeTogdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueVxuICAgICAgfSkpO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0hhbmRsZVRhcmdldCh0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaXMgdGhlIGVsZW1lbnQgY2xpY2tlZCwgdGhlbiBjaGVja3MgZWFjaCBjaGlsZCBlbGVtZW50IG9mIGVsZW1lbnQgYXMgd2VsbFxuICAgIC8vIElnbm9yZXMgYnV0dG9uIGNsaWNrc1xuXG4gICAgLy8gSWdub3JlIGVsZW1lbnRzIG9mIHR5cGUgYnV0dG9uXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IHdhcyBmb3VuZCwgcmV0dXJuIHRydWUgKGhhbmRsZSB3YXMgZm91bmQpXG4gICAgaWYgKGVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzaXZlbHkgaXRlcmF0ZSB0aGlzIGVsZW1lbnRzIGNoaWxkcmVuXG4gICAgZm9yIChsZXQgY2hpbGQgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgZWxlbWVudC5jaGlsZHJlbltjaGlsZF0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGxpbmVhZ2VcbiAgICAvLyBOb3RlOiByZXR1cm4gZmFsc2UgaXMgaWdub3JlIHVubGVzcyBpdCBpcyB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnBpY2tVcCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnB1dEJhY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICAgICAgdGhpcy5tb3ZlVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMClcclxuICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXhwb3J0U3RhcihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3ZhbHVlcyhvKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0sIGkgPSAwO1xyXG4gICAgaWYgKG0pIHJldHVybiBtLmNhbGwobyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0KHYpIHtcclxuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgX19hd2FpdCA/ICh0aGlzLnYgPSB2LCB0aGlzKSA6IG5ldyBfX2F3YWl0KHYpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0dlbmVyYXRvcih0aGlzQXJnLCBfYXJndW1lbnRzLCBnZW5lcmF0b3IpIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgZyA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSwgaSwgcSA9IFtdO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlmIChnW25dKSBpW25dID0gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChhLCBiKSB7IHEucHVzaChbbiwgdiwgYSwgYl0pID4gMSB8fCByZXN1bWUobiwgdik7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiByZXN1bWUobiwgdikgeyB0cnkgeyBzdGVwKGdbbl0odikpOyB9IGNhdGNoIChlKSB7IHNldHRsZShxWzBdWzNdLCBlKTsgfSB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKHIpIHsgci52YWx1ZSBpbnN0YW5jZW9mIF9fYXdhaXQgPyBQcm9taXNlLnJlc29sdmUoci52YWx1ZS52KS50aGVuKGZ1bGZpbGwsIHJlamVjdCkgOiBzZXR0bGUocVswXVsyXSwgcik7IH1cclxuICAgIGZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHsgcmVzdW1lKFwibmV4dFwiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHJlamVjdCh2YWx1ZSkgeyByZXN1bWUoXCJ0aHJvd1wiLCB2YWx1ZSk7IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShmLCB2KSB7IGlmIChmKHYpLCBxLnNoaWZ0KCksIHEubGVuZ3RoKSByZXN1bWUocVswXVswXSwgcVswXVsxXSk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNEZWxlZ2F0b3Iobykge1xyXG4gICAgdmFyIGksIHA7XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIsIGZ1bmN0aW9uIChlKSB7IHRocm93IGU7IH0pLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuLCBmKSB7IGlbbl0gPSBvW25dID8gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIChwID0gIXApID8geyB2YWx1ZTogX19hd2FpdChvW25dKHYpKSwgZG9uZTogbiA9PT0gXCJyZXR1cm5cIiB9IDogZiA/IGYodikgOiB2OyB9IDogZjsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY1ZhbHVlcyhvKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIG0gPSBvW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSwgaTtcclxuICAgIHJldHVybiBtID8gbS5jYWxsKG8pIDogKG8gPSB0eXBlb2YgX192YWx1ZXMgPT09IFwiZnVuY3Rpb25cIiA/IF9fdmFsdWVzKG8pIDogb1tTeW1ib2wuaXRlcmF0b3JdKCksIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiKSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LCBpKTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpW25dID0gb1tuXSAmJiBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkgeyB2ID0gb1tuXSh2KSwgc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgdi5kb25lLCB2LnZhbHVlKTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHNldHRsZShyZXNvbHZlLCByZWplY3QsIGQsIHYpIHsgUHJvbWlzZS5yZXNvbHZlKHYpLnRoZW4oZnVuY3Rpb24odikgeyByZXNvbHZlKHsgdmFsdWU6IHYsIGRvbmU6IGQgfSk7IH0sIHJlamVjdCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWFrZVRlbXBsYXRlT2JqZWN0KGNvb2tlZCwgcmF3KSB7XHJcbiAgICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb29rZWQsIFwicmF3XCIsIHsgdmFsdWU6IHJhdyB9KTsgfSBlbHNlIHsgY29va2VkLnJhdyA9IHJhdzsgfVxyXG4gICAgcmV0dXJuIGNvb2tlZDtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdC5kZWZhdWx0ID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGUge1xuICBwcm90ZWN0ZWQgX2hhbmRsZTogRWxlbWVudDtcbiAgcHJpdmF0ZSBfb25SZXNpemU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHBhcmVudDogRWxlbWVudCxcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjc3M6IHN0cmluZyxcbiAgICBwcml2YXRlIG9uTW91c2VEb3duOiBhbnlcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGFuZGxlIGRpdlxuICAgIGxldCBoYW5kbGUgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtaGFuZGxlJyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCBjc3MpO1xuXG4gICAgLy8gYWRkIGRlZmF1bHQgZGlhZ29uYWwgZm9yIHNlIGhhbmRsZVxuICAgIGlmICh0eXBlID09PSAnc2UnKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyhoYW5kbGUsICduZy1yZXNpemFibGUtZGlhZ29uYWwnKTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGhhbmRsZSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGFuZCByZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgIHRoaXMuX29uUmVzaXplID0gKGV2ZW50KSA9PiB7IG9uTW91c2VEb3duKGV2ZW50LCB0aGlzKTsgfTtcbiAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgLy8gZG9uZVxuICAgIHRoaXMuX2hhbmRsZSA9IGhhbmRsZTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5faGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uUmVzaXplKTtcbiAgICB0aGlzLl9oYW5kbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uUmVzaXplKTtcblxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5faGFuZGxlKTtcbiAgICB9XG4gICAgdGhpcy5faGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLl9vblJlc2l6ZSA9IG51bGw7XG4gIH1cblxuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hhbmRsZTtcbiAgfVxufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU2l6ZSBpbXBsZW1lbnRzIElTaXplIHtcbiAgY29uc3RydWN0b3IocHVibGljIHdpZHRoOiBudW1iZXIsIHB1YmxpYyBoZWlnaHQ6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGdldEN1cnJlbnQoZWw6IEVsZW1lbnQpIHtcbiAgICBsZXQgc2l6ZSA9IG5ldyBTaXplKDAsIDApO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgc2l6ZS53aWR0aCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyksIDEwKTtcbiAgICAgICAgc2l6ZS5oZWlnaHQgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSwgMTApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShzOiBTaXplKSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKDAsIDApLnNldChzKTtcbiAgfVxuXG4gIHNldChzOiBJU2l6ZSkge1xuICAgIHRoaXMud2lkdGggPSBzLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gcy5oZWlnaHQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsXG4gIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLFxuICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSGVscGVyQmxvY2sgfSBmcm9tICcuL3dpZGdldHMvaGVscGVyLWJsb2NrJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZSB9IGZyb20gJy4vd2lkZ2V0cy9yZXNpemUtaGFuZGxlJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZVR5cGUgfSBmcm9tICcuL21vZGVscy9yZXNpemUtaGFuZGxlLXR5cGUnO1xuaW1wb3J0IHsgUG9zaXRpb24sIElQb3NpdGlvbiB9IGZyb20gJy4vbW9kZWxzL3Bvc2l0aW9uJztcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuL21vZGVscy9zaXplJztcbmltcG9ydCB7IElSZXNpemVFdmVudCB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1ldmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ1Jlc2l6YWJsZV0nLFxuICBleHBvcnRBczogJ25nUmVzaXphYmxlJ1xufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyUmVzaXphYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIHByaXZhdGUgX3Jlc2l6YWJsZSA9IHRydWU7XG4gIHByaXZhdGUgX2hhbmRsZXM6IHsgW2tleTogc3RyaW5nXTogUmVzaXplSGFuZGxlIH0gPSB7fTtcbiAgcHJpdmF0ZSBfaGFuZGxlVHlwZTogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBfaGFuZGxlUmVzaXppbmc6IFJlc2l6ZUhhbmRsZSA9IG51bGw7XG4gIHByaXZhdGUgX2RpcmVjdGlvbjogeyAnbic6IGJvb2xlYW4sICdzJzogYm9vbGVhbiwgJ3cnOiBib29sZWFuLCAnZSc6IGJvb2xlYW4gfSA9IG51bGw7XG4gIHByaXZhdGUgX2FzcGVjdFJhdGlvID0gMDtcbiAgcHJpdmF0ZSBfY29udGFpbm1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ01vdXNlUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIE9yaWdpbmFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX29yaWdTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ1BvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBDdXJyZW50IFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2N1cnJTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VyclBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBJbml0aWFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2luaXRTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfaW5pdFBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBTbmFwIHRvIGdpcmQgKi9cbiAgcHJpdmF0ZSBfZ3JpZFNpemU6IElQb3NpdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfYm91bmRpbmc6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIxOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjI6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMzogKCkgPT4gdm9pZDtcblxuICAvKiogRGlzYWJsZXMgdGhlIHJlc2l6YWJsZSBpZiBzZXQgdG8gZmFsc2UuICovXG4gIEBJbnB1dCgpIHNldCBuZ1Jlc2l6YWJsZSh2OiBhbnkpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHYgIT09IG51bGwgJiYgdiAhPT0gJycpIHtcbiAgICAgIHRoaXMuX3Jlc2l6YWJsZSA9ICEhdjtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdoaWNoIGhhbmRsZXMgY2FuIGJlIHVzZWQgZm9yIHJlc2l6aW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKiBbcnpIYW5kbGVzXSA9IFwiJ24sZSxzLHcsc2UsbmUsc3csbncnXCJcbiAgICogZXF1YWxzIHRvOiBbcnpIYW5kbGVzXSA9IFwiJ2FsbCdcIlxuICAgKlxuICAgKiAqL1xuICBASW5wdXQoKSByekhhbmRsZXM6IFJlc2l6ZUhhbmRsZVR5cGUgPSAnZSxzLHNlJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgYmUgY29uc3RyYWluZWQgdG8gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBib29sZWFuOiBXaGVuIHNldCB0byB0cnVlLCB0aGUgZWxlbWVudCB3aWxsIG1haW50YWluIGl0cyBvcmlnaW5hbCBhc3BlY3QgcmF0aW8uXG4gICAqICBudW1iZXI6IEZvcmNlIHRoZSBlbGVtZW50IHRvIG1haW50YWluIGEgc3BlY2lmaWMgYXNwZWN0IHJhdGlvIGR1cmluZyByZXNpemluZy5cbiAgICovXG4gIEBJbnB1dCgpIHJ6QXNwZWN0UmF0aW86IGJvb2xlYW4gfCBudW1iZXIgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RyYWlucyByZXNpemluZyB0byB3aXRoaW4gdGhlIGJvdW5kcyBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgb3IgcmVnaW9uLlxuICAgKiAgTXVsdGlwbGUgdHlwZXMgc3VwcG9ydGVkOlxuICAgKiAgU2VsZWN0b3I6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBmaXJzdCBlbGVtZW50IGZvdW5kIGJ5IHRoZSBzZWxlY3Rvci5cbiAgICogICAgICAgICAgICBJZiBubyBlbGVtZW50IGlzIGZvdW5kLCBubyBjb250YWlubWVudCB3aWxsIGJlIHNldC5cbiAgICogIEVsZW1lbnQ6IFRoZSByZXNpemFibGUgZWxlbWVudCB3aWxsIGJlIGNvbnRhaW5lZCB0byB0aGUgYm91bmRpbmcgYm94IG9mIHRoaXMgZWxlbWVudC5cbiAgICogIFN0cmluZzogUG9zc2libGUgdmFsdWVzOiBcInBhcmVudFwiLlxuICAgKi9cbiAgQElucHV0KCkgcnpDb250YWlubWVudDogc3RyaW5nIHwgSFRNTEVsZW1lbnQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBTbmFwcyB0aGUgcmVzaXppbmcgZWxlbWVudCB0byBhIGdyaWQsIGV2ZXJ5IHggYW5kIHkgcGl4ZWxzLlxuICAgKiBBIG51bWJlciBmb3IgYm90aCB3aWR0aCBhbmQgaGVpZ2h0IG9yIGFuIGFycmF5IHZhbHVlcyBsaWtlIFsgeCwgeSBdXG4gICAqL1xuICBASW5wdXQoKSByekdyaWQ6IG51bWJlciB8IG51bWJlcltdID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWluV2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5IZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHdpZHRoIHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1heFdpZHRoOiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBUaGUgbWF4aW11bSBoZWlnaHQgdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4SGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdG9wIHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0b3AgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogSW5wdXQgY3NzIHNjYWxlIHRyYW5zZm9ybSBvZiBlbGVtZW50IHNvIHRyYW5zbGF0aW9ucyBhcmUgY29ycmVjdCAqL1xuICBASW5wdXQoKSBzY2FsZSA9IDE7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG5ldyBIZWxwZXJCbG9jayhlbC5uYXRpdmVFbGVtZW50LCByZW5kZXJlcik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3J6SGFuZGxlcyddICYmICFjaGFuZ2VzWydyekhhbmRsZXMnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlUmVzaXphYmxlKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXSAmJiAhY2hhbmdlc1sncnpBc3BlY3RSYXRpbyddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy51cGRhdGVBc3BlY3RSYXRpbygpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekNvbnRhaW5tZW50J10gJiYgIWNoYW5nZXNbJ3J6Q29udGFpbm1lbnQnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29udGFpbm1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5kaXNwb3NlKCk7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBudWxsO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMSgpO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMigpO1xuICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9pbml0U2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2luaXRQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gcmVzZXQgc2l6ZSAqL1xuICBwdWJsaWMgcmVzZXRTaXplKCkge1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgc3RhdHVzICovXG4gIHB1YmxpYyBnZXRTdGF0dXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyUG9zIHx8ICF0aGlzLl9jdXJyU2l6ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZXNpemFibGUoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNsZWFyIGhhbmRsZXM6XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG5cbiAgICAvLyBjcmVhdGUgbmV3IG9uZXM6XG4gICAgaWYgKHRoaXMuX3Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgICB0aGlzLmNyZWF0ZUhhbmRsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBhc3BlY3QgKi9cbiAgcHJpdmF0ZSB1cGRhdGVBc3BlY3RSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpBc3BlY3RSYXRpbyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpZiAodGhpcy5yekFzcGVjdFJhdGlvICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCkge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9ICh0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2N1cnJTaXplLmhlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByID0gTnVtYmVyKHRoaXMucnpBc3BlY3RSYXRpbyk7XG4gICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IGlzTmFOKHIpID8gMCA6IHI7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgY29udGFpbm1lbnQgKi9cbiAgcHJpdmF0ZSB1cGRhdGVDb250YWlubWVudCgpIHtcbiAgICBpZiAoIXRoaXMucnpDb250YWlubWVudCkge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5yekNvbnRhaW5tZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpDb250YWlubWVudCA9PT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4odGhpcy5yekNvbnRhaW5tZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLnJ6Q29udGFpbm1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgaGFuZGxlIGRpdnMgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVzKCkge1xuICAgIGlmICghdGhpcy5yekhhbmRsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG1wSGFuZGxlVHlwZXM6IHN0cmluZ1tdO1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekhhbmRsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekhhbmRsZXMgPT09ICdhbGwnKSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ253JywgJ3N3J107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IHRoaXMucnpIYW5kbGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBkZWZhdWx0IGhhbmRsZSB0aGVtZTogbmctcmVzaXphYmxlLSR0eXBlLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgYG5nLXJlc2l6YWJsZS0ke3R5cGV9YCk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0bXBIYW5kbGVUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMucnpIYW5kbGVzKTtcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gY3VzdG9tIGhhbmRsZSB0aGVtZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIHRoaXMucnpIYW5kbGVzW3R5cGVdKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBhIGhhbmRsZSAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlOiBzdHJpbmcsIGNzczogc3RyaW5nKTogUmVzaXplSGFuZGxlIHtcbiAgICBjb25zdCBfZWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXR5cGUubWF0Y2goL14oc2V8c3d8bmV8bnd8bnxlfHN8dykkLykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgaGFuZGxlIHR5cGU6JywgdHlwZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc2l6ZUhhbmRsZShfZWwsIHRoaXMucmVuZGVyZXIsIHR5cGUsIGNzcywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlSGFuZGxlcygpIHtcbiAgICBmb3IgKGxldCB0eXBlIG9mIHRoaXMuX2hhbmRsZVR5cGUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0uZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZVR5cGUgPSBbXTtcbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gIH1cblxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgLy8gc2tpcCByaWdodCBjbGljaztcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBldmVudHNcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKCF0aGlzLl9oYW5kbGVSZXNpemluZykge1xuICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KTtcbiAgICAgIHRoaXMuc3RhcnRSZXNpemUoaGFuZGxlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgLy8gMS4gc2tpcCByaWdodCBjbGljaztcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICAgICAgdGhpcy5zdG9wUmVzaXplKCk7XG4gICAgICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgLy8gMS4gc2tpcCByaWdodCBjbGljaztcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICAgICAgdGhpcy5zdG9wUmVzaXplKCk7XG4gICAgICAgICAgdGhpcy5fb3JpZ01vdXNlUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjMgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2Vtb3ZlJywgKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5faGFuZGxlUmVzaXppbmcgJiYgdGhpcy5fcmVzaXphYmxlICYmIHRoaXMuX29yaWdNb3VzZVBvcyAmJiB0aGlzLl9vcmlnUG9zICYmIHRoaXMuX29yaWdTaXplKSB7XG4gICAgICAgICAgdGhpcy5yZXNpemVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgICAgICB0aGlzLm9uUmVzaXppbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0UmVzaXplKGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgY29uc3QgZWxtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX29yaWdTaXplID0gU2l6ZS5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IFBvc2l0aW9uLmdldEN1cnJlbnQoZWxtKTsgLy8geDogbGVmdCwgeTogdG9wXG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5fb3JpZ1NpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX29yaWdQb3MpO1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgdGhpcy5nZXRCb3VuZGluZygpO1xuICAgIH1cbiAgICB0aGlzLmdldEdyaWRTaXplKCk7XG5cbiAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLmFkZCgpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gaGFuZGxlO1xuICAgIHRoaXMudXBkYXRlRGlyZWN0aW9uKCk7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnJ6U3RhcnQuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdG9wUmVzaXplKCkge1xuICAgIC8vIFJlbW92ZSB0aGUgaGVscGVyIGRpdjpcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMucnpTdG9wLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpKTtcbiAgICB0aGlzLl9oYW5kbGVSZXNpemluZyA9IG51bGw7XG4gICAgdGhpcy5fZGlyZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnU2l6ZSA9IG51bGw7XG4gICAgdGhpcy5fb3JpZ1BvcyA9IG51bGw7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLnJlc2V0Qm91bmRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uUmVzaXppbmcoKSB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnJ6UmVzaXppbmcuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZXNpemluZ0V2ZW50KCk6IElSZXNpemVFdmVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvc3Q6IHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgIGhhbmRsZTogdGhpcy5faGFuZGxlUmVzaXppbmcgPyB0aGlzLl9oYW5kbGVSZXNpemluZy5lbCA6IG51bGwsXG4gICAgICBzaXplOiB7XG4gICAgICAgIHdpZHRoOiB0aGlzLl9jdXJyU2l6ZS53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHRcbiAgICAgIH0sXG4gICAgICBwb3NpdGlvbjoge1xuICAgICAgICB0b3A6IHRoaXMuX2N1cnJQb3MueSxcbiAgICAgICAgbGVmdDogdGhpcy5fY3VyclBvcy54XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2RpcmVjdGlvbiA9IHtcbiAgICAgIG46ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvbi8pLFxuICAgICAgczogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC9zLyksXG4gICAgICB3OiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL3cvKSxcbiAgICAgIGU6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvZS8pXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzaXplVG8ocDogUG9zaXRpb24pIHtcbiAgICBwLnN1YnRyYWN0KHRoaXMuX29yaWdNb3VzZVBvcyk7XG5cbiAgICBjb25zdCB0bXBYID0gTWF0aC5yb3VuZChwLnggLyB0aGlzLl9ncmlkU2l6ZS54IC8gdGhpcy5zY2FsZSkgKiB0aGlzLl9ncmlkU2l6ZS54O1xuICAgIGNvbnN0IHRtcFkgPSBNYXRoLnJvdW5kKHAueSAvIHRoaXMuX2dyaWRTaXplLnkgLyB0aGlzLnNjYWxlKSAqIHRoaXMuX2dyaWRTaXplLnk7XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgIC8vIG4sIG5lLCBud1xuICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgdG1wWTtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRtcFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24ucykge1xuICAgICAgLy8gcywgc2UsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0bXBZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSkge1xuICAgICAgLy8gZSwgbmUsIHNlXG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdG1wWDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAvLyB3LCBudywgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggLSB0bXBYO1xuICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgdG1wWDtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgdGhpcy5jaGVja1NpemUoKTtcbiAgICB0aGlzLmFkanVzdEJ5UmF0aW8oKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICBwcml2YXRlIGRvUmVzaXplKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2hlaWdodCcsIHRoaXMuX2N1cnJTaXplLmhlaWdodCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCB0aGlzLl9jdXJyU2l6ZS53aWR0aCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHRoaXMuX2N1cnJQb3MueCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgdGhpcy5fY3VyclBvcy55ICsgJ3B4Jyk7XG4gIH1cblxuICBwcml2YXRlIGFkanVzdEJ5UmF0aW8oKSB7XG4gICAgaWYgKHRoaXMuX2FzcGVjdFJhdGlvKSB7XG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLmUgfHwgdGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gdGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0JvdW5kcygpIHtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIGNvbnN0IG1heFdpZHRoID0gdGhpcy5fYm91bmRpbmcud2lkdGggLSB0aGlzLl9ib3VuZGluZy5wciAtIHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuX2JvdW5kaW5nLmhlaWdodCAtIHRoaXMuX2JvdW5kaW5nLnBiIC0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCAtIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubiAmJiAodGhpcy5fY3VyclBvcy55ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0aGlzLl9vcmlnUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncgJiYgKHRoaXMuX2N1cnJQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVgpIDwgMCkge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSAtdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLl9vcmlnU2l6ZS53aWR0aCArIHRoaXMuX29yaWdQb3MueCArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWF4V2lkdGg7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPiBtYXhIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbWF4SGVpZ2h0O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tTaXplKCkge1xuICAgIGNvbnN0IG1pbkhlaWdodCA9ICF0aGlzLnJ6TWluSGVpZ2h0ID8gMSA6IHRoaXMucnpNaW5IZWlnaHQ7XG4gICAgY29uc3QgbWluV2lkdGggPSAhdGhpcy5yek1pbldpZHRoID8gMSA6IHRoaXMucnpNaW5XaWR0aDtcblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPCBtaW5IZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1pbkhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSBtaW5IZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA8IG1pbldpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1pbldpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gbWluV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4SGVpZ2h0ICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IHRoaXMucnpNYXhIZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMucnpNYXhIZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdGhpcy5yek1heEhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhXaWR0aCAmJiB0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IHRoaXMucnpNYXhXaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLnJ6TWF4V2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSB0aGlzLnJ6TWF4V2lkdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Qm91bmRpbmcoKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9jb250YWlubWVudDtcbiAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgIGxldCBwID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgY29uc3QgbmF0aXZlRWwgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgbGV0IHRyYW5zZm9ybXMgPSBuYXRpdmVFbC5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKS5yZXBsYWNlKC9bXi1cXGQsXS9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgdGhpcy5fYm91bmRpbmcgPSB7fTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLndpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9ib3VuZGluZy5oZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wciA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSwgMTApO1xuICAgICAgdGhpcy5fYm91bmRpbmcucGIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1zLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSBwYXJzZUludCh0cmFuc2Zvcm1zWzRdLCAxMCk7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSBwYXJzZUludCh0cmFuc2Zvcm1zWzVdLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgaWYgKHAgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWwsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRCb3VuZGluZygpIHtcbiAgICBpZiAodGhpcy5fYm91bmRpbmcgJiYgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRhaW5tZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICB9XG4gICAgdGhpcy5fYm91bmRpbmcgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcmlkU2l6ZSgpIHtcbiAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZTpcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogMSwgeTogMSB9O1xuXG4gICAgaWYgKHRoaXMucnpHcmlkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucnpHcmlkID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWQsIHk6IHRoaXMucnpHcmlkIH07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yekdyaWQpKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZFswXSwgeTogdGhpcy5yekdyaWRbMV0gfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9hbmd1bGFyLWRyYWdnYWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vYW5ndWxhci1yZXNpemFibGUuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBbmd1bGFyRHJhZ2dhYmxlRGlyZWN0aXZlLFxuICAgIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUsXG4gICAgQW5ndWxhclJlc2l6YWJsZURpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJEcmFnZ2FibGVNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiRGlyZWN0aXZlIiwiRWxlbWVudFJlZiIsIlJlbmRlcmVyMiIsIk5nWm9uZSIsIk91dHB1dCIsIklucHV0IiwidHNsaWJfMS5fX3ZhbHVlcyIsIk5nTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBS0E7UUFDRSxrQkFBbUIsQ0FBUyxFQUFTLENBQVM7WUFBM0IsTUFBQyxHQUFELENBQUMsQ0FBUTtZQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7U0FBSzs7Ozs7UUFFNUMsa0JBQVM7Ozs7WUFBaEIsVUFBaUIsQ0FBMEI7Z0JBQ3pDLElBQUksQ0FBQyxZQUFZLFVBQVUsRUFBRTtvQkFDM0IsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0M7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMvRTthQUNGOzs7OztRQUVNLG9CQUFXOzs7O1lBQWxCLFVBQW1CLEdBQUc7Z0JBQ3BCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQzlDOzs7OztRQUVNLG1CQUFVOzs7O1lBQWpCLFVBQWtCLEVBQVc7Z0JBQzNCLHFCQUFJLEdBQUcsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTdCLElBQUksTUFBTSxFQUFFO29CQUNWLHFCQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMs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