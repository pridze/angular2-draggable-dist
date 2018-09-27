import { ElementRef, Renderer2, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { IPosition } from './models/position';
export declare class AngularDraggableDirective implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    private el;
    private renderer;
    private zone;
    private allowDrag;
    private moving;
    private orignal;
    private oldTrans;
    private tempTrans;
    private oldZIndex;
    private _zIndex;
    private needTransform;
    private _removeListener1;
    private _removeListener2;
    private _removeListener3;
    private _removeListener4;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     */
    private _helperBlock;
    started: EventEmitter<any>;
    stopped: EventEmitter<any>;
    edge: EventEmitter<any>;
    /** Make the handle HTMLElement draggable */
    handle: HTMLElement;
    /** Set the bounds HTMLElement */
    bounds: HTMLElement;
    /** List of allowed out of bounds edges **/
    outOfBounds: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    /** Round the position to nearest grid */
    gridSize: number;
    /** Set z-index when dragging */
    zIndexMoving: string;
    /** Set z-index when not dragging */
    zIndex: string;
    /** Whether to limit the element stay in the bounds */
    inBounds: boolean;
    /** Whether the element should use it's previous drag position on a new drag event. */
    trackPosition: boolean;
    /** Input css scale transform of element so translations are correct */
    scale: number;
    /** Whether to prevent default event */
    preventDefaultEvent: boolean;
    /** Set initial position by offsets */
    position: IPosition;
    /** Emit position offsets when moving */
    movingOffset: EventEmitter<IPosition>;
    /** Emit position offsets when put back */
    endOffset: EventEmitter<IPosition>;
    ngDraggable: any;
    constructor(el: ElementRef, renderer: Renderer2, zone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    resetPosition(): void;
    private moveTo(p);
    private transform();
    private pickUp();
    boundsCheck(): {
        'top': boolean;
        'right': boolean;
        'bottom': boolean;
        'left': boolean;
    };
    private putBack();
    checkHandleTarget(target: EventTarget, element: Element): boolean;
    private _bindEvents();
}
