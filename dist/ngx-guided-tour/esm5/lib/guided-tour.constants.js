/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function TourStep() { }
if (false) {
    /**
     * Selector for element that will be highlighted
     * @type {?|undefined}
     */
    TourStep.prototype.selector;
    /**
     * Tour title text
     * @type {?|undefined}
     */
    TourStep.prototype.title;
    /**
     * Tour step text
     * @type {?}
     */
    TourStep.prototype.content;
    /**
     * Where the tour step will appear next to the selected element
     * @type {?|undefined}
     */
    TourStep.prototype.orientation;
    /**
     * Action that happens when the step is opened
     * @type {?|undefined}
     */
    TourStep.prototype.action;
    /**
     * Action that happens when the step is closed
     * @type {?|undefined}
     */
    TourStep.prototype.closeAction;
    /**
     * Skips this step, this is so you do not have create multiple tour configurations based on user settings/configuration
     * @type {?|undefined}
     */
    TourStep.prototype.skipStep;
    /**
     * Adds some padding for things like sticky headers when scrolling to an element
     * @type {?|undefined}
     */
    TourStep.prototype.scrollAdjustment;
    /**
     * Adds default padding around tour highlighting. Does not need to be true for highlightPadding to work
     * @type {?|undefined}
     */
    TourStep.prototype.useHighlightPadding;
    /**
     * Adds padding around tour highlighting in pixels, this overwrites the default for this step. Is not dependent on useHighlightPadding being true
     * @type {?|undefined}
     */
    TourStep.prototype.highlightPadding;
}
/**
 * @record
 */
export function GuidedTour() { }
if (false) {
    /**
     * Identifier for tour
     * @type {?}
     */
    GuidedTour.prototype.tourId;
    /**
     * Use orb to start tour
     * @type {?|undefined}
     */
    GuidedTour.prototype.useOrb;
    /**
     * Steps fo the tour
     * @type {?}
     */
    GuidedTour.prototype.steps;
    /**
     * Function will be called when tour is skipped
     * @type {?|undefined}
     */
    GuidedTour.prototype.skipCallback;
    /**
     * Function will be called when tour is completed
     * @type {?|undefined}
     */
    GuidedTour.prototype.completeCallback;
    /**
     * Minimum size of screen in pixels before the tour is run, if the tour is resized below this value the user will be told to resize
     * @type {?|undefined}
     */
    GuidedTour.prototype.minimumScreenSize;
    /**
     * Dialog shown if the window width is smaller than the defined minimum screen size.
     * @type {?|undefined}
     */
    GuidedTour.prototype.resizeDialog;
    /**
     * Prevents the tour from advancing by clicking the backdrop.
     * This should only be set if you are completely sure your tour is displaying correctly on all screen sizes otherwise a user can get stuck.
     * @type {?|undefined}
     */
    GuidedTour.prototype.preventBackdropFromAdvancing;
}
/**
 * @record
 */
export function OrientationConfiguration() { }
if (false) {
    /**
     * Where the tour step will appear next to the selected element
     * @type {?}
     */
    OrientationConfiguration.prototype.orientationDirection;
    /**
     * When this orientation configuration starts in pixels
     * @type {?|undefined}
     */
    OrientationConfiguration.prototype.maximumSize;
}
var Orientation = /** @class */ (function () {
    function Orientation() {
    }
    Orientation.Bottom = 'bottom';
    Orientation.BottomLeft = 'bottom-left';
    Orientation.BottomRight = 'bottom-right';
    Orientation.Center = 'center';
    Orientation.Left = 'left';
    Orientation.Right = 'right';
    Orientation.Top = 'top';
    Orientation.TopLeft = 'top-left';
    Orientation.TopRight = 'top-right';
    return Orientation;
}());
export { Orientation };
if (false) {
    /** @type {?} */
    Orientation.Bottom;
    /** @type {?} */
    Orientation.BottomLeft;
    /** @type {?} */
    Orientation.BottomRight;
    /** @type {?} */
    Orientation.Center;
    /** @type {?} */
    Orientation.Left;
    /** @type {?} */
    Orientation.Right;
    /** @type {?} */
    Orientation.Top;
    /** @type {?} */
    Orientation.TopLeft;
    /** @type {?} */
    Orientation.TopRight;
}
/** @enum {string} */
var ProgressIndicatorLocation = {
    InsideNextButton: 'inside-next-button',
    TopOfTourBlock: 'top-of-tour-block',
    None: 'none',
};
export { ProgressIndicatorLocation };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsOEJBcUJDOzs7Ozs7SUFuQkcsNEJBQWtCOzs7OztJQUVsQix5QkFBZTs7Ozs7SUFFZiwyQkFBZ0I7Ozs7O0lBRWhCLCtCQUF1RDs7Ozs7SUFFdkQsMEJBQW9COzs7OztJQUVwQiwrQkFBeUI7Ozs7O0lBRXpCLDRCQUFtQjs7Ozs7SUFFbkIsb0NBQTBCOzs7OztJQUUxQix1Q0FBOEI7Ozs7O0lBRTlCLG9DQUEwQjs7Ozs7QUFHOUIsZ0NBeUJDOzs7Ozs7SUF2QkcsNEJBQWU7Ozs7O0lBRWYsNEJBQWlCOzs7OztJQUVqQiwyQkFBa0I7Ozs7O0lBRWxCLGtDQUErQzs7Ozs7SUFFL0Msc0NBQThCOzs7OztJQUU5Qix1Q0FBMkI7Ozs7O0lBRTNCLGtDQUtDOzs7Ozs7SUFLRCxrREFBdUM7Ozs7O0FBRzNDLDhDQUtDOzs7Ozs7SUFIRyx3REFBa0M7Ozs7O0lBRWxDLCtDQUFxQjs7QUFHekI7SUFBQTtJQVVBLENBQUM7SUFUMEIsa0JBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsc0JBQVUsR0FBRyxhQUFhLENBQUM7SUFDM0IsdUJBQVcsR0FBRyxjQUFjLENBQUM7SUFDN0Isa0JBQU0sR0FBRyxRQUFRLENBQUM7SUFDbEIsZ0JBQUksR0FBRyxNQUFNLENBQUM7SUFDZCxpQkFBSyxHQUFHLE9BQU8sQ0FBQztJQUNoQixlQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ1osbUJBQU8sR0FBRyxVQUFVLENBQUM7SUFDckIsb0JBQVEsR0FBRyxXQUFXLENBQUM7SUFDbEQsa0JBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxXQUFXOzs7SUFDcEIsbUJBQXlDOztJQUN6Qyx1QkFBa0Q7O0lBQ2xELHdCQUFvRDs7SUFDcEQsbUJBQXlDOztJQUN6QyxpQkFBcUM7O0lBQ3JDLGtCQUF1Qzs7SUFDdkMsZ0JBQW1DOztJQUNuQyxvQkFBNEM7O0lBQzVDLHFCQUE4Qzs7OztJQUk5QyxrQkFBbUIsb0JBQW9CO0lBQ3ZDLGdCQUFpQixtQkFBbUI7SUFDcEMsTUFBTyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgaW50ZXJmYWNlIFRvdXJTdGVwIHtcbiAgICAvKiogU2VsZWN0b3IgZm9yIGVsZW1lbnQgdGhhdCB3aWxsIGJlIGhpZ2hsaWdodGVkICovXG4gICAgc2VsZWN0b3I/OiBzdHJpbmc7XG4gICAgLyoqIFRvdXIgdGl0bGUgdGV4dCAqL1xuICAgIHRpdGxlPzogc3RyaW5nO1xuICAgIC8qKiBUb3VyIHN0ZXAgdGV4dCAqL1xuICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICAvKiogV2hlcmUgdGhlIHRvdXIgc3RlcCB3aWxsIGFwcGVhciBuZXh0IHRvIHRoZSBzZWxlY3RlZCBlbGVtZW50ICovXG4gICAgb3JpZW50YXRpb24/OiBPcmllbnRhdGlvbiB8IE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbltdO1xuICAgIC8qKiBBY3Rpb24gdGhhdCBoYXBwZW5zIHdoZW4gdGhlIHN0ZXAgaXMgb3BlbmVkICovXG4gICAgYWN0aW9uPzogKCkgPT4gdm9pZDtcbiAgICAvKiogQWN0aW9uIHRoYXQgaGFwcGVucyB3aGVuIHRoZSBzdGVwIGlzIGNsb3NlZCAqL1xuICAgIGNsb3NlQWN0aW9uPzogKCkgPT4gdm9pZDtcbiAgICAvKiogU2tpcHMgdGhpcyBzdGVwLCB0aGlzIGlzIHNvIHlvdSBkbyBub3QgaGF2ZSBjcmVhdGUgbXVsdGlwbGUgdG91ciBjb25maWd1cmF0aW9ucyBiYXNlZCBvbiB1c2VyIHNldHRpbmdzL2NvbmZpZ3VyYXRpb24gKi9cbiAgICBza2lwU3RlcD86IGJvb2xlYW47XG4gICAgLyoqIEFkZHMgc29tZSBwYWRkaW5nIGZvciB0aGluZ3MgbGlrZSBzdGlja3kgaGVhZGVycyB3aGVuIHNjcm9sbGluZyB0byBhbiBlbGVtZW50ICovXG4gICAgc2Nyb2xsQWRqdXN0bWVudD86IG51bWJlcjtcbiAgICAvKiogQWRkcyBkZWZhdWx0IHBhZGRpbmcgYXJvdW5kIHRvdXIgaGlnaGxpZ2h0aW5nLiBEb2VzIG5vdCBuZWVkIHRvIGJlIHRydWUgZm9yIGhpZ2hsaWdodFBhZGRpbmcgdG8gd29yayAqL1xuICAgIHVzZUhpZ2hsaWdodFBhZGRpbmc/OiBib29sZWFuO1xuICAgIC8qKiBBZGRzIHBhZGRpbmcgYXJvdW5kIHRvdXIgaGlnaGxpZ2h0aW5nIGluIHBpeGVscywgdGhpcyBvdmVyd3JpdGVzIHRoZSBkZWZhdWx0IGZvciB0aGlzIHN0ZXAuIElzIG5vdCBkZXBlbmRlbnQgb24gdXNlSGlnaGxpZ2h0UGFkZGluZyBiZWluZyB0cnVlICovXG4gICAgaGlnaGxpZ2h0UGFkZGluZz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHdWlkZWRUb3VyIHtcbiAgICAvKiogSWRlbnRpZmllciBmb3IgdG91ciAqL1xuICAgIHRvdXJJZDogc3RyaW5nO1xuICAgIC8qKiBVc2Ugb3JiIHRvIHN0YXJ0IHRvdXIgKi9cbiAgICB1c2VPcmI/OiBib29sZWFuO1xuICAgIC8qKiBTdGVwcyBmbyB0aGUgdG91ciAqL1xuICAgIHN0ZXBzOiBUb3VyU3RlcFtdO1xuICAgIC8qKiBGdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRvdXIgaXMgc2tpcHBlZCAqL1xuICAgIHNraXBDYWxsYmFjaz86IChzdGVwU2tpcHBlZE9uOiBudW1iZXIpID0+IHZvaWQ7XG4gICAgLyoqIEZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdG91ciBpcyBjb21wbGV0ZWQgKi9cbiAgICBjb21wbGV0ZUNhbGxiYWNrPzogKCkgPT4gdm9pZDtcbiAgICAvKiogTWluaW11bSBzaXplIG9mIHNjcmVlbiBpbiBwaXhlbHMgYmVmb3JlIHRoZSB0b3VyIGlzIHJ1biwgaWYgdGhlIHRvdXIgaXMgcmVzaXplZCBiZWxvdyB0aGlzIHZhbHVlIHRoZSB1c2VyIHdpbGwgYmUgdG9sZCB0byByZXNpemUgKi9cbiAgICBtaW5pbXVtU2NyZWVuU2l6ZT86IG51bWJlcjtcbiAgICAvKiogRGlhbG9nIHNob3duIGlmIHRoZSB3aW5kb3cgd2lkdGggaXMgc21hbGxlciB0aGFuIHRoZSBkZWZpbmVkIG1pbmltdW0gc2NyZWVuIHNpemUuICovXG4gICAgcmVzaXplRGlhbG9nPzoge1xuICAgICAgICAvKiogUmVzaXplIGRpYWxvZyB0aXRsZSB0ZXh0ICovXG4gICAgICAgIHRpdGxlPzogc3RyaW5nO1xuICAgICAgICAvKiogUmVzaXplIGRpYWxvZyB0ZXh0ICovXG4gICAgICAgIGNvbnRlbnQ6IHN0cmluZztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJldmVudHMgdGhlIHRvdXIgZnJvbSBhZHZhbmNpbmcgYnkgY2xpY2tpbmcgdGhlIGJhY2tkcm9wLlxuICAgICAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgc2V0IGlmIHlvdSBhcmUgY29tcGxldGVseSBzdXJlIHlvdXIgdG91ciBpcyBkaXNwbGF5aW5nIGNvcnJlY3RseSBvbiBhbGwgc2NyZWVuIHNpemVzIG90aGVyd2lzZSBhIHVzZXIgY2FuIGdldCBzdHVjay5cbiAgICAgKi9cbiAgICBwcmV2ZW50QmFja2Ryb3BGcm9tQWR2YW5jaW5nPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcmllbnRhdGlvbkNvbmZpZ3VyYXRpb24ge1xuICAgIC8qKiBXaGVyZSB0aGUgdG91ciBzdGVwIHdpbGwgYXBwZWFyIG5leHQgdG8gdGhlIHNlbGVjdGVkIGVsZW1lbnQgKi9cbiAgICBvcmllbnRhdGlvbkRpcmVjdGlvbjogT3JpZW50YXRpb247XG4gICAgLyoqIFdoZW4gdGhpcyBvcmllbnRhdGlvbiBjb25maWd1cmF0aW9uIHN0YXJ0cyBpbiBwaXhlbHMgKi9cbiAgICBtYXhpbXVtU2l6ZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE9yaWVudGF0aW9uIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJvdHRvbSA9ICdib3R0b20nO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQm90dG9tTGVmdCA9ICdib3R0b20tbGVmdCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCb3R0b21SaWdodCA9ICdib3R0b20tcmlnaHQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ2VudGVyID0gJ2NlbnRlcic7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMZWZ0ID0gJ2xlZnQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUmlnaHQgPSAncmlnaHQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVG9wID0gJ3RvcCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUb3BMZWZ0ID0gJ3RvcC1sZWZ0JztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRvcFJpZ2h0ID0gJ3RvcC1yaWdodCc7XG59XG5cbmV4cG9ydCBlbnVtIFByb2dyZXNzSW5kaWNhdG9yTG9jYXRpb24ge1xuICAgIEluc2lkZU5leHRCdXR0b24gPSAnaW5zaWRlLW5leHQtYnV0dG9uJyxcbiAgICBUb3BPZlRvdXJCbG9jayA9ICd0b3Atb2YtdG91ci1ibG9jaycsXG4gICAgTm9uZSA9ICdub25lJyxcbn0gIFxuIl19