/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Position } from './models/position';
import { HelperBlock } from './widgets/helper-block';
export class AngularDraggableDirective {
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
function AngularDraggableDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    AngularDraggableDirective.prototype.allowDrag;
    /** @type {?} */
    AngularDraggableDirective.prototype.moving;
    /** @type {?} */
    AngularDraggableDirective.prototype.orignal;
    /** @type {?} */
    AngularDraggableDirective.prototype.oldTrans;
    /** @type {?} */
    AngularDraggableDirective.prototype.tempTrans;
    /** @type {?} */
    AngularDraggableDirective.prototype.oldZIndex;
    /** @type {?} */
    AngularDraggableDirective.prototype._zIndex;
    /** @type {?} */
    AngularDraggableDirective.prototype.needTransform;
    /** @type {?} */
    AngularDraggableDirective.prototype._removeListener1;
    /** @type {?} */
    AngularDraggableDirective.prototype._removeListener2;
    /** @type {?} */
    AngularDraggableDirective.prototype._removeListener3;
    /** @type {?} */
    AngularDraggableDirective.prototype._removeListener4;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     * @type {?}
     */
    AngularDraggableDirective.prototype._helperBlock;
    /** @type {?} */
    AngularDraggableDirective.prototype.started;
    /** @type {?} */
    AngularDraggableDirective.prototype.stopped;
    /** @type {?} */
    AngularDraggableDirective.prototype.edge;
    /**
     * Make the handle HTMLElement draggable
     * @type {?}
     */
    AngularDraggableDirective.prototype.handle;
    /**
     * Set the bounds HTMLElement
     * @type {?}
     */
    AngularDraggableDirective.prototype.bounds;
    /**
     * List of allowed out of bounds edges *
     * @type {?}
     */
    AngularDraggableDirective.prototype.outOfBounds;
    /**
     * Round the position to nearest grid
     * @type {?}
     */
    AngularDraggableDirective.prototype.gridSize;
    /**
     * Set z-index when dragging
     * @type {?}
     */
    AngularDraggableDirective.prototype.zIndexMoving;
    /**
     * Whether to limit the element stay in the bounds
     * @type {?}
     */
    AngularDraggableDirective.prototype.inBounds;
    /**
     * Whether the element should use it's previous drag position on a new drag event.
     * @type {?}
     */
    AngularDraggableDirective.prototype.trackPosition;
    /**
     * Input css scale transform of element so translations are correct
     * @type {?}
     */
    AngularDraggableDirective.prototype.scale;
    /**
     * Whether to prevent default event
     * @type {?}
     */
    AngularDraggableDirective.prototype.preventDefaultEvent;
    /**
     * Set initial position by offsets
     * @type {?}
     */
    AngularDraggableDirective.prototype.position;
    /**
     * Emit position offsets when moving
     * @type {?}
     */
    AngularDraggableDirective.prototype.movingOffset;
    /**
     * Emit position offsets when put back
     * @type {?}
     */
    AngularDraggableDirective.prototype.endOffset;
    /** @type {?} */
    AngularDraggableDirective.prototype.el;
    /** @type {?} */
    AngularDraggableDirective.prototype.renderer;
    /** @type {?} */
    AngularDraggableDirective.prototype.zone;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUNiLFlBQVksRUFDYyxNQUFNLEVBQ2pDLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNckQsTUFBTTs7Ozs7O0lBcUZKLFlBQW9CLEVBQWMsRUFDZCxVQUNBO1FBRkEsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRO1FBQ1IsU0FBSSxHQUFKLElBQUk7eUJBdEZKLElBQUk7c0JBQ1AsS0FBSzt1QkFDTSxJQUFJO3dCQUNiLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ2pCLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ2xCLEVBQUU7dUJBQ0osRUFBRTs2QkFDSSxLQUFLOzs7Ozs0QkFVTyxJQUFJO3VCQUVwQixJQUFJLFlBQVksRUFBTzt1QkFDdkIsSUFBSSxZQUFZLEVBQU87b0JBQzFCLElBQUksWUFBWSxFQUFPOzs7OzJCQVNqQjtZQUNyQixHQUFHLEVBQUUsS0FBSztZQUNWLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsS0FBSztTQUNaOzs7O3dCQUdtQixDQUFDOzs7O3dCQVdELEtBQUs7Ozs7NkJBR0EsSUFBSTs7OztxQkFHWixDQUFDOzs7O21DQUdhLEtBQUs7Ozs7d0JBR0wsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7Ozs7NEJBR3BCLElBQUksWUFBWSxFQUFhOzs7O3lCQUdoQyxJQUFJLFlBQVksRUFBYTtRQW9CakQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2pFOzs7Ozs7SUE1Q0QsSUFBYSxNQUFNLENBQUMsT0FBZTtRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7S0FDeEI7Ozs7O0lBc0JELElBQ0ksV0FBVyxDQUFDLE9BQVk7UUFDMUIsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUUzQixxQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFFaEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNqRDtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNwRDtTQUNGO0tBQ0Y7Ozs7SUFRRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ25CLHFCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztZQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDakQ7UUFFRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDdEI7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRSxxQkFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUV6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3RCO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3ZCO2dCQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQjtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2FBQzNCO1NBQ0Y7S0FDRjs7OztJQUVELGVBQWU7UUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7S0FDRjs7OztJQUVELGFBQWE7UUFDWCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3ZCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDbEI7Ozs7O0lBRU8sTUFBTSxDQUFDLENBQVc7UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUVqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN6RDtZQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3RDLENBQUMsQ0FBQyxDQUFDO1NBQ0w7Ozs7O0lBR0ssU0FBUztRQUVmLHFCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNwRCxxQkFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7O1FBR3BELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDcEUsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3JFO1FBRUQscUJBQUksS0FBSyxHQUFHLGFBQWEsVUFBVSxPQUFPLFVBQVUsS0FBSyxDQUFDO1FBRTFELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7OztJQUcvRCxNQUFNOztRQUVaLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTlGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuRztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDN0U7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjs7Ozs7SUFHSCxXQUFXO1FBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIscUJBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNuRCxxQkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN6RCxxQkFBSSxNQUFNLEdBQUc7Z0JBQ1gsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUc7Z0JBQzVELE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLO2dCQUNwRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTTtnQkFDeEUsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUk7YUFDakUsQ0FBQztZQUVGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzVEO2dCQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDbEU7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUNoRTtnQkFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7aUJBQzlEO2dCQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQjtZQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDZjtLQUNGOzs7O0lBRU8sT0FBTztRQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEU7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDMUU7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Y7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7O1lBRzlELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNsQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUN2QjtnQkFFRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2FBQzVCO1lBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDdEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN0QyxDQUFDLENBQUMsQ0FBQztZQUVKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkM7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUNsQjtTQUNGOzs7Ozs7O0lBR0gsaUJBQWlCLENBQUMsTUFBbUIsRUFBRSxPQUFnQjs7OztRQUtyRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNkOztRQUdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDYjs7UUFHRCxHQUFHLENBQUMsQ0FBQyxxQkFBSSxLQUFLLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUM7aUJBQ2I7YUFDRjtTQUNGOzs7UUFJRCxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2Q7Ozs7SUFFTyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxLQUE4QixFQUFFLEVBQUU7O2dCQUVsSCxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksVUFBVSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDO2lCQUNSOztnQkFFRCxxQkFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUUsTUFBTSxDQUFDO2lCQUNSO2dCQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2lCQUN4QjtnQkFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNmLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDdkUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2hCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRTtnQkFDMUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2hCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLENBQUMsS0FBOEIsRUFBRSxFQUFFO2dCQUN2RyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztxQkFDeEI7O29CQUdELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN4QzthQUNGLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQzs7OztZQTNXTixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRSxhQUFhO2FBQ3hCOzs7O1lBWlksVUFBVTtZQUFFLFNBQVM7WUFHTixNQUFNOzs7c0JBOEIvQixNQUFNO3NCQUNOLE1BQU07bUJBQ04sTUFBTTtxQkFHTixLQUFLO3FCQUdMLEtBQUs7MEJBR0wsS0FBSzt1QkFRTCxLQUFLOzJCQUdMLEtBQUs7cUJBR0wsS0FBSzt1QkFLTCxLQUFLOzRCQUdMLEtBQUs7b0JBR0wsS0FBSztrQ0FHTCxLQUFLO3VCQUdMLEtBQUs7MkJBR0wsTUFBTTt3QkFHTixNQUFNOzBCQUVOLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LFxuICBFdmVudEVtaXR0ZXIsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcyxcbiAgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBvbGRaSW5kZXggPSAnJztcbiAgcHJpdmF0ZSBfekluZGV4ID0gJyc7XG4gIHByaXZhdGUgbmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjE6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX3JlbW92ZUxpc3RlbmVyMjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVtb3ZlTGlzdGVuZXIzOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZW1vdmVMaXN0ZW5lcjQ6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBAT3V0cHV0KCkgc3RhcnRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc3RvcHBlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgZWRnZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKiBNYWtlIHRoZSBoYW5kbGUgSFRNTEVsZW1lbnQgZHJhZ2dhYmxlICovXG4gIEBJbnB1dCgpIGhhbmRsZTogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFNldCB0aGUgYm91bmRzIEhUTUxFbGVtZW50ICovXG4gIEBJbnB1dCgpIGJvdW5kczogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIExpc3Qgb2YgYWxsb3dlZCBvdXQgb2YgYm91bmRzIGVkZ2VzICoqL1xuICBASW5wdXQoKSBvdXRPZkJvdW5kcyA9IHtcbiAgICB0b3A6IGZhbHNlLFxuICAgIHJpZ2h0OiBmYWxzZSxcbiAgICBib3R0b206IGZhbHNlLFxuICAgIGxlZnQ6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFJvdW5kIHRoZSBwb3NpdGlvbiB0byBuZWFyZXN0IGdyaWQgKi9cbiAgQElucHV0KCkgZ3JpZFNpemUgPSAxO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHpJbmRleE1vdmluZzogc3RyaW5nO1xuXG4gIC8qKiBTZXQgei1pbmRleCB3aGVuIG5vdCBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSBzZXQgekluZGV4KHNldHRpbmc6IHN0cmluZykge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHNldHRpbmcpO1xuICAgIHRoaXMuX3pJbmRleCA9IHNldHRpbmc7XG4gIH1cbiAgLyoqIFdoZXRoZXIgdG8gbGltaXQgdGhlIGVsZW1lbnQgc3RheSBpbiB0aGUgYm91bmRzICovXG4gIEBJbnB1dCgpIGluQm91bmRzID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgc2hvdWxkIHVzZSBpdCdzIHByZXZpb3VzIGRyYWcgcG9zaXRpb24gb24gYSBuZXcgZHJhZyBldmVudC4gKi9cbiAgQElucHV0KCkgdHJhY2tQb3NpdGlvbiA9IHRydWU7XG5cbiAgLyoqIElucHV0IGNzcyBzY2FsZSB0cmFuc2Zvcm0gb2YgZWxlbWVudCBzbyB0cmFuc2xhdGlvbnMgYXJlIGNvcnJlY3QgKi9cbiAgQElucHV0KCkgc2NhbGUgPSAxO1xuXG4gIC8qKiBXaGV0aGVyIHRvIHByZXZlbnQgZGVmYXVsdCBldmVudCAqL1xuICBASW5wdXQoKSBwcmV2ZW50RGVmYXVsdEV2ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFNldCBpbml0aWFsIHBvc2l0aW9uIGJ5IG9mZnNldHMgKi9cbiAgQElucHV0KCkgcG9zaXRpb246IElQb3NpdGlvbiA9IHsgeDogMCwgeTogMCB9O1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBtb3ZpbmcgKi9cbiAgQE91dHB1dCgpIG1vdmluZ09mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBwdXQgYmFjayAqL1xuICBAT3V0cHV0KCkgZW5kT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG5nRHJhZ2dhYmxlKHNldHRpbmc6IGFueSkge1xuICAgIGlmIChzZXR0aW5nICE9PSB1bmRlZmluZWQgJiYgc2V0dGluZyAhPT0gbnVsbCAmJiBzZXR0aW5nICE9PSAnJykge1xuICAgICAgdGhpcy5hbGxvd0RyYWcgPSAhIXNldHRpbmc7XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5oYW5kbGUgPyB0aGlzLmhhbmRsZSA6IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmJvdW5kcyA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMub3JpZ25hbCA9IG51bGw7XG4gICAgdGhpcy5vbGRUcmFucyA9IG51bGw7XG4gICAgdGhpcy50ZW1wVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIxKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIyKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIzKCk7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0KCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgIWNoYW5nZXNbJ3Bvc2l0aW9uJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICBsZXQgcCA9IGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlO1xuXG4gICAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbihwKSkge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgdGhpcy5ib3VuZHNDaGVjaygpO1xuICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQoe3g6IHAueCAvIHRoaXMuc2NhbGUsIHk6IHAueSAvIHRoaXMuc2NhbGV9KTtcbiAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMubW92aW5nT2Zmc2V0LmVtaXQoe1xuICAgICAgICB4OiB0aGlzLnRlbXBUcmFucy54ICsgdGhpcy5vbGRUcmFucy54LFxuICAgICAgICB5OiB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG5cbiAgICBsZXQgdHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zLnggKyB0aGlzLm9sZFRyYW5zLng7XG4gICAgbGV0IHRyYW5zbGF0ZVkgPSB0aGlzLnRlbXBUcmFucy55ICsgdGhpcy5vbGRUcmFucy55O1xuXG4gICAgLy8gU25hcCB0byBncmlkOiBieSBncmlkIHNpemVcbiAgICBpZiAodGhpcy5ncmlkU2l6ZSA+IDEpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVggLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgICB0cmFuc2xhdGVZID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVZIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgIH1cblxuICAgIGxldCB2YWx1ZSA9IGB0cmFuc2xhdGUoJHt0cmFuc2xhdGVYfXB4LCAke3RyYW5zbGF0ZVl9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIHBpY2tVcCgpIHtcbiAgICAvLyBnZXQgb2xkIHotaW5kZXg6XG4gICAgdGhpcy5vbGRaSW5kZXggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA6ICcnO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgdGhpcy5vbGRaSW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy56SW5kZXhNb3ZpbmcpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuekluZGV4TW92aW5nKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCkpO1xuICAgICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJvdW5kc0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgbGV0IGJvdW5kYXJ5ID0gdGhpcy5ib3VuZHMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgZWxlbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCByZXN1bHQgPSB7XG4gICAgICAgICd0b3AnOiB0aGlzLm91dE9mQm91bmRzLnRvcCA/IHRydWUgOiBib3VuZGFyeS50b3AgPCBlbGVtLnRvcCxcbiAgICAgICAgJ3JpZ2h0JzogdGhpcy5vdXRPZkJvdW5kcy5yaWdodCA/IHRydWUgOiBib3VuZGFyeS5yaWdodCA+IGVsZW0ucmlnaHQsXG4gICAgICAgICdib3R0b20nOiB0aGlzLm91dE9mQm91bmRzLmJvdHRvbSA/IHRydWUgOiBib3VuZGFyeS5ib3R0b20gPiBlbGVtLmJvdHRvbSxcbiAgICAgICAgJ2xlZnQnOiB0aGlzLm91dE9mQm91bmRzLmxlZnQgPyB0cnVlIDogYm91bmRhcnkubGVmdCA8IGVsZW0ubGVmdFxuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgICAgaWYgKCFyZXN1bHQudG9wKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS50b3AgLSBib3VuZGFyeS50b3ApIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmJvdHRvbSkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0uYm90dG9tIC0gYm91bmRhcnkuYm90dG9tKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5yaWdodCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ucmlnaHQgLSBib3VuZGFyeS5yaWdodCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubGVmdCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnggLT0gKGVsZW0ubGVmdCAtIGJvdW5kYXJ5LmxlZnQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpKTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB0aGlzLmVuZE9mZnNldC5lbWl0KHtcbiAgICAgICAgeDogdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueCxcbiAgICAgICAgeTogdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueVxuICAgICAgfSkpO1xuXG4gICAgICBpZiAodGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcblxuICAgICAgaWYgKCF0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0hhbmRsZVRhcmdldCh0YXJnZXQ6IEV2ZW50VGFyZ2V0LCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgLy8gQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaXMgdGhlIGVsZW1lbnQgY2xpY2tlZCwgdGhlbiBjaGVja3MgZWFjaCBjaGlsZCBlbGVtZW50IG9mIGVsZW1lbnQgYXMgd2VsbFxuICAgIC8vIElnbm9yZXMgYnV0dG9uIGNsaWNrc1xuXG4gICAgLy8gSWdub3JlIGVsZW1lbnRzIG9mIHR5cGUgYnV0dG9uXG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IHdhcyBmb3VuZCwgcmV0dXJuIHRydWUgKGhhbmRsZSB3YXMgZm91bmQpXG4gICAgaWYgKGVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gUmVjdXJzaXZlbHkgaXRlcmF0ZSB0aGlzIGVsZW1lbnRzIGNoaWxkcmVuXG4gICAgZm9yIChsZXQgY2hpbGQgaW4gZWxlbWVudC5jaGlsZHJlbikge1xuICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgZWxlbWVudC5jaGlsZHJlbltjaGlsZF0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgd2FzIG5vdCBmb3VuZCBpbiB0aGlzIGxpbmVhZ2VcbiAgICAvLyBOb3RlOiByZXR1cm4gZmFsc2UgaXMgaWdub3JlIHVubGVzcyBpdCBpcyB0aGUgcGFyZW50IGVsZW1lbnRcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjEgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgICAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLnBpY2tVcCgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcjIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3JlbW92ZUxpc3RlbmVyMyA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnB1dEJhY2soKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXI0ID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNlbW92ZScsIChldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJldmVudERlZmF1bHRFdmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICAgICAgdGhpcy5tb3ZlVG8oUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=