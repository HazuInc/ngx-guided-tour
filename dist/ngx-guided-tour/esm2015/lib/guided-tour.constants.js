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
export class Orientation {
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
const ProgressIndicatorLocation = {
    InsideNextButton: 'inside-next-button',
    TopOfTourBlock: 'top-of-tour-block',
    None: 'none',
};
export { ProgressIndicatorLocation };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0EsOEJBcUJDOzs7Ozs7SUFuQkcsNEJBQWtCOzs7OztJQUVsQix5QkFBZTs7Ozs7SUFFZiwyQkFBZ0I7Ozs7O0lBRWhCLCtCQUF1RDs7Ozs7SUFFdkQsMEJBQW9COzs7OztJQUVwQiwrQkFBeUI7Ozs7O0lBRXpCLDRCQUFtQjs7Ozs7SUFFbkIsb0NBQTBCOzs7OztJQUUxQix1Q0FBOEI7Ozs7O0lBRTlCLG9DQUEwQjs7Ozs7QUFHOUIsZ0NBeUJDOzs7Ozs7SUF2QkcsNEJBQWU7Ozs7O0lBRWYsNEJBQWlCOzs7OztJQUVqQiwyQkFBa0I7Ozs7O0lBRWxCLGtDQUErQzs7Ozs7SUFFL0Msc0NBQThCOzs7OztJQUU5Qix1Q0FBMkI7Ozs7O0lBRTNCLGtDQUtDOzs7Ozs7SUFLRCxrREFBdUM7Ozs7O0FBRzNDLDhDQUtDOzs7Ozs7SUFIRyx3REFBa0M7Ozs7O0lBRWxDLCtDQUFxQjs7QUFHekIsTUFBTSxPQUFPLFdBQVc7O0FBQ0csa0JBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsc0JBQVUsR0FBRyxhQUFhLENBQUM7QUFDM0IsdUJBQVcsR0FBRyxjQUFjLENBQUM7QUFDN0Isa0JBQU0sR0FBRyxRQUFRLENBQUM7QUFDbEIsZ0JBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxpQkFBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixlQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osbUJBQU8sR0FBRyxVQUFVLENBQUM7QUFDckIsb0JBQVEsR0FBRyxXQUFXLENBQUM7OztJQVI5QyxtQkFBeUM7O0lBQ3pDLHVCQUFrRDs7SUFDbEQsd0JBQW9EOztJQUNwRCxtQkFBeUM7O0lBQ3pDLGlCQUFxQzs7SUFDckMsa0JBQXVDOztJQUN2QyxnQkFBbUM7O0lBQ25DLG9CQUE0Qzs7SUFDNUMscUJBQThDOzs7O0lBSTlDLGtCQUFtQixvQkFBb0I7SUFDdkMsZ0JBQWlCLG1CQUFtQjtJQUNwQyxNQUFPLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBpbnRlcmZhY2UgVG91clN0ZXAge1xuICAgIC8qKiBTZWxlY3RvciBmb3IgZWxlbWVudCB0aGF0IHdpbGwgYmUgaGlnaGxpZ2h0ZWQgKi9cbiAgICBzZWxlY3Rvcj86IHN0cmluZztcbiAgICAvKiogVG91ciB0aXRsZSB0ZXh0ICovXG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgLyoqIFRvdXIgc3RlcCB0ZXh0ICovXG4gICAgY29udGVudDogc3RyaW5nO1xuICAgIC8qKiBXaGVyZSB0aGUgdG91ciBzdGVwIHdpbGwgYXBwZWFyIG5leHQgdG8gdGhlIHNlbGVjdGVkIGVsZW1lbnQgKi9cbiAgICBvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uIHwgT3JpZW50YXRpb25Db25maWd1cmF0aW9uW107XG4gICAgLyoqIEFjdGlvbiB0aGF0IGhhcHBlbnMgd2hlbiB0aGUgc3RlcCBpcyBvcGVuZWQgKi9cbiAgICBhY3Rpb24/OiAoKSA9PiB2b2lkO1xuICAgIC8qKiBBY3Rpb24gdGhhdCBoYXBwZW5zIHdoZW4gdGhlIHN0ZXAgaXMgY2xvc2VkICovXG4gICAgY2xvc2VBY3Rpb24/OiAoKSA9PiB2b2lkO1xuICAgIC8qKiBTa2lwcyB0aGlzIHN0ZXAsIHRoaXMgaXMgc28geW91IGRvIG5vdCBoYXZlIGNyZWF0ZSBtdWx0aXBsZSB0b3VyIGNvbmZpZ3VyYXRpb25zIGJhc2VkIG9uIHVzZXIgc2V0dGluZ3MvY29uZmlndXJhdGlvbiAqL1xuICAgIHNraXBTdGVwPzogYm9vbGVhbjtcbiAgICAvKiogQWRkcyBzb21lIHBhZGRpbmcgZm9yIHRoaW5ncyBsaWtlIHN0aWNreSBoZWFkZXJzIHdoZW4gc2Nyb2xsaW5nIHRvIGFuIGVsZW1lbnQgKi9cbiAgICBzY3JvbGxBZGp1c3RtZW50PzogbnVtYmVyO1xuICAgIC8qKiBBZGRzIGRlZmF1bHQgcGFkZGluZyBhcm91bmQgdG91ciBoaWdobGlnaHRpbmcuIERvZXMgbm90IG5lZWQgdG8gYmUgdHJ1ZSBmb3IgaGlnaGxpZ2h0UGFkZGluZyB0byB3b3JrICovXG4gICAgdXNlSGlnaGxpZ2h0UGFkZGluZz86IGJvb2xlYW47XG4gICAgLyoqIEFkZHMgcGFkZGluZyBhcm91bmQgdG91ciBoaWdobGlnaHRpbmcgaW4gcGl4ZWxzLCB0aGlzIG92ZXJ3cml0ZXMgdGhlIGRlZmF1bHQgZm9yIHRoaXMgc3RlcC4gSXMgbm90IGRlcGVuZGVudCBvbiB1c2VIaWdobGlnaHRQYWRkaW5nIGJlaW5nIHRydWUgKi9cbiAgICBoaWdobGlnaHRQYWRkaW5nPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEd1aWRlZFRvdXIge1xuICAgIC8qKiBJZGVudGlmaWVyIGZvciB0b3VyICovXG4gICAgdG91cklkOiBzdHJpbmc7XG4gICAgLyoqIFVzZSBvcmIgdG8gc3RhcnQgdG91ciAqL1xuICAgIHVzZU9yYj86IGJvb2xlYW47XG4gICAgLyoqIFN0ZXBzIGZvIHRoZSB0b3VyICovXG4gICAgc3RlcHM6IFRvdXJTdGVwW107XG4gICAgLyoqIEZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdG91ciBpcyBza2lwcGVkICovXG4gICAgc2tpcENhbGxiYWNrPzogKHN0ZXBTa2lwcGVkT246IG51bWJlcikgPT4gdm9pZDtcbiAgICAvKiogRnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0b3VyIGlzIGNvbXBsZXRlZCAqL1xuICAgIGNvbXBsZXRlQ2FsbGJhY2s/OiAoKSA9PiB2b2lkO1xuICAgIC8qKiBNaW5pbXVtIHNpemUgb2Ygc2NyZWVuIGluIHBpeGVscyBiZWZvcmUgdGhlIHRvdXIgaXMgcnVuLCBpZiB0aGUgdG91ciBpcyByZXNpemVkIGJlbG93IHRoaXMgdmFsdWUgdGhlIHVzZXIgd2lsbCBiZSB0b2xkIHRvIHJlc2l6ZSAqL1xuICAgIG1pbmltdW1TY3JlZW5TaXplPzogbnVtYmVyO1xuICAgIC8qKiBEaWFsb2cgc2hvd24gaWYgdGhlIHdpbmRvdyB3aWR0aCBpcyBzbWFsbGVyIHRoYW4gdGhlIGRlZmluZWQgbWluaW11bSBzY3JlZW4gc2l6ZS4gKi9cbiAgICByZXNpemVEaWFsb2c/OiB7XG4gICAgICAgIC8qKiBSZXNpemUgZGlhbG9nIHRpdGxlIHRleHQgKi9cbiAgICAgICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgICAgIC8qKiBSZXNpemUgZGlhbG9nIHRleHQgKi9cbiAgICAgICAgY29udGVudDogc3RyaW5nO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmV2ZW50cyB0aGUgdG91ciBmcm9tIGFkdmFuY2luZyBieSBjbGlja2luZyB0aGUgYmFja2Ryb3AuXG4gICAgICogVGhpcyBzaG91bGQgb25seSBiZSBzZXQgaWYgeW91IGFyZSBjb21wbGV0ZWx5IHN1cmUgeW91ciB0b3VyIGlzIGRpc3BsYXlpbmcgY29ycmVjdGx5IG9uIGFsbCBzY3JlZW4gc2l6ZXMgb3RoZXJ3aXNlIGEgdXNlciBjYW4gZ2V0IHN0dWNrLlxuICAgICAqL1xuICAgIHByZXZlbnRCYWNrZHJvcEZyb21BZHZhbmNpbmc/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yaWVudGF0aW9uQ29uZmlndXJhdGlvbiB7XG4gICAgLyoqIFdoZXJlIHRoZSB0b3VyIHN0ZXAgd2lsbCBhcHBlYXIgbmV4dCB0byB0aGUgc2VsZWN0ZWQgZWxlbWVudCAqL1xuICAgIG9yaWVudGF0aW9uRGlyZWN0aW9uOiBPcmllbnRhdGlvbjtcbiAgICAvKiogV2hlbiB0aGlzIG9yaWVudGF0aW9uIGNvbmZpZ3VyYXRpb24gc3RhcnRzIGluIHBpeGVscyAqL1xuICAgIG1heGltdW1TaXplPzogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgT3JpZW50YXRpb24ge1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQm90dG9tID0gJ2JvdHRvbSc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBCb3R0b21MZWZ0ID0gJ2JvdHRvbS1sZWZ0JztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJvdHRvbVJpZ2h0ID0gJ2JvdHRvbS1yaWdodCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDZW50ZXIgPSAnY2VudGVyJztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExlZnQgPSAnbGVmdCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSaWdodCA9ICdyaWdodCc7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUb3AgPSAndG9wJztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRvcExlZnQgPSAndG9wLWxlZnQnO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVG9wUmlnaHQgPSAndG9wLXJpZ2h0Jztcbn1cblxuZXhwb3J0IGVudW0gUHJvZ3Jlc3NJbmRpY2F0b3JMb2NhdGlvbiB7XG4gICAgSW5zaWRlTmV4dEJ1dHRvbiA9ICdpbnNpZGUtbmV4dC1idXR0b24nLFxuICAgIFRvcE9mVG91ckJsb2NrID0gJ3RvcC1vZi10b3VyLWJsb2NrJyxcbiAgICBOb25lID0gJ25vbmUnLFxufSAgXG4iXX0=