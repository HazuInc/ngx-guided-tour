/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ElementRef, Input, ViewChild, ViewEncapsulation, TemplateRef, Inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Orientation, ProgressIndicatorLocation } from './guided-tour.constants';
import { GuidedTourService } from './guided-tour.service';
import { WindowRefService } from "./windowref.service";
var GuidedTourComponent = /** @class */ (function () {
    function GuidedTourComponent(guidedTourService, windowRef, dom) {
        this.guidedTourService = guidedTourService;
        this.windowRef = windowRef;
        this.dom = dom;
        this.topOfPageAdjustment = 0;
        this.tourStepWidth = 300;
        this.minimalTourStepWidth = 200;
        this.skipText = 'Skip';
        this.nextText = 'Next';
        this.doneText = 'Done';
        this.closeText = 'Close';
        this.backText = 'Back';
        this.progressIndicatorLocation = ProgressIndicatorLocation.InsideNextButton;
        this.progressIndicator = undefined;
        this.highlightPadding = 4;
        this.currentTourStep = null;
        this.selectedElementRect = null;
        this.isOrbShowing = false;
        this.progressIndicatorLocations = ProgressIndicatorLocation;
    }
    Object.defineProperty(GuidedTourComponent.prototype, "maxWidthAdjustmentForTourStep", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            return this.tourStepWidth - this.minimalTourStepWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "widthAdjustmentForScreenBound", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            if (!this.tourStep) {
                return 0;
            }
            /** @type {?} */
            var adjustment = 0;
            if (this.calculatedLeftPosition < 0) {
                adjustment = -this.calculatedLeftPosition;
            }
            if (this.calculatedLeftPosition > this.windowRef.nativeWindow.innerWidth - this.tourStepWidth) {
                adjustment = this.calculatedLeftPosition - (this.windowRef.nativeWindow.innerWidth - this.tourStepWidth);
            }
            return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "calculatedTourStepWidth", {
        get: /**
         * @return {?}
         */
        function () {
            return this.tourStepWidth - this.widthAdjustmentForScreenBound;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.guidedTourService.guidedTourCurrentStepStream.subscribe((/**
         * @param {?} step
         * @return {?}
         */
        function (step) {
            _this.currentTourStep = step;
            if (step && step.selector) {
                /** @type {?} */
                var selectedElement = _this.dom.querySelector(step.selector);
                if (selectedElement) {
                    _this.scrollToAndSetElement();
                }
                else {
                    _this.selectedElementRect = null;
                }
            }
            else {
                _this.selectedElementRect = null;
            }
        }));
        this.guidedTourService.guidedTourOrbShowingStream.subscribe((/**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            _this.isOrbShowing = value;
        }));
        this.resizeSubscription = fromEvent(this.windowRef.nativeWindow, 'resize').subscribe((/**
         * @return {?}
         */
        function () {
            _this.updateStepLocation();
        }));
        this.scrollSubscription = fromEvent(this.windowRef.nativeWindow, 'scroll').subscribe((/**
         * @return {?}
         */
        function () {
            _this.updateStepLocation();
        }));
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.resizeSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.scrollToAndSetElement = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.updateStepLocation();
        // Allow things to render to scroll to the correct location
        setTimeout((/**
         * @return {?}
         */
        function () {
            if (!_this.isOrbShowing && !_this.isTourOnScreen()) {
                if (_this.selectedElementRect && _this.isBottom()) {
                    // Scroll so the element is on the top of the screen.
                    /** @type {?} */
                    var topPos = ((_this.windowRef.nativeWindow.scrollY + _this.selectedElementRect.top) - _this.topOfPageAdjustment)
                        - (_this.currentTourStep.scrollAdjustment ? _this.currentTourStep.scrollAdjustment : 0)
                        + _this.getStepScreenAdjustment();
                    try {
                        _this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            _this.windowRef.nativeWindow.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
                else {
                    // Scroll so the element is on the bottom of the screen.
                    /** @type {?} */
                    var topPos = (_this.windowRef.nativeWindow.scrollY + _this.selectedElementRect.top + _this.selectedElementRect.height)
                        - _this.windowRef.nativeWindow.innerHeight
                        + (_this.currentTourStep.scrollAdjustment ? _this.currentTourStep.scrollAdjustment : 0)
                        - _this.getStepScreenAdjustment();
                    try {
                        _this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            _this.windowRef.nativeWindow.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
            }
        }));
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.handleOrb = /**
     * @return {?}
     */
    function () {
        this.guidedTourService.activateOrb();
        if (this.currentTourStep && this.currentTourStep.selector) {
            this.scrollToAndSetElement();
        }
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.isTourOnScreen = /**
     * @private
     * @return {?}
     */
    function () {
        return this.tourStep
            && this.elementInViewport(this.dom.querySelector(this.currentTourStep.selector))
            && this.elementInViewport(this.tourStep.nativeElement);
    };
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    GuidedTourComponent.prototype.elementInViewport = 
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var top = element.offsetTop;
        /** @type {?} */
        var height = element.offsetHeight;
        while (element.offsetParent) {
            element = ((/** @type {?} */ (element.offsetParent)));
            top += element.offsetTop;
        }
        if (this.isBottom()) {
            return (top >= (this.windowRef.nativeWindow.pageYOffset
                + this.topOfPageAdjustment
                + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                + this.getStepScreenAdjustment())
                && (top + height) <= (this.windowRef.nativeWindow.pageYOffset + this.windowRef.nativeWindow.innerHeight));
        }
        else {
            return (top >= (this.windowRef.nativeWindow.pageYOffset + this.topOfPageAdjustment - this.getStepScreenAdjustment())
                && (top + height + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)) <= (this.windowRef.nativeWindow.pageYOffset + this.windowRef.nativeWindow.innerHeight));
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    GuidedTourComponent.prototype.backdropClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.guidedTourService.preventBackdropFromAdvancing) {
            event.stopPropagation();
        }
        else {
            this.guidedTourService.nextStep();
        }
    };
    /**
     * @return {?}
     */
    GuidedTourComponent.prototype.updateStepLocation = /**
     * @return {?}
     */
    function () {
        if (this.currentTourStep && this.currentTourStep.selector) {
            /** @type {?} */
            var selectedElement = this.dom.querySelector(this.currentTourStep.selector);
            if (selectedElement && typeof selectedElement.getBoundingClientRect === 'function') {
                this.selectedElementRect = ((/** @type {?} */ (selectedElement.getBoundingClientRect())));
            }
            else {
                this.selectedElementRect = null;
            }
        }
        else {
            this.selectedElementRect = null;
        }
    };
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.isBottom = /**
     * @private
     * @return {?}
     */
    function () {
        return this.currentTourStep.orientation
            && (this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.BottomLeft
                || this.currentTourStep.orientation === Orientation.BottomRight);
    };
    Object.defineProperty(GuidedTourComponent.prototype, "topPosition", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var paddingAdjustment = this.getHighlightPadding();
            if (this.isBottom()) {
                return this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
            }
            return this.selectedElementRect.top - this.getHighlightPadding();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbTopPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.isBottom()) {
                return this.selectedElementRect.top + this.selectedElementRect.height;
            }
            if (this.currentTourStep.orientation === Orientation.Right
                || this.currentTourStep.orientation === Orientation.Left) {
                return (this.selectedElementRect.top + (this.selectedElementRect.height / 2));
            }
            return this.selectedElementRect.top;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "calculatedLeftPosition", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var paddingAdjustment = this.getHighlightPadding();
            if (this.currentTourStep.orientation === Orientation.TopRight
                || this.currentTourStep.orientation === Orientation.BottomRight) {
                return (this.selectedElementRect.right - this.tourStepWidth);
            }
            if (this.currentTourStep.orientation === Orientation.TopLeft
                || this.currentTourStep.orientation === Orientation.BottomLeft) {
                return (this.selectedElementRect.left);
            }
            if (this.currentTourStep.orientation === Orientation.Left) {
                return this.selectedElementRect.left - this.tourStepWidth - paddingAdjustment;
            }
            if (this.currentTourStep.orientation === Orientation.Right) {
                return (this.selectedElementRect.left + this.selectedElementRect.width + paddingAdjustment);
            }
            return (this.selectedElementRect.right - (this.selectedElementRect.width / 2) - (this.tourStepWidth / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "leftPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.calculatedLeftPosition >= 0) {
                return this.calculatedLeftPosition;
            }
            /** @type {?} */
            var adjustment = Math.max(0, -this.calculatedLeftPosition);
            /** @type {?} */
            var maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
            return this.calculatedLeftPosition + maxAdjustment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbLeftPosition", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.currentTourStep.orientation === Orientation.TopRight
                || this.currentTourStep.orientation === Orientation.BottomRight) {
                return this.selectedElementRect.right;
            }
            if (this.currentTourStep.orientation === Orientation.TopLeft
                || this.currentTourStep.orientation === Orientation.BottomLeft) {
                return this.selectedElementRect.left;
            }
            if (this.currentTourStep.orientation === Orientation.Left) {
                return this.selectedElementRect.left;
            }
            if (this.currentTourStep.orientation === Orientation.Right) {
                return (this.selectedElementRect.left + this.selectedElementRect.width);
            }
            return (this.selectedElementRect.right - (this.selectedElementRect.width / 2));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "transform", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.currentTourStep.orientation
                || this.currentTourStep.orientation === Orientation.Top
                || this.currentTourStep.orientation === Orientation.TopRight
                || this.currentTourStep.orientation === Orientation.TopLeft) {
                return 'translateY(-100%)';
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "orbTransform", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.currentTourStep.orientation
                || this.currentTourStep.orientation === Orientation.Top
                || this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.TopLeft
                || this.currentTourStep.orientation === Orientation.BottomLeft) {
                return 'translateY(-50%)';
            }
            if (this.currentTourStep.orientation === Orientation.TopRight
                || this.currentTourStep.orientation === Orientation.BottomRight) {
                return 'translate(-100%, -50%)';
            }
            if (this.currentTourStep.orientation === Orientation.Right
                || this.currentTourStep.orientation === Orientation.Left) {
                return 'translate(-50%, -50%)';
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayTop", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.top - this.getHighlightPadding();
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayLeft", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.left - this.getHighlightPadding();
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayHeight", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.height + (this.getHighlightPadding() * 2);
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuidedTourComponent.prototype, "overlayWidth", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.selectedElementRect) {
                return this.selectedElementRect.width + (this.getHighlightPadding() * 2);
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.getHighlightPadding = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.highlightPadding : 0;
        if (this.currentTourStep.highlightPadding) {
            paddingAdjustment = this.currentTourStep.highlightPadding;
        }
        return paddingAdjustment;
    };
    // This calculates a value to add or subtract so the step should not be off screen.
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    GuidedTourComponent.prototype.getStepScreenAdjustment = 
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    function () {
        if (this.currentTourStep.orientation === Orientation.Left
            || this.currentTourStep.orientation === Orientation.Right) {
            return 0;
        }
        /** @type {?} */
        var scrollAdjustment = this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0;
        /** @type {?} */
        var tourStepHeight = typeof this.tourStep.nativeElement.getBoundingClientRect === 'function' ? this.tourStep.nativeElement.getBoundingClientRect().height : 0;
        /** @type {?} */
        var elementHeight = this.selectedElementRect.height + scrollAdjustment + tourStepHeight;
        if ((this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment) < elementHeight) {
            return elementHeight - (this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment);
        }
        return 0;
    };
    GuidedTourComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-guided-tour',
                    template: "\n        <div *ngIf=\"currentTourStep && selectedElementRect && isOrbShowing\"\n                (mouseenter)=\"handleOrb()\"\n                class=\"tour-orb tour-{{ currentTourStep.orientation }}\"\n                [style.top.px]=\"orbTopPosition\"\n                [style.left.px]=\"orbLeftPosition\"\n                [style.transform]=\"orbTransform\">\n                <div class=\"tour-orb-ring\"></div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div class=\"guided-tour-user-input-mask\" (click)=\"backdropClick($event)\"></div>\n            <div class=\"guided-tour-spotlight-overlay\"\n                [style.top.px]=\"overlayTop\"\n                [style.left.px]=\"overlayLeft\"\n                [style.height.px]=\"overlayHeight\"\n                [style.width.px]=\"overlayWidth\">\n            </div>\n        </div>\n        <div *ngIf=\"currentTourStep && !isOrbShowing\">\n            <div #tourStep *ngIf=\"currentTourStep\"\n                class=\"tour-step tour-{{ currentTourStep.orientation }}\"\n                [ngClass]=\"{\n                    'page-tour-step': !currentTourStep.selector\n                }\"\n                [style.top.px]=\"(currentTourStep.selector && selectedElementRect ? topPosition : null)\"\n                [style.left.px]=\"(currentTourStep.selector && selectedElementRect ? leftPosition : null)\"\n                [style.width.px]=\"(currentTourStep.selector && selectedElementRect ? calculatedTourStepWidth : null)\"\n                [style.transform]=\"(currentTourStep.selector && selectedElementRect ? transform : null)\">\n                <div *ngIf=\"currentTourStep.selector\" class=\"tour-arrow\"></div>\n                <div class=\"tour-block\">\n                    <div *ngIf=\"\n                        progressIndicatorLocation === progressIndicatorLocations.TopOfTourBlock\n                        && !guidedTourService.onResizeMessage\"\n                    class=\"tour-progress-indicator\">\n                        <ng-container *ngTemplateOutlet=\"progress\"></ng-container>\n                    </div>\n                    <h3 class=\"tour-title\" *ngIf=\"currentTourStep.title && currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h3>\n                    <h2 class=\"tour-title\" *ngIf=\"currentTourStep.title && !currentTourStep.selector\">\n                        {{ currentTourStep.title }}\n                    </h2>\n                    <div class=\"tour-content\" [innerHTML]=\"currentTourStep.content\"></div>\n                    <div class=\"tour-buttons\">\n                        <button *ngIf=\"!guidedTourService.onResizeMessage\"\n                            (click)=\"guidedTourService.skipTour()\"\n                            class=\"skip-button link-button\">\n                            {{ skipText }}\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onLastStep && !guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            {{ nextText }}\n                            <ng-container *ngIf=\"progressIndicatorLocation === progressIndicatorLocations.InsideNextButton\">\n                                <ng-container *ngTemplateOutlet=\"progress\"></ng-container>\n                            </ng-container>\n                        </button>\n                        <button *ngIf=\"guidedTourService.onLastStep\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.nextStep()\">\n                            {{ doneText }}\n                        </button>\n\n                        <button *ngIf=\"guidedTourService.onResizeMessage\"\n                            class=\"next-button\"\n                            (click)=\"guidedTourService.resetTour()\">\n                            {{ closeText }}\n                        </button>\n                        <button *ngIf=\"!guidedTourService.onFirstStep && !guidedTourService.onResizeMessage\"\n                            class=\"back-button link-button\"\n                            (click)=\"guidedTourService.backStep()\">\n                            {{ backText }}\n                        </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <ng-template #progress>\n            <ng-container *ngTemplateOutlet=\"\n                progressIndicator || defaultProgressIndicator; \n                context: { currentStepNumber: guidedTourService.currentTourStepDisplay, totalSteps: guidedTourService.currentTourStepCount }\n            \"></ng-container> \n        </ng-template>\n        <ng-template #defaultProgressIndicator let-currentStepNumber=\"currentStepNumber\" let-totalSteps=\"totalSteps\">\n            <ng-container *ngIf=\"progressIndicatorLocation === progressIndicatorLocations.InsideNextButton\">&nbsp;</ng-container>{{ currentStepNumber }}/{{ totalSteps }}\n        </ng-template>\n    ",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["ngx-guided-tour .guided-tour-user-input-mask{position:fixed;top:0;left:0;display:block;height:100%;width:100%;max-height:100vh;text-align:center;opacity:0}ngx-guided-tour .guided-tour-spotlight-overlay{position:fixed;box-shadow:0 0 0 9999px rgba(0,0,0,.7),0 0 1.5rem rgba(0,0,0,.5)}ngx-guided-tour .tour-orb{position:fixed;width:20px;height:20px;border-radius:50%}ngx-guided-tour .tour-orb .tour-orb-ring{width:35px;height:35px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-animation:2s linear infinite pulse;animation:2s linear infinite pulse}ngx-guided-tour .tour-orb .tour-orb-ring:after{content:'';display:inline-block;height:100%;width:100%;border-radius:50%}@-webkit-keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}@keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}ngx-guided-tour .tour-step{position:fixed}ngx-guided-tour .tour-step.page-tour-step{max-width:400px;width:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before{position:absolute}ngx-guided-tour .tour-step.tour-bottom .tour-block,ngx-guided-tour .tour-step.tour-bottom-left .tour-block,ngx-guided-tour .tour-step.tour-bottom-right .tour-block{margin-top:10px}ngx-guided-tour .tour-step.tour-top,ngx-guided-tour .tour-step.tour-top-left,ngx-guided-tour .tour-step.tour-top-right{margin-bottom:10px}ngx-guided-tour .tour-step.tour-top .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{position:absolute;bottom:0}ngx-guided-tour .tour-step.tour-top .tour-block,ngx-guided-tour .tour-step.tour-top-left .tour-block,ngx-guided-tour .tour-step.tour-top-right .tour-block{margin-bottom:10px}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-top .tour-arrow::before{-webkit-transform:translateX(-50%);transform:translateX(-50%);left:50%}ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{-webkit-transform:translateX(-100%);transform:translateX(-100%);left:calc(100% - 5px)}ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before{left:5px}ngx-guided-tour .tour-step.tour-left .tour-arrow::before{position:absolute;left:100%;-webkit-transform:translateX(-100%);transform:translateX(-100%);top:5px}ngx-guided-tour .tour-step.tour-left .tour-block{margin-right:10px}ngx-guided-tour .tour-step.tour-right .tour-arrow::before{position:absolute;left:0;top:5px}ngx-guided-tour .tour-step.tour-right .tour-block{margin-left:10px}ngx-guided-tour .tour-step .tour-block{padding:15px 25px}ngx-guided-tour .tour-step .tour-progress-indicator{padding-bottom:15px}ngx-guided-tour .tour-step .tour-title{font-weight:700!important;padding-bottom:20px}ngx-guided-tour .tour-step h3.tour-title{font-size:20px}ngx-guided-tour .tour-step h2.tour-title{font-size:30px}ngx-guided-tour .tour-step .tour-content{min-height:80px;padding-bottom:30px;font-size:15px}ngx-guided-tour .tour-step .tour-buttons{overflow:hidden}ngx-guided-tour .tour-step .tour-buttons button.link-button{font-size:15px;font-weight:700;max-width:none!important;cursor:pointer;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;line-height:1.5;background-color:transparent;position:relative;outline:0;padding:0 15px;-webkit-appearance:button}ngx-guided-tour .tour-step .tour-buttons button.skip-button.link-button{padding-left:0;border-left:0}ngx-guided-tour .tour-step .tour-buttons .back-button{float:right}ngx-guided-tour .tour-step .tour-buttons .next-button{cursor:pointer;border-radius:1px;float:right;font-size:14px;border:none;outline:0;padding-left:10px;padding-right:10px}"]
                }] }
    ];
    /** @nocollapse */
    GuidedTourComponent.ctorParameters = function () { return [
        { type: GuidedTourService },
        { type: WindowRefService },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    GuidedTourComponent.propDecorators = {
        topOfPageAdjustment: [{ type: Input }],
        tourStepWidth: [{ type: Input }],
        minimalTourStepWidth: [{ type: Input }],
        skipText: [{ type: Input }],
        nextText: [{ type: Input }],
        doneText: [{ type: Input }],
        closeText: [{ type: Input }],
        backText: [{ type: Input }],
        progressIndicatorLocation: [{ type: Input }],
        progressIndicator: [{ type: Input }],
        tourStep: [{ type: ViewChild, args: ['tourStep', { static: false },] }]
    };
    return GuidedTourComponent;
}());
export { GuidedTourComponent };
if (false) {
    /** @type {?} */
    GuidedTourComponent.prototype.topOfPageAdjustment;
    /** @type {?} */
    GuidedTourComponent.prototype.tourStepWidth;
    /** @type {?} */
    GuidedTourComponent.prototype.minimalTourStepWidth;
    /** @type {?} */
    GuidedTourComponent.prototype.skipText;
    /** @type {?} */
    GuidedTourComponent.prototype.nextText;
    /** @type {?} */
    GuidedTourComponent.prototype.doneText;
    /** @type {?} */
    GuidedTourComponent.prototype.closeText;
    /** @type {?} */
    GuidedTourComponent.prototype.backText;
    /** @type {?} */
    GuidedTourComponent.prototype.progressIndicatorLocation;
    /** @type {?} */
    GuidedTourComponent.prototype.progressIndicator;
    /** @type {?} */
    GuidedTourComponent.prototype.tourStep;
    /** @type {?} */
    GuidedTourComponent.prototype.highlightPadding;
    /** @type {?} */
    GuidedTourComponent.prototype.currentTourStep;
    /** @type {?} */
    GuidedTourComponent.prototype.selectedElementRect;
    /** @type {?} */
    GuidedTourComponent.prototype.isOrbShowing;
    /** @type {?} */
    GuidedTourComponent.prototype.progressIndicatorLocations;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.resizeSubscription;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.scrollSubscription;
    /** @type {?} */
    GuidedTourComponent.prototype.guidedTourService;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.windowRef;
    /**
     * @type {?}
     * @private
     */
    GuidedTourComponent.prototype.dom;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBYSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxSSxPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBWSx5QkFBeUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzNGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXZEO0lBaUhJLDZCQUNXLGlCQUFvQyxFQUNuQyxTQUEyQixFQUNULEdBQVE7UUFGM0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUNuQyxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNULFFBQUcsR0FBSCxHQUFHLENBQUs7UUF2QnRCLHdCQUFtQixHQUFJLENBQUMsQ0FBQztRQUN6QixrQkFBYSxHQUFJLEdBQUcsQ0FBQztRQUNyQix5QkFBb0IsR0FBSSxHQUFHLENBQUM7UUFDNUIsYUFBUSxHQUFJLE1BQU0sQ0FBQztRQUNuQixhQUFRLEdBQUksTUFBTSxDQUFDO1FBQ25CLGFBQVEsR0FBSSxNQUFNLENBQUM7UUFDbkIsY0FBUyxHQUFJLE9BQU8sQ0FBQztRQUNyQixhQUFRLEdBQUksTUFBTSxDQUFDO1FBQ25CLDhCQUF5QixHQUErQix5QkFBeUIsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNuRyxzQkFBaUIsR0FBc0IsU0FBUyxD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QyxDQUFDO1NBQy9GO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDOztnQkFyZEosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxtaUtBc0ZUO29CQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDeEM7Ozs7Z0JBOUZRLGlCQUFpQjtnQkFDakIsZ0JBQWdCO2dEQXNIaEIsTUFBTSxTQUFDLFFBQVE7OztzQ0F2Qm5CLEtBQUs7Z0NBQ0wsS0FBSzt1Q0FDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzs0Q0FDTCxLQUFLO29DQUNMLEtBQUs7MkJBQ0wsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBK1c1QywwQkFBQztDQUFBLEFBdGRELElBc2RDO1NBMVhZLG1CQUFtQjs7O0lBQzVCLGtEQUF5Qzs7SUFDekMsNENBQXFDOztJQUNyQyxtREFBNEM7O0lBQzVDLHVDQUFtQzs7SUFDbkMsdUNBQW1DOztJQUNuQyx1Q0FBbUM7O0lBQ25DLHdDQUFxQzs7SUFDckMsdUNBQW1DOztJQUNuQyx3REFBbUg7O0lBQ25ILGdEQUFpRTs7SUFDakUsdUNBQXNFOztJQUN0RSwrQ0FBNEI7O0lBQzVCLDhDQUF3Qzs7SUFDeEMsa0RBQTJDOztJQUMzQywyQ0FBNEI7O0lBQzVCLHlEQUE4RDs7Ozs7SUFFOUQsaURBQXlDOzs7OztJQUN6QyxpREFBeUM7O0lBR3JDLGdEQUEyQzs7Ozs7SUFDM0Msd0NBQW1DOzs7OztJQUNuQyxrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBPbkRlc3Ryb3ksIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24sIFRlbXBsYXRlUmVmLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGZyb21FdmVudCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiwgVG91clN0ZXAsIFByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24gfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbnN0YW50cyc7XG5pbXBvcnQgeyBHdWlkZWRUb3VyU2VydmljZSB9IGZyb20gJy4vZ3VpZGVkLXRvdXIuc2VydmljZSc7XG5pbXBvcnQgeyBXaW5kb3dSZWZTZXJ2aWNlIH0gZnJvbSBcIi4vd2luZG93cmVmLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZ3VpZGVkLXRvdXInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCAmJiBpc09yYlNob3dpbmdcIlxuICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cImhhbmRsZU9yYigpXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRvdXItb3JiIHRvdXIte3sgY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uIH19XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudG9wLnB4XT1cIm9yYlRvcFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubGVmdC5weF09XCJvcmJMZWZ0UG9zaXRpb25cIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwib3JiVHJhbnNmb3JtXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItb3JiLXJpbmdcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAgJiYgIWlzT3JiU2hvd2luZ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImd1aWRlZC10b3VyLXVzZXItaW5wdXQtbWFza1wiIChjbGljayk9XCJiYWNrZHJvcENsaWNrKCRldmVudClcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZWQtdG91ci1zcG90bGlnaHQtb3ZlcmxheVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRvcC5weF09XCJvdmVybGF5VG9wXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubGVmdC5weF09XCJvdmVybGF5TGVmdFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJvdmVybGF5SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwib3ZlcmxheVdpZHRoXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAgJiYgIWlzT3JiU2hvd2luZ1wiPlxuICAgICAgICAgICAgPGRpdiAjdG91clN0ZXAgKm5nSWY9XCJjdXJyZW50VG91clN0ZXBcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwidG91ci1zdGVwIHRvdXIte3sgY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uIH19XCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAgICAgICAgICdwYWdlLXRvdXItc3RlcCc6ICFjdXJyZW50VG91clN0ZXAuc2VsZWN0b3JcbiAgICAgICAgICAgICAgICB9XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudG9wLnB4XT1cIihjdXJyZW50VG91clN0ZXAuc2VsZWN0b3IgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCA/IHRvcFBvc2l0aW9uIDogbnVsbClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5sZWZ0LnB4XT1cIihjdXJyZW50VG91clN0ZXAuc2VsZWN0b3IgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCA/IGxlZnRQb3NpdGlvbiA6IG51bGwpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwiKGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvciAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ID8gY2FsY3VsYXRlZFRvdXJTdGVwV2lkdGggOiBudWxsKVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRyYW5zZm9ybV09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyB0cmFuc2Zvcm0gOiBudWxsKVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAuc2VsZWN0b3JcIiBjbGFzcz1cInRvdXItYXJyb3dcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG91ci1ibG9ja1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0luZGljYXRvckxvY2F0aW9uID09PSBwcm9ncmVzc0luZGljYXRvckxvY2F0aW9ucy5Ub3BPZlRvdXJCbG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgIWd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidG91ci1wcm9ncmVzcy1pbmRpY2F0b3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwcm9ncmVzc1wiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidG91ci10aXRsZVwiICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwLnRpdGxlICYmIGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3sgY3VycmVudFRvdXJTdGVwLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRvdXItdGl0bGVcIiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcC50aXRsZSAmJiAhY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7eyBjdXJyZW50VG91clN0ZXAudGl0bGUgfX1cbiAgICAgICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItY29udGVudFwiIFtpbm5lckhUTUxdPVwiY3VycmVudFRvdXJTdGVwLmNvbnRlbnRcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5za2lwVG91cigpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInNraXAtYnV0dG9uIGxpbmstYnV0dG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgc2tpcFRleHQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vbkxhc3RTdGVwICYmICFndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV4dC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgbmV4dFRleHQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwicHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbiA9PT0gcHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbnMuSW5zaWRlTmV4dEJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicHJvZ3Jlc3NcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImd1aWRlZFRvdXJTZXJ2aWNlLm9uTGFzdFN0ZXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibmV4dC1idXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgZG9uZVRleHQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwiZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2UucmVzZXRUb3VyKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBjbG9zZVRleHQgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIiFndWlkZWRUb3VyU2VydmljZS5vbkZpcnN0U3RlcCAmJiAhZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImJhY2stYnV0dG9uIGxpbmstYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2UuYmFja1N0ZXAoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IGJhY2tUZXh0IH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcHJvZ3Jlc3M+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbmRpY2F0b3IgfHwgZGVmYXVsdFByb2dyZXNzSW5kaWNhdG9yOyBcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7IGN1cnJlbnRTdGVwTnVtYmVyOiBndWlkZWRUb3VyU2VydmljZS5jdXJyZW50VG91clN0ZXBEaXNwbGF5LCB0b3RhbFN0ZXBzOiBndWlkZWRUb3VyU2VydmljZS5jdXJyZW50VG91clN0ZXBDb3VudCB9XG4gICAgICAgICAgICBcIj48L25nLWNvbnRhaW5lcj4gXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFByb2dyZXNzSW5kaWNhdG9yIGxldC1jdXJyZW50U3RlcE51bWJlcj1cImN1cnJlbnRTdGVwTnVtYmVyXCIgbGV0LXRvdGFsU3RlcHM9XCJ0b3RhbFN0ZXBzXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwicHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbiA9PT0gcHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbnMuSW5zaWRlTmV4dEJ1dHRvblwiPiZuYnNwOzwvbmctY29udGFpbmVyPnt7IGN1cnJlbnRTdGVwTnVtYmVyIH19L3t7IHRvdGFsU3RlcHMgfX1cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICBgLFxuICAgIHN0eWxlVXJsczogWycuL2d1aWRlZC10b3VyLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBHdWlkZWRUb3VyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBwdWJsaWMgdG9wT2ZQYWdlQWRqdXN0bWVudCA/PSAwO1xuICAgIEBJbnB1dCgpIHB1YmxpYyB0b3VyU3RlcFdpZHRoID89IDMwMDtcbiAgICBASW5wdXQoKSBwdWJsaWMgbWluaW1hbFRvdXJTdGVwV2lkdGggPz0gMjAwO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBza2lwVGV4dCA/PSAnU2tpcCc7XG4gICAgQElucHV0KCkgcHVibGljIG5leHRUZXh0ID89ICdOZXh0JztcbiAgICBASW5wdXQoKSBwdWJsaWMgZG9uZVRleHQgPz0gJ0RvbmUnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBjbG9zZVRleHQgPz0gJ0Nsb3NlJztcbiAgICBASW5wdXQoKSBwdWJsaWMgYmFja1RleHQgPz0gJ0JhY2snO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBwcm9ncmVzc0luZGljYXRvckxvY2F0aW9uPzogUHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbiA9IFByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24uSW5zaWRlTmV4dEJ1dHRvbjtcbiAgICBASW5wdXQoKSBwdWJsaWMgcHJvZ3Jlc3NJbmRpY2F0b3I/OiBUZW1wbGF0ZVJlZjxhbnk+ID0gdW5kZWZpbmVkO1xuICAgIEBWaWV3Q2hpbGQoJ3RvdXJTdGVwJywgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyB0b3VyU3RlcDogRWxlbWVudFJlZjtcbiAgICBwdWJsaWMgaGlnaGxpZ2h0UGFkZGluZyA9IDQ7XG4gICAgcHVibGljIGN1cnJlbnRUb3VyU3RlcDogVG91clN0ZXAgPSBudWxsO1xuICAgIHB1YmxpYyBzZWxlY3RlZEVsZW1lbnRSZWN0OiBET01SZWN0ID0gbnVsbDtcbiAgICBwdWJsaWMgaXNPcmJTaG93aW5nID0gZmFsc2U7XG4gICAgcHVibGljIHByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb25zID0gUHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbjtcblxuICAgIHByaXZhdGUgcmVzaXplU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgcHJpdmF0ZSBzY3JvbGxTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZ3VpZGVkVG91clNlcnZpY2U6IEd1aWRlZFRvdXJTZXJ2aWNlLFxuICAgICAgICBwcml2YXRlIHdpbmRvd1JlZjogV2luZG93UmVmU2VydmljZSxcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb206IGFueVxuICAgICkgeyB9XG5cbiAgICBwcml2YXRlIGdldCBtYXhXaWR0aEFkanVzdG1lbnRGb3JUb3VyU3RlcCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50b3VyU3RlcFdpZHRoIC0gdGhpcy5taW5pbWFsVG91clN0ZXBXaWR0aDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCB3aWR0aEFkanVzdG1lbnRGb3JTY3JlZW5Cb3VuZCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMudG91clN0ZXApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhZGp1c3RtZW50ID0gMDtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbiA8IDApIHtcbiAgICAgICAgICAgIGFkanVzdG1lbnQgPSAtdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gPiB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJXaWR0aCAtIHRoaXMudG91clN0ZXBXaWR0aCkge1xuICAgICAgICAgICAgYWRqdXN0bWVudCA9IHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbiAtICh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJXaWR0aCAtIHRoaXMudG91clN0ZXBXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gTWF0aC5taW4odGhpcy5tYXhXaWR0aEFkanVzdG1lbnRGb3JUb3VyU3RlcCwgYWRqdXN0bWVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjYWxjdWxhdGVkVG91clN0ZXBXaWR0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG91clN0ZXBXaWR0aCAtIHRoaXMud2lkdGhBZGp1c3RtZW50Rm9yU2NyZWVuQm91bmQ7XG4gICAgfVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5ndWlkZWRUb3VyQ3VycmVudFN0ZXBTdHJlYW0uc3Vic2NyaWJlKChzdGVwOiBUb3VyU3RlcCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAgPSBzdGVwO1xuICAgICAgICAgICAgaWYgKHN0ZXAgJiYgc3RlcC5zZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3Ioc3RlcC5zZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvQW5kU2V0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLmd1aWRlZFRvdXJPcmJTaG93aW5nU3RyZWFtLnN1YnNjcmliZSgodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNPcmJTaG93aW5nID0gdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdywgJ3Jlc2l6ZScpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0ZXBMb2NhdGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNjcm9sbFN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3csICdzY3JvbGwnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGVwTG9jYXRpb24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnNjcm9sbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzY3JvbGxUb0FuZFNldEVsZW1lbnQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RlcExvY2F0aW9uKCk7XG4gICAgICAgIC8vIEFsbG93IHRoaW5ncyB0byByZW5kZXIgdG8gc2Nyb2xsIHRvIHRoZSBjb3JyZWN0IGxvY2F0aW9uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3JiU2hvd2luZyAmJiAhdGhpcy5pc1RvdXJPblNjcmVlbigpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCAmJiB0aGlzLmlzQm90dG9tKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHNvIHRoZSBlbGVtZW50IGlzIG9uIHRoZSB0b3Agb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wUG9zID0gKCh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuc2Nyb2xsWSArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3ApIC0gdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLSAodGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyB0aGlzLmdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3BQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnNjcm9sbCgwLCB0b3BQb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTY3JvbGwgc28gdGhlIGVsZW1lbnQgaXMgb24gdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3BQb3MgPSAodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnNjcm9sbFkgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICArICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAtIHRoaXMuZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHRvcFBvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuc2Nyb2xsKDAsIHRvcFBvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZU9yYigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5hY3RpdmF0ZU9yYigpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAgJiYgdGhpcy5jdXJyZW50VG91clN0ZXAuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9BbmRTZXRFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzVG91ck9uU2NyZWVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b3VyU3RlcFxuICAgICAgICAgICAgJiYgdGhpcy5lbGVtZW50SW5WaWV3cG9ydCh0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKSlcbiAgICAgICAgICAgICYmIHRoaXMuZWxlbWVudEluVmlld3BvcnQodGhpcy50b3VyU3RlcC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyBNb2RpZmllZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyMzk5OS9ob3ctdG8tdGVsbC1pZi1hLWRvbS1lbGVtZW50LWlzLXZpc2libGUtaW4tdGhlLWN1cnJlbnQtdmlld3BvcnRcbiAgICBwcml2YXRlIGVsZW1lbnRJblZpZXdwb3J0KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGxldCB0b3AgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gKGVsZW1lbnQub2Zmc2V0UGFyZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgICAgIHRvcCArPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRvcCA+PSAodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50XG4gICAgICAgICAgICAgICAgICAgICsgKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMClcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLmdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCkpXG4gICAgICAgICAgICAgICAgJiYgKHRvcCArIGhlaWdodCkgPD0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5wYWdlWU9mZnNldCArIHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lckhlaWdodClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIHRvcCA+PSAodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnBhZ2VZT2Zmc2V0ICsgdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50IC0gdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpKVxuICAgICAgICAgICAgICAgICYmICh0b3AgKyBoZWlnaHQgKyAodGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwKSkgPD0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5wYWdlWU9mZnNldCArIHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lckhlaWdodClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYmFja2Ryb3BDbGljayhldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ3VpZGVkVG91clNlcnZpY2UucHJldmVudEJhY2tkcm9wRnJvbUFkdmFuY2luZykge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLm5leHRTdGVwKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlU3RlcExvY2F0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAgJiYgdGhpcy5jdXJyZW50VG91clN0ZXAuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkRWxlbWVudCA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IodGhpcy5jdXJyZW50VG91clN0ZXAuc2VsZWN0b3IpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbWVudCAmJiB0eXBlb2Ygc2VsZWN0ZWRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCA9IChzZWxlY3RlZEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgYXMgRE9NUmVjdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0JvdHRvbSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uXG4gICAgICAgICAgICAmJiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21SaWdodCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB0b3BQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBwYWRkaW5nQWRqdXN0bWVudCA9IHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQm90dG9tKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodCArIHBhZGRpbmdBZGp1c3RtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgLSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9yYlRvcFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmlzQm90dG9tKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgKyAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodCAvIDIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IGNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcGFkZGluZ0FkanVzdG1lbnQgPSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnJpZ2h0IC0gdGhpcy50b3VyU3RlcFdpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BMZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQgLSB0aGlzLnRvdXJTdGVwV2lkdGggLSBwYWRkaW5nQWRqdXN0bWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGggKyBwYWRkaW5nQWRqdXN0bWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5yaWdodCAtICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGggLyAyKSAtICh0aGlzLnRvdXJTdGVwV2lkdGggLyAyKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBsZWZ0UG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFkanVzdG1lbnQgPSBNYXRoLm1heCgwLCAtdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uKVxuICAgICAgICBjb25zdCBtYXhBZGp1c3RtZW50ID0gTWF0aC5taW4odGhpcy5tYXhXaWR0aEFkanVzdG1lbnRGb3JUb3VyU3RlcCwgYWRqdXN0bWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gKyBtYXhBZGp1c3RtZW50O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3JiTGVmdFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BSaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5yaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BMZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC53aWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5yaWdodCAtICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGggLyAyKSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB0cmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BMZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGVZKC0xMDAlKSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvcmJUcmFuc2Zvcm0oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tXG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZVkoLTUwJSknO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgtMTAwJSwgLTUwJSknO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlKC01MCUsIC01MCUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheVRvcCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCAtIHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheUxlZnQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0IC0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvdmVybGF5SGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0ICsgKHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpICogMik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvdmVybGF5V2lkdGgoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC53aWR0aCArICh0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKSAqIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGlnaGxpZ2h0UGFkZGluZygpOiBudW1iZXIge1xuICAgICAgICBsZXQgcGFkZGluZ0FkanVzdG1lbnQgPSB0aGlzLmN1cnJlbnRUb3VyU3RlcC51c2VIaWdobGlnaHRQYWRkaW5nID8gdGhpcy5oaWdobGlnaHRQYWRkaW5nIDogMDtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwLmhpZ2hsaWdodFBhZGRpbmcpIHtcbiAgICAgICAgICAgIHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5jdXJyZW50VG91clN0ZXAuaGlnaGxpZ2h0UGFkZGluZztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFkZGluZ0FkanVzdG1lbnQ7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBjYWxjdWxhdGVzIGEgdmFsdWUgdG8gYWRkIG9yIHN1YnRyYWN0IHNvIHRoZSBzdGVwIHNob3VsZCBub3QgYmUgb2ZmIHNjcmVlbi5cbiAgICBwcml2YXRlIGdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCk6IG51bWJlciB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNjcm9sbEFkanVzdG1lbnQgPSB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDA7XG4gICAgICAgIGNvbnN0IHRvdXJTdGVwSGVpZ2h0ID0gdHlwZW9mIHRoaXMudG91clN0ZXAubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicgPyB0aGlzLnRvdXJTdGVwLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IDogMDtcbiAgICAgICAgY29uc3QgZWxlbWVudEhlaWdodCA9IHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgKyBzY3JvbGxBZGp1c3RtZW50ICsgdG91clN0ZXBIZWlnaHQ7XG5cbiAgICAgICAgaWYgKCh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJIZWlnaHQgLSB0aGlzLnRvcE9mUGFnZUFkanVzdG1lbnQpIDwgZWxlbWVudEhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRIZWlnaHQgLSAodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG4iXX0=