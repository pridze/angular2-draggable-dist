/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
export function ISize() { }
function ISize_tsickle_Closure_declarations() {
    /** @type {?} */
    ISize.prototype.width;
    /** @type {?} */
    ISize.prototype.height;
}
var Size = /** @class */ (function () {
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
export { Size };
function Size_tsickle_Closure_declarations() {
    /** @type {?} */
    Size.prototype.width;
    /** @type {?} */
    Size.prototype.height;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9tb2RlbHMvc2l6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUtBLElBQUE7SUFDRSxjQUFtQixLQUFhLEVBQVMsTUFBYztRQUFwQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtLQUFLOzs7OztJQUVyRCxlQUFVOzs7O0lBQWpCLFVBQWtCLEVBQVc7UUFDM0IscUJBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1gscUJBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2pFO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztTQUNiO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztTQUNiO0tBQ0Y7Ozs7O0lBRU0sU0FBSTs7OztJQUFYLFVBQVksQ0FBTztRQUNqQixNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5Qjs7Ozs7SUFFRCxrQkFBRzs7OztJQUFILFVBQUksQ0FBUTtRQUNWLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNiO2VBaENIO0lBaUNDLENBQUE7QUE1QkQsZ0JBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJU2l6ZSB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU2l6ZSBpbXBsZW1lbnRzIElTaXplIHtcbiAgY29uc3RydWN0b3IocHVibGljIHdpZHRoOiBudW1iZXIsIHB1YmxpYyBoZWlnaHQ6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGdldEN1cnJlbnQoZWw6IEVsZW1lbnQpIHtcbiAgICBsZXQgc2l6ZSA9IG5ldyBTaXplKDAsIDApO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgc2l6ZS53aWR0aCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyksIDEwKTtcbiAgICAgICAgc2l6ZS5oZWlnaHQgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKSwgMTApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShzOiBTaXplKSB7XG4gICAgcmV0dXJuIG5ldyBTaXplKDAsIDApLnNldChzKTtcbiAgfVxuXG4gIHNldChzOiBJU2l6ZSkge1xuICAgIHRoaXMud2lkdGggPSBzLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gcy5oZWlnaHQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==