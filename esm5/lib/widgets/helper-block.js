/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var HelperBlock = /** @class */ (function () {
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
         */
        function () {
            return this._helper;
        },
        enumerable: true,
        configurable: true
    });
    return HelperBlock;
}());
export { HelperBlock };
function HelperBlock_tsickle_Closure_declarations() {
    /** @type {?} */
    HelperBlock.prototype._helper;
    /** @type {?} */
    HelperBlock.prototype._added;
    /** @type {?} */
    HelperBlock.prototype.parent;
    /** @type {?} */
    HelperBlock.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWJsb2NrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldHMvaGVscGVyLWJsb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxJQUFBO0lBSUUscUJBQ1ksTUFBZSxFQUNmLFFBQW1CO1FBRG5CLFdBQU0sR0FBTixNQUFNLENBQVM7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFXO3NCQUpkLEtBQUs7O1FBT3BCLHFCQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzdELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7O1FBR3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQ3ZCOzs7O0lBRUQseUJBQUc7OztJQUFIOztRQUVFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7S0FDRjs7OztJQUVELDRCQUFNOzs7SUFBTjtRQUNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0tBQ0Y7Ozs7SUFFRCw2QkFBTzs7O0lBQVA7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNyQjtJQUVELHNCQUFJLDJCQUFFOzs7O1FBQU47WUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNyQjs7O09BQUE7c0JBN0NIO0lBOENDLENBQUE7QUE1Q0QsdUJBNENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBIZWxwZXJCbG9jayB7XG4gIHByb3RlY3RlZCBfaGVscGVyOiBFbGVtZW50O1xuICBwcml2YXRlIF9hZGRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBwYXJlbnQ6IEVsZW1lbnQsXG4gICAgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7XG4gICAgLy8gZ2VuZXJhdGUgaGVscGVyIGRpdlxuICAgIGxldCBoZWxwZXIgPSByZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ3dpZHRoJywgJzEwMCUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdoZWlnaHQnLCAnMTAwJScpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2JhY2tncm91bmQtY29sb3InLCAndHJhbnNwYXJlbnQnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICd0b3AnLCAnMCcpO1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGhlbHBlciwgJ2xlZnQnLCAnMCcpO1xuXG4gICAgLy8gZG9uZVxuICAgIHRoaXMuX2hlbHBlciA9IGhlbHBlcjtcbiAgfVxuXG4gIGFkZCgpIHtcbiAgICAvLyBhcHBlbmQgZGl2IHRvIHBhcmVudFxuICAgIGlmICh0aGlzLnBhcmVudCAmJiAhdGhpcy5fYWRkZWQpIHtcbiAgICAgIHRoaXMucGFyZW50LmFwcGVuZENoaWxkKHRoaXMuX2hlbHBlcik7XG4gICAgICB0aGlzLl9hZGRlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLl9hZGRlZCkge1xuICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5faGVscGVyKTtcbiAgICAgIHRoaXMuX2FkZGVkID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9oZWxwZXIgPSBudWxsO1xuICAgIHRoaXMuX2FkZGVkID0gZmFsc2U7XG4gIH1cblxuICBnZXQgZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlbHBlcjtcbiAgfVxufVxuIl19