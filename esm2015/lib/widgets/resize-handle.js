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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLE1BQU07Ozs7Ozs7O0lBSUosWUFDWSxNQUFlLEVBQ2YsUUFBbUIsRUFDdEIsTUFDQSxLQUNDO1FBSkUsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDdEIsU0FBSSxHQUFKLElBQUk7UUFDSixRQUFHLEdBQUgsR0FBRztRQUNGLGdCQUFXLEdBQVgsV0FBVzs7UUFHbkIscUJBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUNqRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQzs7UUFHL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztTQUNwRDs7UUFHRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCOztRQUdELElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzFELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztRQUd0RCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUN2Qjs7OztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRS9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCOzs7O0lBRUQsSUFBSSxFQUFFO1FBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgUmVzaXplSGFuZGxlIHtcbiAgcHJvdGVjdGVkIF9oYW5kbGU6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX29uUmVzaXplO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IEVsZW1lbnQsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHR5cGU6IHN0cmluZyxcbiAgICBwdWJsaWMgY3NzOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bjogYW55XG4gICkge1xuICAgIC8vIGdlbmVyYXRlIGhhbmRsZSBkaXZcbiAgICBsZXQgaGFuZGxlID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCAnbmctcmVzaXphYmxlLWhhbmRsZScpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgY3NzKTtcblxuICAgIC8vIGFkZCBkZWZhdWx0IGRpYWdvbmFsIGZvciBzZSBoYW5kbGVcbiAgICBpZiAodHlwZSA9PT0gJ3NlJykge1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCAnbmctcmVzaXphYmxlLWRpYWdvbmFsJyk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGRpdiB0byBwYXJlbnRcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChoYW5kbGUpO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhbmQgcmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLl9vblJlc2l6ZSA9IChldmVudCkgPT4geyBvbk1vdXNlRG93bihldmVudCwgdGhpcyk7IH07XG4gICAgaGFuZGxlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX29uUmVzaXplKTtcbiAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX29uUmVzaXplKTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oYW5kbGUgPSBoYW5kbGU7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2hhbmRsZS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG4gICAgdGhpcy5faGFuZGxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hhbmRsZSk7XG4gICAgfVxuICAgIHRoaXMuX2hhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5fb25SZXNpemUgPSBudWxsO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGU7XG4gIH1cbn1cbiJdfQ==