/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ResizeHandle = /** @class */ (function () {
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
         */
        function () {
            return this._handle;
        },
        enumerable: true,
        configurable: true
    });
    return ResizeHandle;
}());
export { ResizeHandle };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQUE7SUFJRSxzQkFDWSxNQUFlLEVBQ2YsUUFBbUIsRUFDdEIsTUFDQSxLQUNDO1FBTFYsaUJBdUJDO1FBdEJXLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3RCLFNBQUksR0FBSixJQUFJO1FBQ0osUUFBRyxHQUFILEdBQUc7UUFDRixnQkFBVyxHQUFYLFdBQVc7O1FBR25CLHFCQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDakQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O1FBRy9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7O1FBR0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLEtBQUssSUFBTyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7UUFHckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDdkI7Ozs7SUFFRCw4QkFBTzs7O0lBQVA7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7S0FDdkI7SUFFRCxzQkFBSSw0QkFBRTs7OztRQUFOO1lBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7OztPQUFBO3VCQTNDSDtJQTRDQyxDQUFBO0FBMUNELHdCQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgUmVzaXplSGFuZGxlIHtcbiAgcHJvdGVjdGVkIF9oYW5kbGU6IEVsZW1lbnQ7XG4gIHByaXZhdGUgX29uUmVzaXplO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IEVsZW1lbnQsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIHR5cGU6IHN0cmluZyxcbiAgICBwdWJsaWMgY3NzOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bjogYW55XG4gICkge1xuICAgIC8vIGdlbmVyYXRlIGhhbmRsZSBkaXZcbiAgICBsZXQgaGFuZGxlID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoaGFuZGxlLCAnbmctcmVzaXphYmxlLWhhbmRsZScpO1xuICAgIHJlbmRlcmVyLmFkZENsYXNzKGhhbmRsZSwgY3NzKTtcblxuICAgIC8vIGFwcGVuZCBkaXYgdG8gcGFyZW50XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaGFuZGxlKTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYW5kIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAgdGhpcy5fb25SZXNpemUgPSAoZXZlbnQpID0+IHsgb25Nb3VzZURvd24oZXZlbnQsIHRoaXMpOyB9O1xuICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vblJlc2l6ZSk7XG5cbiAgICAvLyBkb25lXG4gICAgdGhpcy5faGFuZGxlID0gaGFuZGxlO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oYW5kbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fb25SZXNpemUpO1xuXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLl9oYW5kbGUpO1xuICAgIH1cbiAgICB0aGlzLl9oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuX29uUmVzaXplID0gbnVsbDtcbiAgfVxuXG4gIGdldCBlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlO1xuICB9XG59XG4iXX0=