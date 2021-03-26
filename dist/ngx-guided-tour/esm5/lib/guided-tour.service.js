/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { debounceTime } from 'rxjs/operators';
import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { Orientation } from './guided-tour.constants';
import cloneDeep from 'lodash/cloneDeep';
import { DOCUMENT } from "@angular/common";
import { WindowRefService } from "./windowref.service";
var GuidedTourService = /** @class */ (function () {
    function GuidedTourService(errorHandler, windowRef, dom) {
        var _this = this;
        this.errorHandler = errorHandler;
        this.windowRef = windowRef;
        this.dom = dom;
        this._guidedTourCurrentStepSubject = new Subject();
        this._guidedTourOrbShowingSubject = new Subject();
        this._currentTourStepIndex = 0;
        this._currentTour = null;
        this._onFirstStep = true;
        this._onLastStep = true;
        this._onResizeMessage = false;
        this.guidedTourCurrentStepStream = this._guidedTourCurrentStepSubject.asObservable();
        this.guidedTourOrbShowingStream = this._guidedTourOrbShowingSubject.asObservable();
        fromEvent(this.windowRef.nativeWindow, 'resize').pipe(debounceTime(200)).subscribe((/**
         * @return {?}
         */
        function () {
            if (_this._currentTour && _this._currentTourStepIndex > -1) {
                if (_this._currentTour.minimumScreenSize && _this._currentTour.minimumScreenSize >= _this.windowRef.nativeWindow.innerWidth) {
                    _this._onResizeMessage = true;
                    /** @type {?} */
                    var dialog = _this._currentTour.resizeDialog || {
                        title: 'Please resize',
                        content: 'You have resized the tour to a size that is too small to continue. Please resize the browser to a larger size to continue the tour or close the tour.'
                    };
                    _this._guidedTourCurrentStepSubject.next(dialog);
                }
                else {
                    _this._onResizeMessage = false;
                    _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    GuidedTourService.prototype.nextStep = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._currentTour.steps[this._currentTourStepIndex].closeAction) {
            this._currentTour.steps[this._currentTourStepIndex].closeAction();
        }
        if (this._currentTour.steps[this._currentTourStepIndex + 1]) {
            this._currentTourStepIndex++;
            this._setFirstAndLast();
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
                // Usually an action is opening something so we need to give it time to render.
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (_this._checkSelectorValidity()) {
                        _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                    }
                    else {
                        _this.nextStep();
                    }
                }));
            }
            else {
                if (this._checkSelectorValidity()) {
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
                else {
                    this.nextStep();
                }
            }
        }
        else {
            if (this._currentTour.completeCallback) {
                this._currentTour.completeCallback();
            }
            this.resetTour();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.backStep = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._currentTour.steps[this._currentTourStepIndex].closeAction) {
            this._currentTour.steps[this._currentTourStepIndex].closeAction();
        }
        if (this._currentTour.steps[this._currentTourStepIndex - 1]) {
            this._currentTourStepIndex--;
            this._setFirstAndLast();
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (_this._checkSelectorValidity()) {
                        _this._guidedTourCurrentStepSubject.next(_this.getPreparedTourStep(_this._currentTourStepIndex));
                    }
                    else {
                        _this.backStep();
                    }
                }));
            }
            else {
                if (this._checkSelectorValidity()) {
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
                else {
                    this.backStep();
                }
            }
        }
        else {
            this.resetTour();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.skipTour = /**
     * @return {?}
     */
    function () {
        if (this._currentTour.skipCallback) {
            this._currentTour.skipCallback(this._currentTourStepIndex);
        }
        this.resetTour();
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.resetTour = /**
     * @return {?}
     */
    function () {
        this.dom.body.classList.remove('tour-open');
        this._currentTour = null;
        this._currentTourStepIndex = 0;
        this._guidedTourCurrentStepSubject.next(null);
    };
    /**
     * @param {?} tour
     * @return {?}
     */
    GuidedTourService.prototype.startTour = /**
     * @param {?} tour
     * @return {?}
     */
    function (tour) {
        this._currentTour = cloneDeep(tour);
        this._currentTour.steps = this._currentTour.steps.filter((/**
         * @param {?} step
         * @return {?}
         */
        function (step) { return !step.skipStep; }));
        this._currentTourStepIndex = 0;
        this._setFirstAndLast();
        this._guidedTourOrbShowingSubject.next(this._currentTour.useOrb);
        if (this._currentTour.steps.length > 0
            && (!this._currentTour.minimumScreenSize
                || (this.windowRef.nativeWindow.innerWidth >= this._currentTour.minimumScreenSize))) {
            if (!this._currentTour.useOrb) {
                this.dom.body.classList.add('tour-open');
            }
            if (this._currentTour.steps[this._currentTourStepIndex].action) {
                this._currentTour.steps[this._currentTourStepIndex].action();
            }
            if (this._checkSelectorValidity()) {
                this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
            }
            else {
                this.nextStep();
            }
        }
    };
    /**
     * @return {?}
     */
    GuidedTourService.prototype.activateOrb = /**
     * @return {?}
     */
    function () {
        this._guidedTourOrbShowingSubject.next(false);
        this.dom.body.classList.add('tour-open');
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourService.prototype._setFirstAndLast = /**
     * @private
     * @return {?}
     */
    function () {
        this._onLastStep = (this._currentTour.steps.length - 1) === this._currentTourStepIndex;
        this._onFirstStep = this._currentTourStepIndex === 0;
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourService.prototype._checkSelectorValidity = /**
     * @private
     * @return {?}
     */
    function () {
        if (this._currentTour.steps[this._currentTourStepIndex].selector) {
            /** @type {?} */
            var selectedElement = this.dom.querySelector(this._currentTour.steps[this._currentTourStepIndex].selector);
            if (!selectedElement) {
                this.errorHandler.handleError(
                // If error handler is configured this should not block the browser.
                new Error("Error finding selector " + this._currentTour.steps[this._currentTourStepIndex].selector + " on step " + (this._currentTourStepIndex + 1) + " during guided tour: " + this._currentTour.tourId));
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(GuidedTourService.prototype, "onLastStep", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onLastStep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "onFirstStep", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onFirstStep;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "onResizeMessage", {
        get: /**
         * @return {?}
         */
        function () {
            return this._onResizeMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "currentTourStepDisplay", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTourStepIndex + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "currentTourStepCount", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTour && this._currentTour.steps ? this._currentTour.steps.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourService.prototype, "preventBackdropFromAdvancing", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentTour && this._currentTour.preventBackdropFromAdvancing;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    GuidedTourService.prototype.getPreparedTourStep = /**
     * @private
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this.setTourOrientation(this._currentTour.steps[index]);
    };
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    GuidedTourService.prototype.setTourOrientation = /**
     * @private
     * @param {?} step
     * @return {?}
     */
    function (step) {
        var _this = this;
        /** @type {?} */
        var convertedStep = cloneDeep(step);
        if (convertedStep.orientation
            && !(typeof convertedStep.orientation === 'string')
            && ((/** @type {?} */ (convertedStep.orientation))).length) {
            ((/** @type {?} */ (convertedStep.orientation))).sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            function (a, b) {
                if (!b.maximumSize) {
                    return 1;
                }
                if (!a.maximumSize) {
                    return -1;
                }
                return b.maximumSize - a.maximumSize;
            }));
            /** @type {?} */
            var currentOrientation_1 = Orientation.Top;
            ((/** @type {?} */ (convertedStep.orientation))).forEach((/**
             * @param {?} orientationConfig
             * @return {?}
             */
            function (orientationConfig) {
                if (!orientationConfig.maximumSize || _this.windowRef.nativeWindow.innerWidth <= orientationConfig.maximumSize) {
                    currentOrientation_1 = orientationConfig.orientationDirection;
                }
            }));
            convertedStep.orientation = currentOrientation_1;
        }
        return convertedStep;
    };
    GuidedTourService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    GuidedTourService.ctorParameters = function () { return [
        { type: ErrorHandler },
        { type: WindowRefService },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    return GuidedTourService;
}());
export { GuidedTourService };
if (false) {
    /** @type {?} */
    GuidedTourService.prototype.guidedTourCurrentStepStream;
    /** @type {?} */
    GuidedTourService.prototype.guidedTourOrbShowingStream;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._guidedTourCurrentStepSubject;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._guidedTourOrbShowingSubject;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._currentTourStepIndex;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._currentTour;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onFirstStep;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onLastStep;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype._onResizeMessage;
    /** @type {?} */
    GuidedTourService.prototype.errorHandler;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype.windowRef;
    /**
     * @type {?}
     * @private
     */
    GuidedTourService.prototype.dom;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImxpYi9ndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBYyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBd0IsV0FBVyxFQUE0QixNQUFNLHlCQUF5QixDQUFDO0FBQ3RHLE9BQU8sU0FBUyxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RDtJQWFJLDJCQUNXLFlBQTBCLEVBQ3pCLFNBQTJCLEVBQ1QsR0FBRztRQUhqQyxpQkF3QkM7UUF2QlUsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDVCxRQUFHLEdBQUgsR0FBRyxDQUFBO1FBWHpCLGtDQUE2QixHQUFHLElBQUksT0FBTyxFQUFZLENBQUM7UUFDeEQsaUNBQTRCLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUN0RCwwQkFBcUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsaUJBQVksR0FBZSxJQUFJLENBQUM7UUFDaEMsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBTzdCLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckYsSUFBSSxDQUFD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QUMsQ0FBQyxXQUFXLENBQUM7WUFDekMsQ0FBQyxFQUFDLENBQUM7O2dCQUVDLG9CQUFrQixHQUFnQixXQUFXLENBQUMsR0FBRztZQUNyRCxDQUFDLG1CQUFBLGFBQWEsQ0FBQyxXQUFXLEVBQThCLENBQUMsQ0FBQyxPQUFPOzs7O1lBQzdELFVBQUMsaUJBQTJDO2dCQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxJQUFJLEtBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7b0JBQzNHLG9CQUFrQixHQUFHLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDO2lCQUMvRDtZQUNMLENBQUMsRUFDSixDQUFDO1lBRUYsYUFBYSxDQUFDLFdBQVcsR0FBRyxvQkFBa0IsQ0FBQztTQUNsRDtRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7O2dCQTNOSixVQUFVOzs7O2dCQVBGLFlBQVk7Z0JBS1osZ0JBQWdCO2dEQWtCaEIsTUFBTSxTQUFDLFFBQVE7O0lBNE14Qix3QkFBQztDQUFBLEFBNU5ELElBNE5DO1NBM05ZLGlCQUFpQjs7O0lBQzFCLHdEQUF5RDs7SUFDekQsdURBQXVEOzs7OztJQUV2RCwwREFBZ0U7Ozs7O0lBQ2hFLHlEQUE4RDs7Ozs7SUFDOUQsa0RBQWtDOzs7OztJQUNsQyx5Q0FBd0M7Ozs7O0lBQ3hDLHlDQUE0Qjs7Ozs7SUFDNUIsd0NBQTJCOzs7OztJQUMzQiw2Q0FBaUM7O0lBRzdCLHlDQUFpQzs7Ozs7SUFDakMsc0NBQW1DOzs7OztJQUNuQyxnQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFcnJvckhhbmRsZXIsIEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBHdWlkZWRUb3VyLCBUb3VyU3RlcCwgT3JpZW50YXRpb24sIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vZ3VpZGVkLXRvdXIuY29uc3RhbnRzJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoL2Nsb25lRGVlcCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IFdpbmRvd1JlZlNlcnZpY2UgfSBmcm9tIFwiLi93aW5kb3dyZWYuc2VydmljZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR3VpZGVkVG91clNlcnZpY2Uge1xuICAgIHB1YmxpYyBndWlkZWRUb3VyQ3VycmVudFN0ZXBTdHJlYW06IE9ic2VydmFibGU8VG91clN0ZXA+O1xuICAgIHB1YmxpYyBndWlkZWRUb3VyT3JiU2hvd2luZ1N0cmVhbTogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICAgIHByaXZhdGUgX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QgPSBuZXcgU3ViamVjdDxUb3VyU3RlcD4oKTtcbiAgICBwcml2YXRlIF9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIHByaXZhdGUgX2N1cnJlbnRUb3VyU3RlcEluZGV4ID0gMDtcbiAgICBwcml2YXRlIF9jdXJyZW50VG91cjogR3VpZGVkVG91ciA9IG51bGw7XG4gICAgcHJpdmF0ZSBfb25GaXJzdFN0ZXAgPSB0cnVlO1xuICAgIHByaXZhdGUgX29uTGFzdFN0ZXAgPSB0cnVlO1xuICAgIHByaXZhdGUgX29uUmVzaXplTWVzc2FnZSA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICAgICAgcHJpdmF0ZSB3aW5kb3dSZWY6IFdpbmRvd1JlZlNlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9tXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3RyZWFtID0gdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyT3JiU2hvd2luZ1N0cmVhbSA9IHRoaXMuX2d1aWRlZFRvdXJPcmJTaG93aW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgICAgICBmcm9tRXZlbnQodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LCAncmVzaXplJykucGlwZShkZWJvdW5jZVRpbWUoMjAwKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ciAmJiB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplICYmIHRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplID49IHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lcldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uUmVzaXplTWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpYWxvZyA9IHRoaXMuX2N1cnJlbnRUb3VyLnJlc2l6ZURpYWxvZyB8fCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BsZWFzZSByZXNpemUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ1lvdSBoYXZlIHJlc2l6ZWQgdGhlIHRvdXIgdG8gYSBzaXplIHRoYXQgaXMgdG9vIHNtYWxsIHRvIGNvbnRpbnVlLiBQbGVhc2UgcmVzaXplIHRoZSBicm93c2VyIHRvIGEgbGFyZ2VyIHNpemUgdG8gY29udGludWUgdGhlIHRvdXIgb3IgY2xvc2UgdGhlIHRvdXIuJ1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dChkaWFsb2cpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uUmVzaXplTWVzc2FnZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmV4dFN0ZXAoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uY2xvc2VBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCArIDFdKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCsrO1xuICAgICAgICAgICAgdGhpcy5fc2V0Rmlyc3RBbmRMYXN0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAvLyBVc3VhbGx5IGFuIGFjdGlvbiBpcyBvcGVuaW5nIHNvbWV0aGluZyBzbyB3ZSBuZWVkIHRvIGdpdmUgaXQgdGltZSB0byByZW5kZXIuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5jb21wbGV0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuY29tcGxldGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZXNldFRvdXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBiYWNrU3RlcCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmNsb3NlQWN0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4IC0gMV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4LS07XG4gICAgICAgICAgICB0aGlzLl9zZXRGaXJzdEFuZExhc3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbigpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja1N0ZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFja1N0ZXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0VG91cigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNraXBUb3VyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc2tpcENhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5za2lwQ2FsbGJhY2sodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXRUb3VyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlc2V0VG91cigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kb20uYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0b3VyLW9wZW4nKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dChudWxsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRUb3VyKHRvdXI6IEd1aWRlZFRvdXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXIgPSBjbG9uZURlZXAodG91cik7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzID0gdGhpcy5fY3VycmVudFRvdXIuc3RlcHMuZmlsdGVyKHN0ZXAgPT4gIXN0ZXAuc2tpcFN0ZXApO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3NldEZpcnN0QW5kTGFzdCgpO1xuICAgICAgICB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QubmV4dCh0aGlzLl9jdXJyZW50VG91ci51c2VPcmIpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAmJiAoIXRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplXG4gICAgICAgICAgICAgICAgfHwgKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lcldpZHRoID49IHRoaXMuX2N1cnJlbnRUb3VyLm1pbmltdW1TY3JlZW5TaXplKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRUb3VyLnVzZU9yYikge1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tLmJvZHkuY2xhc3NMaXN0LmFkZCgndG91ci1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFjdGl2YXRlT3JiKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIHRoaXMuZG9tLmJvZHkuY2xhc3NMaXN0LmFkZCgndG91ci1vcGVuJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0Rmlyc3RBbmRMYXN0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9vbkxhc3RTdGVwID0gKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzLmxlbmd0aCAtIDEpID09PSB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleDtcbiAgICAgICAgdGhpcy5fb25GaXJzdFN0ZXAgPSB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCA9PT0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jaGVja1NlbGVjdG9yVmFsaWRpdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLnNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmICghc2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGVycm9yIGhhbmRsZXIgaXMgY29uZmlndXJlZCB0aGlzIHNob3VsZCBub3QgYmxvY2sgdGhlIGJyb3dzZXIuXG4gICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcihgRXJyb3IgZmluZGluZyBzZWxlY3RvciAke3RoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5zZWxlY3Rvcn0gb24gc3RlcCAke3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ICsgMX0gZHVyaW5nIGd1aWRlZCB0b3VyOiAke3RoaXMuX2N1cnJlbnRUb3VyLnRvdXJJZH1gKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb25MYXN0U3RlcCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uTGFzdFN0ZXA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvbkZpcnN0U3RlcCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRmlyc3RTdGVwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb25SZXNpemVNZXNzYWdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb25SZXNpemVNZXNzYWdlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY3VycmVudFRvdXJTdGVwRGlzcGxheSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggKyAxO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY3VycmVudFRvdXJTdGVwQ291bnQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUb3VyICYmIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzID8gdGhpcy5fY3VycmVudFRvdXIuc3RlcHMubGVuZ3RoIDogMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50VG91ciAmJiB0aGlzLl9jdXJyZW50VG91ci5wcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UHJlcGFyZWRUb3VyU3RlcChpbmRleDogbnVtYmVyKTogVG91clN0ZXAge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRUb3VyT3JpZW50YXRpb24odGhpcy5fY3VycmVudFRvdXIuc3RlcHNbaW5kZXhdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFRvdXJPcmllbnRhdGlvbihzdGVwOiBUb3VyU3RlcCk6IFRvdXJTdGVwIHtcbiAgICAgICAgY29uc3QgY29udmVydGVkU3RlcCA9IGNsb25lRGVlcChzdGVwKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29udmVydGVkU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgJiYgISh0eXBlb2YgY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAmJiAoY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiBhcyBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXSkubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgKGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gYXMgT3JpZW50YXRpb25Db25maWd1cmF0aW9uW10pLnNvcnQoKGE6IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbiwgYjogT3JpZW50YXRpb25Db25maWd1cmF0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFiLm1heGltdW1TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWEubWF4aW11bVNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYi5tYXhpbXVtU2l6ZSAtIGEubWF4aW11bVNpemU7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRPcmllbnRhdGlvbjogT3JpZW50YXRpb24gPSBPcmllbnRhdGlvbi5Ub3A7XG4gICAgICAgICAgICAoY29udmVydGVkU3RlcC5vcmllbnRhdGlvbiBhcyBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb25bXSkuZm9yRWFjaChcbiAgICAgICAgICAgICAgICAob3JpZW50YXRpb25Db25maWc6IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW9yaWVudGF0aW9uQ29uZmlnLm1heGltdW1TaXplIHx8IHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lcldpZHRoIDw9IG9yaWVudGF0aW9uQ29uZmlnLm1heGltdW1TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50T3JpZW50YXRpb24gPSBvcmllbnRhdGlvbkNvbmZpZy5vcmllbnRhdGlvbkRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gPSBjdXJyZW50T3JpZW50YXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZFN0ZXA7XG4gICAgfVxufVxuIl19