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
export class GuidedTourService {
    /**
     * @param {?} errorHandler
     * @param {?} windowRef
     * @param {?} dom
     */
    constructor(errorHandler, windowRef, dom) {
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
        () => {
            if (this._currentTour && this._currentTourStepIndex > -1) {
                if (this._currentTour.minimumScreenSize && this._currentTour.minimumScreenSize >= this.windowRef.nativeWindow.innerWidth) {
                    this._onResizeMessage = true;
                    /** @type {?} */
                    const dialog = this._currentTour.resizeDialog || {
                        title: 'Please resize',
                        content: 'You have resized the tour to a size that is too small to continue. Please resize the browser to a larger size to continue the tour or close the tour.'
                    };
                    this._guidedTourCurrentStepSubject.next(dialog);
                }
                else {
                    this._onResizeMessage = false;
                    this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    nextStep() {
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
                () => {
                    if (this._checkSelectorValidity()) {
                        this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                    }
                    else {
                        this.nextStep();
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
    }
    /**
     * @return {?}
     */
    backStep() {
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
                () => {
                    if (this._checkSelectorValidity()) {
                        this._guidedTourCurrentStepSubject.next(this.getPreparedTourStep(this._currentTourStepIndex));
                    }
                    else {
                        this.backStep();
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
    }
    /**
     * @return {?}
     */
    skipTour() {
        if (this._currentTour.skipCallback) {
            this._currentTour.skipCallback(this._currentTourStepIndex);
        }
        this.resetTour();
    }
    /**
     * @return {?}
     */
    resetTour() {
        this.dom.body.classList.remove('tour-open');
        this._currentTour = null;
        this._currentTourStepIndex = 0;
        this._guidedTourCurrentStepSubject.next(null);
    }
    /**
     * @param {?} tour
     * @return {?}
     */
    startTour(tour) {
        this._currentTour = cloneDeep(tour);
        this._currentTour.steps = this._currentTour.steps.filter((/**
         * @param {?} step
         * @return {?}
         */
        step => !step.skipStep));
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
    }
    /**
     * @return {?}
     */
    activateOrb() {
        this._guidedTourOrbShowingSubject.next(false);
        this.dom.body.classList.add('tour-open');
    }
    /**
     * @private
     * @return {?}
     */
    _setFirstAndLast() {
        this._onLastStep = (this._currentTour.steps.length - 1) === this._currentTourStepIndex;
        this._onFirstStep = this._currentTourStepIndex === 0;
    }
    /**
     * @private
     * @return {?}
     */
    _checkSelectorValidity() {
        if (this._currentTour.steps[this._currentTourStepIndex].selector) {
            /** @type {?} */
            const selectedElement = this.dom.querySelector(this._currentTour.steps[this._currentTourStepIndex].selector);
            if (!selectedElement) {
                this.errorHandler.handleError(
                // If error handler is configured this should not block the browser.
                new Error(`Error finding selector ${this._currentTour.steps[this._currentTourStepIndex].selector} on step ${this._currentTourStepIndex + 1} during guided tour: ${this._currentTour.tourId}`));
                return false;
            }
        }
        return true;
    }
    /**
     * @return {?}
     */
    get onLastStep() {
        return this._onLastStep;
    }
    /**
     * @return {?}
     */
    get onFirstStep() {
        return this._onFirstStep;
    }
    /**
     * @return {?}
     */
    get onResizeMessage() {
        return this._onResizeMessage;
    }
    /**
     * @return {?}
     */
    get currentTourStepDisplay() {
        return this._currentTourStepIndex + 1;
    }
    /**
     * @return {?}
     */
    get currentTourStepCount() {
        return this._currentTour && this._currentTour.steps ? this._currentTour.steps.length : 0;
    }
    /**
     * @return {?}
     */
    get preventBackdropFromAdvancing() {
        return this._currentTour && this._currentTour.preventBackdropFromAdvancing;
    }
    /**
     * @private
     * @param {?} index
     * @return {?}
     */
    getPreparedTourStep(index) {
        return this.setTourOrientation(this._currentTour.steps[index]);
    }
    /**
     * @private
     * @param {?} step
     * @return {?}
     */
    setTourOrientation(step) {
        /** @type {?} */
        const convertedStep = cloneDeep(step);
        if (convertedStep.orientation
            && !(typeof convertedStep.orientation === 'string')
            && ((/** @type {?} */ (convertedStep.orientation))).length) {
            ((/** @type {?} */ (convertedStep.orientation))).sort((/**
             * @param {?} a
             * @param {?} b
             * @return {?}
             */
            (a, b) => {
                if (!b.maximumSize) {
                    return 1;
                }
                if (!a.maximumSize) {
                    return -1;
                }
                return b.maximumSize - a.maximumSize;
            }));
            /** @type {?} */
            let currentOrientation = Orientation.Top;
            ((/** @type {?} */ (convertedStep.orientation))).forEach((/**
             * @param {?} orientationConfig
             * @return {?}
             */
            (orientationConfig) => {
                if (!orientationConfig.maximumSize || this.windowRef.nativeWindow.innerWidth <= orientationConfig.maximumSize) {
                    currentOrientation = orientationConfig.orientationDirection;
                }
            }));
            convertedStep.orientation = currentOrientation;
        }
        return convertedStep;
    }
}
GuidedTourService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
GuidedTourService.ctorParameters = () => [
    { type: ErrorHandler },
    { type: WindowRefService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1ndWlkZWQtdG91ci8iLCJzb3VyY2VzIjpbImxpYi9ndWlkZWQtdG91ci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBYyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RELE9BQU8sRUFBd0IsV0FBVyxFQUE0QixNQUFNLHlCQUF5QixDQUFDO0FBQ3RHLE9BQU8sU0FBUyxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUd2RCxNQUFNLE9BQU8saUJBQWlCOzs7Ozs7SUFZMUIsWUFDVyxZQUEwQixFQUN6QixTQUEyQixFQUNULEdBQUc7UUFGdEIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDekIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDVCxRQUFHLEdBQUgsR0FBRyxDQUFBO1FBWHpCLGtDQUE2QixHQUFHLElBQUksT0FBTyxFQUFZLENBQUM7UUFDeEQsaUNBQTRCLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUN0RCwwQkFBcUIsR0FBRyxDQUFDLENBQUM7UUFDMUIsaUJBQVksR0FBZSxJQUFJLENBQUM7UUFDaEMsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBTzdCLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckYs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SSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxVQUFVLElBQUksaUJBQWlCLENBQUMsV0FBVyxFQUFFO29CQUMzRyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDL0Q7WUFDTCxDQUFDLEVBQ0osQ0FBQztZQUVGLGFBQWEsQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUM7U0FDbEQ7UUFDRCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDOzs7WUEzTkosVUFBVTs7OztZQVBGLFlBQVk7WUFLWixnQkFBZ0I7NENBa0JoQixNQUFNLFNBQUMsUUFBUTs7OztJQWRwQix3REFBeUQ7O0lBQ3pELHVEQUF1RDs7Ozs7SUFFdkQsMERBQWdFOzs7OztJQUNoRSx5REFBOEQ7Ozs7O0lBQzlELGtEQUFrQzs7Ozs7SUFDbEMseUNBQXdDOzs7OztJQUN4Qyx5Q0FBNEI7Ozs7O0lBQzVCLHdDQUEyQjs7Ozs7SUFDM0IsNkNBQWlDOztJQUc3Qix5Q0FBaUM7Ozs7O0lBQ2pDLHNDQUFtQzs7Ozs7SUFDbkMsZ0NBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgR3VpZGVkVG91ciwgVG91clN0ZXAsIE9yaWVudGF0aW9uLCBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbnN0YW50cyc7XG5pbXBvcnQgY2xvbmVEZWVwIGZyb20gJ2xvZGFzaC9jbG9uZURlZXAnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBXaW5kb3dSZWZTZXJ2aWNlIH0gZnJvbSBcIi4vd2luZG93cmVmLnNlcnZpY2VcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEd1aWRlZFRvdXJTZXJ2aWNlIHtcbiAgICBwdWJsaWMgZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3RyZWFtOiBPYnNlcnZhYmxlPFRvdXJTdGVwPjtcbiAgICBwdWJsaWMgZ3VpZGVkVG91ck9yYlNob3dpbmdTdHJlYW06IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgICBwcml2YXRlIF9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0ID0gbmV3IFN1YmplY3Q8VG91clN0ZXA+KCk7XG4gICAgcHJpdmF0ZSBfZ3VpZGVkVG91ck9yYlNob3dpbmdTdWJqZWN0ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcbiAgICBwcml2YXRlIF9jdXJyZW50VG91clN0ZXBJbmRleCA9IDA7XG4gICAgcHJpdmF0ZSBfY3VycmVudFRvdXI6IEd1aWRlZFRvdXIgPSBudWxsO1xuICAgIHByaXZhdGUgX29uRmlyc3RTdGVwID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9vbkxhc3RTdGVwID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9vblJlc2l6ZU1lc3NhZ2UgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgICAgIHByaXZhdGUgd2luZG93UmVmOiBXaW5kb3dSZWZTZXJ2aWNlLFxuICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvbVxuICAgICkge1xuICAgICAgICB0aGlzLmd1aWRlZFRvdXJDdXJyZW50U3RlcFN0cmVhbSA9IHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91ck9yYlNob3dpbmdTdHJlYW0gPSB0aGlzLl9ndWlkZWRUb3VyT3JiU2hvd2luZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdywgJ3Jlc2l6ZScpLnBpcGUoZGVib3VuY2VUaW1lKDIwMCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIgJiYgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZSAmJiB0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZSA+PSB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblJlc2l6ZU1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWFsb2cgPSB0aGlzLl9jdXJyZW50VG91ci5yZXNpemVEaWFsb2cgfHwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdQbGVhc2UgcmVzaXplJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdZb3UgaGF2ZSByZXNpemVkIHRoZSB0b3VyIHRvIGEgc2l6ZSB0aGF0IGlzIHRvbyBzbWFsbCB0byBjb250aW51ZS4gUGxlYXNlIHJlc2l6ZSB0aGUgYnJvd3NlciB0byBhIGxhcmdlciBzaXplIHRvIGNvbnRpbnVlIHRoZSB0b3VyIG9yIGNsb3NlIHRoZSB0b3VyLidcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQoZGlhbG9nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblJlc2l6ZU1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5leHRTdGVwKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmNsb3NlQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uY2xvc2VBY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggKyAxXSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgrKztcbiAgICAgICAgICAgIHRoaXMuX3NldEZpcnN0QW5kTGFzdCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgLy8gVXN1YWxseSBhbiBhY3Rpb24gaXMgb3BlbmluZyBzb21ldGhpbmcgc28gd2UgbmVlZCB0byBnaXZlIGl0IHRpbWUgdG8gcmVuZGVyLlxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0ZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3ViamVjdC5uZXh0KHRoaXMuZ2V0UHJlcGFyZWRUb3VyU3RlcCh0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0ZXAoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuY29tcGxldGVDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLmNvbXBsZXRlQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVzZXRUb3VyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYmFja1N0ZXAoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uY2xvc2VBY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5jbG9zZUFjdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCAtIDFdKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleC0tO1xuICAgICAgICAgICAgdGhpcy5fc2V0Rmlyc3RBbmRMYXN0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tTdGVwKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NoZWNrU2VsZWN0b3JWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2d1aWRlZFRvdXJDdXJyZW50U3RlcFN1YmplY3QubmV4dCh0aGlzLmdldFByZXBhcmVkVG91clN0ZXAodGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tTdGVwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNldFRvdXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBza2lwVG91cigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnNraXBDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc2tpcENhbGxiYWNrKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc2V0VG91cigpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldFRvdXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZG9tLmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndG91ci1vcGVuJyk7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQobnVsbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXJ0VG91cih0b3VyOiBHdWlkZWRUb3VyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUb3VyID0gY2xvbmVEZWVwKHRvdXIpO1xuICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwcyA9IHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzLmZpbHRlcihzdGVwID0+ICFzdGVwLnNraXBTdGVwKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9zZXRGaXJzdEFuZExhc3QoKTtcbiAgICAgICAgdGhpcy5fZ3VpZGVkVG91ck9yYlNob3dpbmdTdWJqZWN0Lm5leHQodGhpcy5fY3VycmVudFRvdXIudXNlT3JiKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFRvdXIuc3RlcHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgJiYgKCF0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZVxuICAgICAgICAgICAgICAgIHx8ICh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJXaWR0aCA+PSB0aGlzLl9jdXJyZW50VG91ci5taW5pbXVtU2NyZWVuU2l6ZSkpXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50VG91ci51c2VPcmIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRvbS5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RvdXItb3BlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uYWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY2hlY2tTZWxlY3RvclZhbGlkaXR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdWJqZWN0Lm5leHQodGhpcy5nZXRQcmVwYXJlZFRvdXJTdGVwKHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhY3RpdmF0ZU9yYigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fZ3VpZGVkVG91ck9yYlNob3dpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgICAgICB0aGlzLmRvbS5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RvdXItb3BlbicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3NldEZpcnN0QW5kTGFzdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fb25MYXN0U3RlcCA9ICh0aGlzLl9jdXJyZW50VG91ci5zdGVwcy5sZW5ndGggLSAxKSA9PT0gdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXg7XG4gICAgICAgIHRoaXMuX29uRmlyc3RTdGVwID0gdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXggPT09IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2hlY2tTZWxlY3RvclZhbGlkaXR5KCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5fY3VycmVudFRvdXIuc3RlcHNbdGhpcy5fY3VycmVudFRvdXJTdGVwSW5kZXhdLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW3RoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4XS5zZWxlY3Rvcik7XG4gICAgICAgICAgICBpZiAoIXNlbGVjdGVkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKFxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBlcnJvciBoYW5kbGVyIGlzIGNvbmZpZ3VyZWQgdGhpcyBzaG91bGQgbm90IGJsb2NrIHRoZSBicm93c2VyLlxuICAgICAgICAgICAgICAgICAgICBuZXcgRXJyb3IoYEVycm9yIGZpbmRpbmcgc2VsZWN0b3IgJHt0aGlzLl9jdXJyZW50VG91ci5zdGVwc1t0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleF0uc2VsZWN0b3J9IG9uIHN0ZXAgJHt0aGlzLl9jdXJyZW50VG91clN0ZXBJbmRleCArIDF9IGR1cmluZyBndWlkZWQgdG91cjogJHt0aGlzLl9jdXJyZW50VG91ci50b3VySWR9YClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9uTGFzdFN0ZXAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbkxhc3RTdGVwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb25GaXJzdFN0ZXAoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vbkZpcnN0U3RlcDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9uUmVzaXplTWVzc2FnZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uUmVzaXplTWVzc2FnZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRUb3VyU3RlcERpc3BsYXkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUb3VyU3RlcEluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRUb3VyU3RlcENvdW50KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50VG91ciAmJiB0aGlzLl9jdXJyZW50VG91ci5zdGVwcyA/IHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzLmxlbmd0aCA6IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBwcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFRvdXIgJiYgdGhpcy5fY3VycmVudFRvdXIucHJldmVudEJhY2tkcm9wRnJvbUFkdmFuY2luZztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFByZXBhcmVkVG91clN0ZXAoaW5kZXg6IG51bWJlcik6IFRvdXJTdGVwIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0VG91ck9yaWVudGF0aW9uKHRoaXMuX2N1cnJlbnRUb3VyLnN0ZXBzW2luZGV4XSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRUb3VyT3JpZW50YXRpb24oc3RlcDogVG91clN0ZXApOiBUb3VyU3RlcCB7XG4gICAgICAgIGNvbnN0IGNvbnZlcnRlZFN0ZXAgPSBjbG9uZURlZXAoc3RlcCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb25cbiAgICAgICAgICAgICYmICEodHlwZW9mIGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgJiYgKGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gYXMgT3JpZW50YXRpb25Db25maWd1cmF0aW9uW10pLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIChjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uIGFzIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbltdKS5zb3J0KChhOiBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24sIGI6IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghYi5tYXhpbXVtU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFhLm1heGltdW1TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIubWF4aW11bVNpemUgLSBhLm1heGltdW1TaXplO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBjdXJyZW50T3JpZW50YXRpb246IE9yaWVudGF0aW9uID0gT3JpZW50YXRpb24uVG9wO1xuICAgICAgICAgICAgKGNvbnZlcnRlZFN0ZXAub3JpZW50YXRpb24gYXMgT3JpZW50YXRpb25Db25maWd1cmF0aW9uW10pLmZvckVhY2goXG4gICAgICAgICAgICAgICAgKG9yaWVudGF0aW9uQ29uZmlnOiBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvcmllbnRhdGlvbkNvbmZpZy5tYXhpbXVtU2l6ZSB8fCB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJXaWR0aCA8PSBvcmllbnRhdGlvbkNvbmZpZy5tYXhpbXVtU2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE9yaWVudGF0aW9uID0gb3JpZW50YXRpb25Db25maWcub3JpZW50YXRpb25EaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb252ZXJ0ZWRTdGVwLm9yaWVudGF0aW9uID0gY3VycmVudE9yaWVudGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb252ZXJ0ZWRTdGVwO1xuICAgIH1cbn1cbiJdfQ==