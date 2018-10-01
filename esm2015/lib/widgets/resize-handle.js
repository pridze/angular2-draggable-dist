/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
export class ResizeHandle {
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
        // append div to parent
        if (this.parent) {
            parent.appendChild(handle);
        }
        // create and register event listener
        this._onResize = (event) => { onMouseDown(event, this); };
        handle.addEventListener('mousedown', this._onResize);
        // done
        this._handle = handle;
    }
    /**
     * @return {?}
     */
    dispose() {
        this._handle.removeEventListener('mousedown', this._onResize);
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
function ResizeHandle_tsickle_Closure_declarations() {
    /** @type {?} */
    ResizeHandle.prototype._handle;
    /** @type {?} */
    ResizeHandle.prototype._onResize;
    /** @type {?} */
    ResizeHandle.prototype.parent;
    /** @type {?} */
    ResizeHandle.prototype.renderer;
    /** @type {?} */
    ResizeHandle.prototype.type;
    /** @type {?} */
    ResizeHandle.prototype.css;
    /** @type {?} */
    ResizeHandle.prototype.onMouseDown;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU07Ozs7Ozs7O0lBSUosWUFDWSxNQUFlLEVBQ2YsUUFBbUIsRUFDdEIsTUFDQSxLQUNDO1FBSkUsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDdEIsU0FBSSxHQUFKLElBQUk7UUFDSixRQUFHLEdBQUgsR0FBRztRQUNGLGdCQUFXLEdBQVgsV0FBVzs7UUFHbkIscUJBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUNqRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQzs7UUFHL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1Qjs7UUFHRCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7UUFHckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDdkI7Ozs7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCOzs7O0lBRUQsSUFBSSxFQUFFO1FBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgUmVzaXplSGFuZGxlIHtcbiAgcHJvdGVjdGVkIF9oYW5kbGU6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX29uUmVzaXplO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IEVsZW1lbnQsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHR5cGU6IHN0cmluZyxcbiAgICBwdWJsaWMgY3NzOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bjogYW55XG4gICkge1xuICAgIC8vIGdlbmVyYXRlIGhhbmRsZSBkaXZcbiAgICBsZXQgaGFuZGxlID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCAnbmctcmVzaXphYmxlLWhhbmRsZScpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgY3NzKTtcblxuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYW5kIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAgdGhpcy5fb25SZXNpemUgPSAoZXZlbnQpID0+IHsgb25Nb3VzZURvd24oZXZlbnQsIHRoaXMpOyB9O1xuICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGFuZGxlID0gaGFuZGxlO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oYW5kbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oYW5kbGUpO1xuICAgIH1cbiAgICB0aGlzLl9oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuX29uUmVzaXplID0gbnVsbDtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xuICB9XG59XG4iXX0=