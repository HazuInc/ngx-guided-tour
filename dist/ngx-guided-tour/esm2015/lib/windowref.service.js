/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
/**
 * @return {?}
 */
function getWindow() {
    return window;
}
/**
 * @return {?}
 */
function getMockWindow() {
    return {
        innerWidth: 0,
        innerHeight: 0,
        scrollY: 0,
        scrollX: 0,
        pageYOffset: 0,
        pageXOffset: 0,
        scroll: (/**
         * @return {?}
         */
        () => { }),
        scrollTo: (/**
         * @return {?}
         */
        () => { }),
        addEventListener: (/**
         * @return {?}
         */
        () => { }),
        removeEventListener: (/**
         * @return {?}
         */
        () => { }),
    };
}
export class WindowRefService {
    /**
     * @param {?} platformId
     */
    constructor(platformId) {
        this.isBrowser = false;
        this.isBrowser = isPlatformBrowser(platformId);
    }
    /**
     * @return {?}
     */
    get nativeWindow() {
        if (this.isBrowser) {
            return getWindow();
        }
        else {
            return getMockWindow();
        }
    }
}
WindowRefService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
WindowRefService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    WindowRefService.prototype.isBrowser;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93cmVmLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VpZGVkLXRvdXIvIiwic291cmNlcyI6WyJsaWIvd2luZG93cmVmLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUVwRCxTQUFTLFNBQVM7SUFDZCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDOzs7O0FBRUQsU0FBUyxhQUFhO0lBQ2xCLE9BQU87UUFDSCxVQUFVLEVBQUUsQ0FBQztRQUNiLFdBQVcsRUFBRSxDQUFDO1FBQ2QsT0FBTyxFQUFFLENBQUM7UUFDVixPQUFPLEVBQUUsQ0FBQztRQUNWLFdBQVcsRUFBRSxDQUFDO1FBQ2QsV0FBVyxFQUFFLENBQUM7UUFDZCxNQUFNOzs7UUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUE7UUFDaEIsUUFBUTs7O1FBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO1FBQ2xCLGdCQUFnQjs7O1FBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO1FBQzFCLG1CQUFtQjs7O1FBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBO0tBQ2hDLENBQUE7QUFDTCxDQUFDO0FBR0QsTUFBTSxPQUFPLGdCQUFnQjs7OztJQVd6QixZQUFpQyxVQUFVO1FBVjFCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFXeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7O0lBVkQsSUFBSSxZQUFZO1FBQ1osSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLE9BQU8sU0FBUyxFQUFFLENBQUM7U0FDdEI7YUFBTTtZQUNILE9BQU8sYUFBYSxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDOzs7WUFWSixVQUFVOzs7OzRDQVlNLE1BQU0sU0FBQyxXQUFXOzs7Ozs7O0lBVi9CLHFDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5cbmZ1bmN0aW9uIGdldFdpbmRvdygpOiBhbnkge1xuICAgIHJldHVybiB3aW5kb3c7XG59XG5cbmZ1bmN0aW9uIGdldE1vY2tXaW5kb3coKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbm5lcldpZHRoOiAwLFxuICAgICAgICBpbm5lckhlaWdodDogMCxcbiAgICAgICAgc2Nyb2xsWTogMCxcbiAgICAgICAgc2Nyb2xsWDogMCxcbiAgICAgICAgcGFnZVlPZmZzZXQ6IDAsXG4gICAgICAgIHBhZ2VYT2Zmc2V0OiAwLFxuICAgICAgICBzY3JvbGw6ICgpID0+IHt9LFxuICAgICAgICBzY3JvbGxUbzogKCkgPT4ge30sXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXI6ICgpID0+IHt9LFxuICAgICAgICByZW1vdmVFdmVudExpc3RlbmVyOiAoKSA9PiB7fSxcbiAgICB9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBXaW5kb3dSZWZTZXJ2aWNlIHtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGlzQnJvd3NlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgZ2V0IG5hdGl2ZVdpbmRvdygpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRXaW5kb3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRNb2NrV2luZG93KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkKSB7XG4gICAgICAgIHRoaXMuaXNCcm93c2VyID0gaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCk7XG4gICAgfVxufVxuIl19