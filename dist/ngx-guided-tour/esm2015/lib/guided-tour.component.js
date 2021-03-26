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
export class GuidedTourComponent {
    /**
     * @param {?} guidedTourService
     * @param {?} windowRef
     * @param {?} dom
     */
    constructor(guidedTourService, windowRef, dom) {
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
    /**
     * @private
     * @return {?}
     */
    get maxWidthAdjustmentForTourStep() {
        return this.tourStepWidth - this.minimalTourStepWidth;
    }
    /**
     * @private
     * @return {?}
     */
    get widthAdjustmentForScreenBound() {
        if (!this.tourStep) {
            return 0;
        }
        /** @type {?} */
        let adjustment = 0;
        if (this.calculatedLeftPosition < 0) {
            adjustment = -this.calculatedLeftPosition;
        }
        if (this.calculatedLeftPosition > this.windowRef.nativeWindow.innerWidth - this.tourStepWidth) {
            adjustment = this.calculatedLeftPosition - (this.windowRef.nativeWindow.innerWidth - this.tourStepWidth);
        }
        return Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
    }
    /**
     * @return {?}
     */
    get calculatedTourStepWidth() {
        return this.tourStepWidth - this.widthAdjustmentForScreenBound;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.guidedTourService.guidedTourCurrentStepStream.subscribe((/**
         * @param {?} step
         * @return {?}
         */
        (step) => {
            this.currentTourStep = step;
            if (step && step.selector) {
                /** @type {?} */
                const selectedElement = this.dom.querySelector(step.selector);
                if (selectedElement) {
                    this.scrollToAndSetElement();
                }
                else {
                    this.selectedElementRect = null;
                }
            }
            else {
                this.selectedElementRect = null;
            }
        }));
        this.guidedTourService.guidedTourOrbShowingStream.subscribe((/**
         * @param {?} value
         * @return {?}
         */
        (value) => {
            this.isOrbShowing = value;
        }));
        this.resizeSubscription = fromEvent(this.windowRef.nativeWindow, 'resize').subscribe((/**
         * @return {?}
         */
        () => {
            this.updateStepLocation();
        }));
        this.scrollSubscription = fromEvent(this.windowRef.nativeWindow, 'scroll').subscribe((/**
         * @return {?}
         */
        () => {
            this.updateStepLocation();
        }));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
        this.scrollSubscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    scrollToAndSetElement() {
        this.updateStepLocation();
        // Allow things to render to scroll to the correct location
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (!this.isOrbShowing && !this.isTourOnScreen()) {
                if (this.selectedElementRect && this.isBottom()) {
                    // Scroll so the element is on the top of the screen.
                    /** @type {?} */
                    const topPos = ((this.windowRef.nativeWindow.scrollY + this.selectedElementRect.top) - this.topOfPageAdjustment)
                        - (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        + this.getStepScreenAdjustment();
                    try {
                        this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            this.windowRef.nativeWindow.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
                else {
                    // Scroll so the element is on the bottom of the screen.
                    /** @type {?} */
                    const topPos = (this.windowRef.nativeWindow.scrollY + this.selectedElementRect.top + this.selectedElementRect.height)
                        - this.windowRef.nativeWindow.innerHeight
                        + (this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0)
                        - this.getStepScreenAdjustment();
                    try {
                        this.windowRef.nativeWindow.scrollTo({
                            left: null,
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            this.windowRef.nativeWindow.scroll(0, topPos);
                        }
                        else {
                            throw err;
                        }
                    }
                }
            }
        }));
    }
    /**
     * @return {?}
     */
    handleOrb() {
        this.guidedTourService.activateOrb();
        if (this.currentTourStep && this.currentTourStep.selector) {
            this.scrollToAndSetElement();
        }
    }
    /**
     * @private
     * @return {?}
     */
    isTourOnScreen() {
        return this.tourStep
            && this.elementInViewport(this.dom.querySelector(this.currentTourStep.selector))
            && this.elementInViewport(this.tourStep.nativeElement);
    }
    // Modified from https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
    /**
     * @private
     * @param {?} element
     * @return {?}
     */
    elementInViewport(element) {
        /** @type {?} */
        let top = element.offsetTop;
        /** @type {?} */
        const height = element.offsetHeight;
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    backdropClick(event) {
        if (this.guidedTourService.preventBackdropFromAdvancing) {
            event.stopPropagation();
        }
        else {
            this.guidedTourService.nextStep();
        }
    }
    /**
     * @return {?}
     */
    updateStepLocation() {
        if (this.currentTourStep && this.currentTourStep.selector) {
            /** @type {?} */
            const selectedElement = this.dom.querySelector(this.currentTourStep.selector);
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
    }
    /**
     * @private
     * @return {?}
     */
    isBottom() {
        return this.currentTourStep.orientation
            && (this.currentTourStep.orientation === Orientation.Bottom
                || this.currentTourStep.orientation === Orientation.BottomLeft
                || this.currentTourStep.orientation === Orientation.BottomRight);
    }
    /**
     * @return {?}
     */
    get topPosition() {
        /** @type {?} */
        const paddingAdjustment = this.getHighlightPadding();
        if (this.isBottom()) {
            return this.selectedElementRect.top + this.selectedElementRect.height + paddingAdjustment;
        }
        return this.selectedElementRect.top - this.getHighlightPadding();
    }
    /**
     * @return {?}
     */
    get orbTopPosition() {
        if (this.isBottom()) {
            return this.selectedElementRect.top + this.selectedElementRect.height;
        }
        if (this.currentTourStep.orientation === Orientation.Right
            || this.currentTourStep.orientation === Orientation.Left) {
            return (this.selectedElementRect.top + (this.selectedElementRect.height / 2));
        }
        return this.selectedElementRect.top;
    }
    /**
     * @private
     * @return {?}
     */
    get calculatedLeftPosition() {
        /** @type {?} */
        const paddingAdjustment = this.getHighlightPadding();
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
    }
    /**
     * @return {?}
     */
    get leftPosition() {
        if (this.calculatedLeftPosition >= 0) {
            return this.calculatedLeftPosition;
        }
        /** @type {?} */
        const adjustment = Math.max(0, -this.calculatedLeftPosition);
        /** @type {?} */
        const maxAdjustment = Math.min(this.maxWidthAdjustmentForTourStep, adjustment);
        return this.calculatedLeftPosition + maxAdjustment;
    }
    /**
     * @return {?}
     */
    get orbLeftPosition() {
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
    }
    /**
     * @return {?}
     */
    get transform() {
        if (!this.currentTourStep.orientation
            || this.currentTourStep.orientation === Orientation.Top
            || this.currentTourStep.orientation === Orientation.TopRight
            || this.currentTourStep.orientation === Orientation.TopLeft) {
            return 'translateY(-100%)';
        }
        return null;
    }
    /**
     * @return {?}
     */
    get orbTransform() {
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
    }
    /**
     * @return {?}
     */
    get overlayTop() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.top - this.getHighlightPadding();
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayLeft() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.left - this.getHighlightPadding();
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayHeight() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.height + (this.getHighlightPadding() * 2);
        }
        return 0;
    }
    /**
     * @return {?}
     */
    get overlayWidth() {
        if (this.selectedElementRect) {
            return this.selectedElementRect.width + (this.getHighlightPadding() * 2);
        }
        return 0;
    }
    /**
     * @private
     * @return {?}
     */
    getHighlightPadding() {
        /** @type {?} */
        let paddingAdjustment = this.currentTourStep.useHighlightPadding ? this.highlightPadding : 0;
        if (this.currentTourStep.highlightPadding) {
            paddingAdjustment = this.currentTourStep.highlightPadding;
        }
        return paddingAdjustment;
    }
    // This calculates a value to add or subtract so the step should not be off screen.
    /**
     * @private
     * @return {?}
     */
    getStepScreenAdjustment() {
        if (this.currentTourStep.orientation === Orientation.Left
            || this.currentTourStep.orientation === Orientation.Right) {
            return 0;
        }
        /** @type {?} */
        const scrollAdjustment = this.currentTourStep.scrollAdjustment ? this.currentTourStep.scrollAdjustment : 0;
        /** @type {?} */
        const tourStepHeight = typeof this.tourStep.nativeElement.getBoundingClientRect === 'function' ? this.tourStep.nativeElement.getBoundingClientRect().height : 0;
        /** @type {?} */
        const elementHeight = this.selectedElementRect.height + scrollAdjustment + tourStepHeight;
        if ((this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment) < elementHeight) {
            return elementHeight - (this.windowRef.nativeWindow.innerHeight - this.topOfPageAdjustment);
        }
        return 0;
    }
}
GuidedTourComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-guided-tour',
                template: `
        <div *ngIf="currentTourStep && selectedElementRect && isOrbShowing"
                (mouseenter)="handleOrb()"
                class="tour-orb tour-{{ currentTourStep.orientation }}"
                [style.top.px]="orbTopPosition"
                [style.left.px]="orbLeftPosition"
                [style.transform]="orbTransform">
                <div class="tour-orb-ring"></div>
        </div>
        <div *ngIf="currentTourStep && !isOrbShowing">
            <div class="guided-tour-user-input-mask" (click)="backdropClick($event)"></div>
            <div class="guided-tour-spotlight-overlay"
                [style.top.px]="overlayTop"
                [style.left.px]="overlayLeft"
                [style.height.px]="overlayHeight"
                [style.width.px]="overlayWidth">
            </div>
        </div>
        <div *ngIf="currentTourStep && !isOrbShowing">
            <div #tourStep *ngIf="currentTourStep"
                class="tour-step tour-{{ currentTourStep.orientation }}"
                [ngClass]="{
                    'page-tour-step': !currentTourStep.selector
                }"
                [style.top.px]="(currentTourStep.selector && selectedElementRect ? topPosition : null)"
                [style.left.px]="(currentTourStep.selector && selectedElementRect ? leftPosition : null)"
                [style.width.px]="(currentTourStep.selector && selectedElementRect ? calculatedTourStepWidth : null)"
                [style.transform]="(currentTourStep.selector && selectedElementRect ? transform : null)">
                <div *ngIf="currentTourStep.selector" class="tour-arrow"></div>
                <div class="tour-block">
                    <div *ngIf="
                        progressIndicatorLocation === progressIndicatorLocations.TopOfTourBlock
                        && !guidedTourService.onResizeMessage"
                    class="tour-progress-indicator">
                        <ng-container *ngTemplateOutlet="progress"></ng-container>
                    </div>
                    <h3 class="tour-title" *ngIf="currentTourStep.title && currentTourStep.selector">
                        {{ currentTourStep.title }}
                    </h3>
                    <h2 class="tour-title" *ngIf="currentTourStep.title && !currentTourStep.selector">
                        {{ currentTourStep.title }}
                    </h2>
                    <div class="tour-content" [innerHTML]="currentTourStep.content"></div>
                    <div class="tour-buttons">
                        <button *ngIf="!guidedTourService.onResizeMessage"
                            (click)="guidedTourService.skipTour()"
                            class="skip-button link-button">
                            {{ skipText }}
                        </button>
                        <button *ngIf="!guidedTourService.onLastStep && !guidedTourService.onResizeMessage"
                            class="next-button"
                            (click)="guidedTourService.nextStep()">
                            {{ nextText }}
                            <ng-container *ngIf="progressIndicatorLocation === progressIndicatorLocations.InsideNextButton">
                                <ng-container *ngTemplateOutlet="progress"></ng-container>
                            </ng-container>
                        </button>
                        <button *ngIf="guidedTourService.onLastStep"
                            class="next-button"
                            (click)="guidedTourService.nextStep()">
                            {{ doneText }}
                        </button>

                        <button *ngIf="guidedTourService.onResizeMessage"
                            class="next-button"
                            (click)="guidedTourService.resetTour()">
                            {{ closeText }}
                        </button>
                        <button *ngIf="!guidedTourService.onFirstStep && !guidedTourService.onResizeMessage"
                            class="back-button link-button"
                            (click)="guidedTourService.backStep()">
                            {{ backText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <ng-template #progress>
            <ng-container *ngTemplateOutlet="
                progressIndicator || defaultProgressIndicator; 
                context: { currentStepNumber: guidedTourService.currentTourStepDisplay, totalSteps: guidedTourService.currentTourStepCount }
            "></ng-container> 
        </ng-template>
        <ng-template #defaultProgressIndicator let-currentStepNumber="currentStepNumber" let-totalSteps="totalSteps">
            <ng-container *ngIf="progressIndicatorLocation === progressIndicatorLocations.InsideNextButton">&nbsp;</ng-container>{{ currentStepNumber }}/{{ totalSteps }}
        </ng-template>
    `,
                encapsulation: ViewEncapsulation.None,
                styles: ["ngx-guided-tour .guided-tour-user-input-mask{position:fixed;top:0;left:0;display:block;height:100%;width:100%;max-height:100vh;text-align:center;opacity:0}ngx-guided-tour .guided-tour-spotlight-overlay{position:fixed;box-shadow:0 0 0 9999px rgba(0,0,0,.7),0 0 1.5rem rgba(0,0,0,.5)}ngx-guided-tour .tour-orb{position:fixed;width:20px;height:20px;border-radius:50%}ngx-guided-tour .tour-orb .tour-orb-ring{width:35px;height:35px;position:relative;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-animation:2s linear infinite pulse;animation:2s linear infinite pulse}ngx-guided-tour .tour-orb .tour-orb-ring:after{content:'';display:inline-block;height:100%;width:100%;border-radius:50%}@-webkit-keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}@keyframes pulse{from{-webkit-transform:translate(-50%,-50%) scale(.45);transform:translate(-50%,-50%) scale(.45);opacity:1}to{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:0}}ngx-guided-tour .tour-step{position:fixed}ngx-guided-tour .tour-step.page-tour-step{max-width:400px;width:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before{position:absolute}ngx-guided-tour .tour-step.tour-bottom .tour-block,ngx-guided-tour .tour-step.tour-bottom-left .tour-block,ngx-guided-tour .tour-step.tour-bottom-right .tour-block{margin-top:10px}ngx-guided-tour .tour-step.tour-top,ngx-guided-tour .tour-step.tour-top-left,ngx-guided-tour .tour-step.tour-top-right{margin-bottom:10px}ngx-guided-tour .tour-step.tour-top .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{position:absolute;bottom:0}ngx-guided-tour .tour-step.tour-top .tour-block,ngx-guided-tour .tour-step.tour-top-left .tour-block,ngx-guided-tour .tour-step.tour-top-right .tour-block{margin-bottom:10px}ngx-guided-tour .tour-step.tour-bottom .tour-arrow::before,ngx-guided-tour .tour-step.tour-top .tour-arrow::before{-webkit-transform:translateX(-50%);transform:translateX(-50%);left:50%}ngx-guided-tour .tour-step.tour-bottom-right .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-right .tour-arrow::before{-webkit-transform:translateX(-100%);transform:translateX(-100%);left:calc(100% - 5px)}ngx-guided-tour .tour-step.tour-bottom-left .tour-arrow::before,ngx-guided-tour .tour-step.tour-top-left .tour-arrow::before{left:5px}ngx-guided-tour .tour-step.tour-left .tour-arrow::before{position:absolute;left:100%;-webkit-transform:translateX(-100%);transform:translateX(-100%);top:5px}ngx-guided-tour .tour-step.tour-left .tour-block{margin-right:10px}ngx-guided-tour .tour-step.tour-right .tour-arrow::before{position:absolute;left:0;top:5px}ngx-guided-tour .tour-step.tour-right .tour-block{margin-left:10px}ngx-guided-tour .tour-step .tour-block{padding:15px 25px}ngx-guided-tour .tour-step .tour-progress-indicator{padding-bottom:15px}ngx-guided-tour .tour-step .tour-title{font-weight:700!important;padding-bottom:20px}ngx-guided-tour .tour-step h3.tour-title{font-size:20px}ngx-guided-tour .tour-step h2.tour-title{font-size:30px}ngx-guided-tour .tour-step .tour-content{min-height:80px;padding-bottom:30px;font-size:15px}ngx-guided-tour .tour-step .tour-buttons{overflow:hidden}ngx-guided-tour .tour-step .tour-buttons button.link-button{font-size:15px;font-weight:700;max-width:none!important;cursor:pointer;text-align:center;white-space:nowrap;vertical-align:middle;border:1px solid transparent;line-height:1.5;background-color:transparent;position:relative;outline:0;padding:0 15px;-webkit-appearance:button}ngx-guided-tour .tour-step .tour-buttons button.skip-button.link-button{padding-left:0;border-left:0}ngx-guided-tour .tour-step .tour-buttons .back-button{float:right}ngx-guided-tour .tour-step .tour-buttons .next-button{cursor:pointer;border-radius:1px;float:right;font-size:14px;border:none;outline:0;padding-left:10px;padding-right:10px}"]
            }] }
];
/** @nocollapse */
GuidedTourComponent.ctorParameters = () => [
    { type: GuidedTourService },
    { type: WindowRefService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBYSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxSSxPQUFPLEVBQUUsU0FBUyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLFdBQVcsRUFBWSx5QkFBeUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzNGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBOEZ2RCxNQUFNLE9BQU8sbUJBQW1COzs7Ozs7SUFxQjVCLFlBQ1csaUJBQW9DLEVBQ25DLFNBQTJCLEVBQ1QsR0FBUTtRQUYzQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ25DLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQ1QsUUFBRyxHQUFILEdBQUcsQ0FBSztRQXZCdEIsd0JBQW1CLEdBQUksQ0FBQyxDQUFDO1FBQ3pCLGtCQUFhLEdBQUksR0FBRyxDQUFDO1FBQ3JCLHlCQUFvQixHQUFJLEdBQUcsQ0FBQztRQUM1QixhQUFRLEdBQUksTUFBTSxDQUFDO1FBQ25CLGFBQVEsR0FBSSxNQUFNLENBQUM7UUFDbkIsYUFBUSxHQUFJLE1BQU0sQ0FBQztRQUNuQixjQUFTLEdBQUksT0FBTyxDQUFDO1FBQ3JCLGFBQVEsR0FBSSxNQUFNLENBQUM7UUFDbkIsOEJBQXlCLEdBQStCLHlCQUF5QixDQUFDLGdCQUFnQixDQUFDO1FB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LEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLO3dDQUNMLEtBQUs7Z0NBQ0wsS0FBSzt1QkFDTCxTQUFTLFNBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7OztJQVZ4QyxrREFBeUM7O0lBQ3pDLDRDQUFxQzs7SUFDckMsbURBQTRDOztJQUM1Qyx1Q0FBbUM7O0lBQ25DLHVDQUFtQzs7SUFDbkMsdUNBQW1DOztJQUNuQyx3Q0FBcUM7O0lBQ3JDLHVDQUFtQzs7SUFDbkMsd0RBQW1IOztJQUNuSCxnREFBaUU7O0lBQ2pFLHVDQUFzRTs7SUFDdEUsK0NBQTRCOztJQUM1Qiw4Q0FBd0M7O0lBQ3hDLGtEQUEyQzs7SUFDM0MsMkNBQTRCOztJQUM1Qix5REFBOEQ7Ozs7O0lBRTlELGlEQUF5Qzs7Ozs7SUFDekMsaURBQXlDOztJQUdyQyxnREFBMkM7Ozs7O0lBQzNDLHdDQUFtQzs7Ozs7SUFDbkMsa0NBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbnB1dCwgT25EZXN0cm95LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uLCBUZW1wbGF0ZVJlZiwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgT3JpZW50YXRpb24sIFRvdXJTdGVwLCBQcm9ncmVzc0luZGljYXRvckxvY2F0aW9uIH0gZnJvbSAnLi9ndWlkZWQtdG91ci5jb25zdGFudHMnO1xuaW1wb3J0IHsgR3VpZGVkVG91clNlcnZpY2UgfSBmcm9tICcuL2d1aWRlZC10b3VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgV2luZG93UmVmU2VydmljZSB9IGZyb20gXCIuL3dpbmRvd3JlZi5zZXJ2aWNlXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmd4LWd1aWRlZC10b3VyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgJiYgaXNPcmJTaG93aW5nXCJcbiAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJoYW5kbGVPcmIoKVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0b3VyLW9yYiB0b3VyLXt7IGN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiB9fVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRvcC5weF09XCJvcmJUb3BQb3NpdGlvblwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwib3JiTGVmdFBvc2l0aW9uXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIm9yYlRyYW5zZm9ybVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLW9yYi1yaW5nXCI+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmICFpc09yYlNob3dpbmdcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZWQtdG91ci11c2VyLWlucHV0LW1hc2tcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGljaygkZXZlbnQpXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVkLXRvdXItc3BvdGxpZ2h0LW92ZXJsYXlcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50b3AucHhdPVwib3ZlcmxheVRvcFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwib3ZlcmxheUxlZnRcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwib3ZlcmxheUhlaWdodFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cIm92ZXJsYXlXaWR0aFwiPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwICYmICFpc09yYlNob3dpbmdcIj5cbiAgICAgICAgICAgIDxkaXYgI3RvdXJTdGVwICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRvdXItc3RlcCB0b3VyLXt7IGN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiB9fVwiXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICAgICAncGFnZS10b3VyLXN0ZXAnOiAhY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXG4gICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRvcC5weF09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyB0b3BQb3NpdGlvbiA6IG51bGwpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubGVmdC5weF09XCIoY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yICYmIHNlbGVjdGVkRWxlbWVudFJlY3QgPyBsZWZ0UG9zaXRpb24gOiBudWxsKVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cIihjdXJyZW50VG91clN0ZXAuc2VsZWN0b3IgJiYgc2VsZWN0ZWRFbGVtZW50UmVjdCA/IGNhbGN1bGF0ZWRUb3VyU3RlcFdpZHRoIDogbnVsbClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwiKGN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvciAmJiBzZWxlY3RlZEVsZW1lbnRSZWN0ID8gdHJhbnNmb3JtIDogbnVsbClcIj5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yXCIgY2xhc3M9XCJ0b3VyLWFycm93XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvdXItYmxvY2tcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbiA9PT0gcHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbnMuVG9wT2ZUb3VyQmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICYmICFndWlkZWRUb3VyU2VydmljZS5vblJlc2l6ZU1lc3NhZ2VcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRvdXItcHJvZ3Jlc3MtaW5kaWNhdG9yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicHJvZ3Jlc3NcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzcz1cInRvdXItdGl0bGVcIiAqbmdJZj1cImN1cnJlbnRUb3VyU3RlcC50aXRsZSAmJiBjdXJyZW50VG91clN0ZXAuc2VsZWN0b3JcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt7IGN1cnJlbnRUb3VyU3RlcC50aXRsZSB9fVxuICAgICAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0b3VyLXRpdGxlXCIgKm5nSWY9XCJjdXJyZW50VG91clN0ZXAudGl0bGUgJiYgIWN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3sgY3VycmVudFRvdXJTdGVwLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLWNvbnRlbnRcIiBbaW5uZXJIVE1MXT1cImN1cnJlbnRUb3VyU3RlcC5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3VyLWJ1dHRvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCIhZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2Uuc2tpcFRvdXIoKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJza2lwLWJ1dHRvbiBsaW5rLWJ1dHRvblwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IHNraXBUZXh0IH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCIhZ3VpZGVkVG91clNlcnZpY2Uub25MYXN0U3RlcCAmJiAhZ3VpZGVkVG91clNlcnZpY2Uub25SZXNpemVNZXNzYWdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2UubmV4dFN0ZXAoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IG5leHRUZXh0IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24gPT09IHByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb25zLkluc2lkZU5leHRCdXR0b25cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInByb2dyZXNzXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJndWlkZWRUb3VyU2VydmljZS5vbkxhc3RTdGVwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5leHQtYnV0dG9uXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiZ3VpZGVkVG91clNlcnZpY2UubmV4dFN0ZXAoKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt7IGRvbmVUZXh0IH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJuZXh0LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLnJlc2V0VG91cigpXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3sgY2xvc2VUZXh0IH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCIhZ3VpZGVkVG91clNlcnZpY2Uub25GaXJzdFN0ZXAgJiYgIWd1aWRlZFRvdXJTZXJ2aWNlLm9uUmVzaXplTWVzc2FnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJiYWNrLWJ1dHRvbiBsaW5rLWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImd1aWRlZFRvdXJTZXJ2aWNlLmJhY2tTdGVwKClcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBiYWNrVGV4dCB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctdGVtcGxhdGUgI3Byb2dyZXNzPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIlxuICAgICAgICAgICAgICAgIHByb2dyZXNzSW5kaWNhdG9yIHx8IGRlZmF1bHRQcm9ncmVzc0luZGljYXRvcjsgXG4gICAgICAgICAgICAgICAgY29udGV4dDogeyBjdXJyZW50U3RlcE51bWJlcjogZ3VpZGVkVG91clNlcnZpY2UuY3VycmVudFRvdXJTdGVwRGlzcGxheSwgdG90YWxTdGVwczogZ3VpZGVkVG91clNlcnZpY2UuY3VycmVudFRvdXJTdGVwQ291bnQgfVxuICAgICAgICAgICAgXCI+PC9uZy1jb250YWluZXI+IFxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRQcm9ncmVzc0luZGljYXRvciBsZXQtY3VycmVudFN0ZXBOdW1iZXI9XCJjdXJyZW50U3RlcE51bWJlclwiIGxldC10b3RhbFN0ZXBzPVwidG90YWxTdGVwc1wiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24gPT09IHByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb25zLkluc2lkZU5leHRCdXR0b25cIj4mbmJzcDs8L25nLWNvbnRhaW5lcj57eyBjdXJyZW50U3RlcE51bWJlciB9fS97eyB0b3RhbFN0ZXBzIH19XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgYCxcbiAgICBzdHlsZVVybHM6IFsnLi9ndWlkZWQtdG91ci5jb21wb25lbnQuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgR3VpZGVkVG91ckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgcHVibGljIHRvcE9mUGFnZUFkanVzdG1lbnQgPz0gMDtcbiAgICBASW5wdXQoKSBwdWJsaWMgdG91clN0ZXBXaWR0aCA/PSAzMDA7XG4gICAgQElucHV0KCkgcHVibGljIG1pbmltYWxUb3VyU3RlcFdpZHRoID89IDIwMDtcbiAgICBASW5wdXQoKSBwdWJsaWMgc2tpcFRleHQgPz0gJ1NraXAnO1xuICAgIEBJbnB1dCgpIHB1YmxpYyBuZXh0VGV4dCA/PSAnTmV4dCc7XG4gICAgQElucHV0KCkgcHVibGljIGRvbmVUZXh0ID89ICdEb25lJztcbiAgICBASW5wdXQoKSBwdWJsaWMgY2xvc2VUZXh0ID89ICdDbG9zZSc7XG4gICAgQElucHV0KCkgcHVibGljIGJhY2tUZXh0ID89ICdCYWNrJztcbiAgICBASW5wdXQoKSBwdWJsaWMgcHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbj86IFByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24gPSBQcm9ncmVzc0luZGljYXRvckxvY2F0aW9uLkluc2lkZU5leHRCdXR0b247XG4gICAgQElucHV0KCkgcHVibGljIHByb2dyZXNzSW5kaWNhdG9yPzogVGVtcGxhdGVSZWY8YW55PiA9IHVuZGVmaW5lZDtcbiAgICBAVmlld0NoaWxkKCd0b3VyU3RlcCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwdWJsaWMgdG91clN0ZXA6IEVsZW1lbnRSZWY7XG4gICAgcHVibGljIGhpZ2hsaWdodFBhZGRpbmcgPSA0O1xuICAgIHB1YmxpYyBjdXJyZW50VG91clN0ZXA6IFRvdXJTdGVwID0gbnVsbDtcbiAgICBwdWJsaWMgc2VsZWN0ZWRFbGVtZW50UmVjdDogRE9NUmVjdCA9IG51bGw7XG4gICAgcHVibGljIGlzT3JiU2hvd2luZyA9IGZhbHNlO1xuICAgIHB1YmxpYyBwcm9ncmVzc0luZGljYXRvckxvY2F0aW9ucyA9IFByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb247XG5cbiAgICBwcml2YXRlIHJlc2l6ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICAgIHByaXZhdGUgc2Nyb2xsU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGd1aWRlZFRvdXJTZXJ2aWNlOiBHdWlkZWRUb3VyU2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSB3aW5kb3dSZWY6IFdpbmRvd1JlZlNlcnZpY2UsXG4gICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9tOiBhbnlcbiAgICApIHsgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG91clN0ZXBXaWR0aCAtIHRoaXMubWluaW1hbFRvdXJTdGVwV2lkdGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgd2lkdGhBZGp1c3RtZW50Rm9yU2NyZWVuQm91bmQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCF0aGlzLnRvdXJTdGVwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYWRqdXN0bWVudCA9IDA7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gPCAwKSB7XG4gICAgICAgICAgICBhZGp1c3RtZW50ID0gLXRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uID4gdGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LmlubmVyV2lkdGggLSB0aGlzLnRvdXJTdGVwV2lkdGgpIHtcbiAgICAgICAgICAgIGFkanVzdG1lbnQgPSB0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gLSAodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LmlubmVyV2lkdGggLSB0aGlzLnRvdXJTdGVwV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMubWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAsIGFkanVzdG1lbnQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgY2FsY3VsYXRlZFRvdXJTdGVwV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdXJTdGVwV2lkdGggLSB0aGlzLndpZHRoQWRqdXN0bWVudEZvclNjcmVlbkJvdW5kO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UuZ3VpZGVkVG91ckN1cnJlbnRTdGVwU3RyZWFtLnN1YnNjcmliZSgoc3RlcDogVG91clN0ZXApID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwID0gc3RlcDtcbiAgICAgICAgICAgIGlmIChzdGVwICYmIHN0ZXAuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKHN0ZXAuc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb0FuZFNldEVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5ndWlkZWRUb3VyT3JiU2hvd2luZ1N0cmVhbS5zdWJzY3JpYmUoKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzT3JiU2hvd2luZyA9IHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3csICdyZXNpemUnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGVwTG9jYXRpb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LCAnc2Nyb2xsJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RlcExvY2F0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5zY3JvbGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2Nyb2xsVG9BbmRTZXRFbGVtZW50KCk6IHZvaWQge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0ZXBMb2NhdGlvbigpO1xuICAgICAgICAvLyBBbGxvdyB0aGluZ3MgdG8gcmVuZGVyIHRvIHNjcm9sbCB0byB0aGUgY29ycmVjdCBsb2NhdGlvblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc09yYlNob3dpbmcgJiYgIXRoaXMuaXNUb3VyT25TY3JlZW4oKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgJiYgdGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNjcm9sbCBzbyB0aGUgZWxlbWVudCBpcyBvbiB0aGUgdG9wIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvcFBvcyA9ICgodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnNjcm9sbFkgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wKSAtIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC0gKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMClcbiAgICAgICAgICAgICAgICAgICAgICAgICsgdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogdG9wUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5zY3JvbGwoMCwgdG9wUG9zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHNvIHRoZSBlbGVtZW50IGlzIG9uIHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9wUG9zID0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5zY3JvbGxZICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAtIHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgKyAodGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgLSB0aGlzLmdldFN0ZXBTY3JlZW5BZGp1c3RtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB0b3BQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LnNjcm9sbCgwLCB0b3BQb3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVPcmIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3VpZGVkVG91clNlcnZpY2UuYWN0aXZhdGVPcmIoKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwICYmIHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvQW5kU2V0RWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1RvdXJPblNjcmVlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG91clN0ZXBcbiAgICAgICAgICAgICYmIHRoaXMuZWxlbWVudEluVmlld3BvcnQodGhpcy5kb20ucXVlcnlTZWxlY3Rvcih0aGlzLmN1cnJlbnRUb3VyU3RlcC5zZWxlY3RvcikpXG4gICAgICAgICAgICAmJiB0aGlzLmVsZW1lbnRJblZpZXdwb3J0KHRoaXMudG91clN0ZXAubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgLy8gTW9kaWZpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjM5OTkvaG93LXRvLXRlbGwtaWYtYS1kb20tZWxlbWVudC1pcy12aXNpYmxlLWluLXRoZS1jdXJyZW50LXZpZXdwb3J0XG4gICAgcHJpdmF0ZSBlbGVtZW50SW5WaWV3cG9ydChlbGVtZW50OiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgdG9wID0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IChlbGVtZW50Lm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNCb3R0b20oKSkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0b3AgPj0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICAgICAgICAgICAgICArIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudFxuICAgICAgICAgICAgICAgICAgICArICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50ID8gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA6IDApXG4gICAgICAgICAgICAgICAgICAgICsgdGhpcy5nZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpKVxuICAgICAgICAgICAgICAgICYmICh0b3AgKyBoZWlnaHQpIDw9ICh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cucGFnZVlPZmZzZXQgKyB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICB0b3AgPj0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5wYWdlWU9mZnNldCArIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudCAtIHRoaXMuZ2V0U3RlcFNjcmVlbkFkanVzdG1lbnQoKSlcbiAgICAgICAgICAgICAgICAmJiAodG9wICsgaGVpZ2h0ICsgKHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgPyB0aGlzLmN1cnJlbnRUb3VyU3RlcC5zY3JvbGxBZGp1c3RtZW50IDogMCkpIDw9ICh0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cucGFnZVlPZmZzZXQgKyB0aGlzLndpbmRvd1JlZi5uYXRpdmVXaW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGJhY2tkcm9wQ2xpY2soZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmd1aWRlZFRvdXJTZXJ2aWNlLnByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmcpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ndWlkZWRUb3VyU2VydmljZS5uZXh0U3RlcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZVN0ZXBMb2NhdGlvbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRvdXJTdGVwICYmIHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKHRoaXMuY3VycmVudFRvdXJTdGVwLnNlbGVjdG9yKTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQgJiYgdHlwZW9mIHNlbGVjdGVkRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSAoc2VsZWN0ZWRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIGFzIERPTVJlY3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNCb3R0b20oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgJiYgKHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21cbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdG9wUG9zaXRpb24oKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgcGFkZGluZ0FkanVzdG1lbnQgPSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcblxuICAgICAgICBpZiAodGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgKyBwYWRkaW5nQWRqdXN0bWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wIC0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvcmJUb3BQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5pc0JvdHRvbSgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcCArIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QudG9wICsgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5oZWlnaHQgLyAyKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LnRvcDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBjYWxjdWxhdGVkTGVmdFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uQm90dG9tUmlnaHRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5yaWdodCAtIHRoaXMudG91clN0ZXBXaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0IC0gdGhpcy50b3VyU3RlcFdpZHRoIC0gcGFkZGluZ0FkanVzdG1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC5sZWZ0ICsgdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoICsgcGFkZGluZ0FkanVzdG1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQgLSAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoIC8gMikgLSAodGhpcy50b3VyU3RlcFdpZHRoIC8gMikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgbGVmdFBvc2l0aW9uKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLmNhbGN1bGF0ZWRMZWZ0UG9zaXRpb24gPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhZGp1c3RtZW50ID0gTWF0aC5tYXgoMCwgLXRoaXMuY2FsY3VsYXRlZExlZnRQb3NpdGlvbilcbiAgICAgICAgY29uc3QgbWF4QWRqdXN0bWVudCA9IE1hdGgubWluKHRoaXMubWF4V2lkdGhBZGp1c3RtZW50Rm9yVG91clN0ZXAsIGFkanVzdG1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVkTGVmdFBvc2l0aW9uICsgbWF4QWRqdXN0bWVudDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9yYkxlZnRQb3NpdGlvbigpOiBudW1iZXIge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wUmlnaHRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21SaWdodFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbUxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uUmlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmxlZnQgKyB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QucmlnaHQgLSAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LndpZHRoIC8gMikpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgdHJhbnNmb3JtKCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFJpZ2h0XG4gICAgICAgICAgICB8fCB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uVG9wTGVmdFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiAndHJhbnNsYXRlWSgtMTAwJSknO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3JiVHJhbnNmb3JtKCk6IHN0cmluZyB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvblxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlRvcExlZnRcbiAgICAgICAgICAgIHx8IHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Cb3R0b21MZWZ0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGVZKC01MCUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5Ub3BSaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkJvdHRvbVJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoLTEwMCUsIC01MCUpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRvdXJTdGVwLm9yaWVudGF0aW9uID09PSBPcmllbnRhdGlvbi5SaWdodFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLkxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlUb3AoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRFbGVtZW50UmVjdC50b3AgLSB0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG92ZXJsYXlMZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QubGVmdCAtIHRoaXMuZ2V0SGlnaGxpZ2h0UGFkZGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheUhlaWdodCgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEVsZW1lbnRSZWN0LmhlaWdodCArICh0aGlzLmdldEhpZ2hsaWdodFBhZGRpbmcoKSAqIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgb3ZlcmxheVdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3Qud2lkdGggKyAodGhpcy5nZXRIaWdobGlnaHRQYWRkaW5nKCkgKiAyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEhpZ2hsaWdodFBhZGRpbmcoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHBhZGRpbmdBZGp1c3RtZW50ID0gdGhpcy5jdXJyZW50VG91clN0ZXAudXNlSGlnaGxpZ2h0UGFkZGluZyA/IHRoaXMuaGlnaGxpZ2h0UGFkZGluZyA6IDA7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUb3VyU3RlcC5oaWdobGlnaHRQYWRkaW5nKSB7XG4gICAgICAgICAgICBwYWRkaW5nQWRqdXN0bWVudCA9IHRoaXMuY3VycmVudFRvdXJTdGVwLmhpZ2hsaWdodFBhZGRpbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmdBZGp1c3RtZW50O1xuICAgIH1cblxuICAgIC8vIFRoaXMgY2FsY3VsYXRlcyBhIHZhbHVlIHRvIGFkZCBvciBzdWJ0cmFjdCBzbyB0aGUgc3RlcCBzaG91bGQgbm90IGJlIG9mZiBzY3JlZW4uXG4gICAgcHJpdmF0ZSBnZXRTdGVwU2NyZWVuQWRqdXN0bWVudCgpOiBudW1iZXIge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUb3VyU3RlcC5vcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uTGVmdFxuICAgICAgICAgICAgfHwgdGhpcy5jdXJyZW50VG91clN0ZXAub3JpZW50YXRpb24gPT09IE9yaWVudGF0aW9uLlJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzY3JvbGxBZGp1c3RtZW50ID0gdGhpcy5jdXJyZW50VG91clN0ZXAuc2Nyb2xsQWRqdXN0bWVudCA/IHRoaXMuY3VycmVudFRvdXJTdGVwLnNjcm9sbEFkanVzdG1lbnQgOiAwO1xuICAgICAgICBjb25zdCB0b3VyU3RlcEhlaWdodCA9IHR5cGVvZiB0aGlzLnRvdXJTdGVwLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID09PSAnZnVuY3Rpb24nID8gdGhpcy50b3VyU3RlcC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCA6IDA7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSB0aGlzLnNlbGVjdGVkRWxlbWVudFJlY3QuaGVpZ2h0ICsgc2Nyb2xsQWRqdXN0bWVudCArIHRvdXJTdGVwSGVpZ2h0O1xuXG4gICAgICAgIGlmICgodGhpcy53aW5kb3dSZWYubmF0aXZlV2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy50b3BPZlBhZ2VBZGp1c3RtZW50KSA8IGVsZW1lbnRIZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50SGVpZ2h0IC0gKHRoaXMud2luZG93UmVmLm5hdGl2ZVdpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMudG9wT2ZQYWdlQWRqdXN0bWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuIl19