/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { GuidedTourService } from './guided-tour.service';
import { GuidedTourComponent } from './guided-tour.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowRefService } from './windowref.service';
var GuidedTourModule = /** @class */ (function () {
    function GuidedTourModule() {
    }
    /**
     * @return {?}
     */
    GuidedTourModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: GuidedTourModule,
            providers: [ErrorHandler, GuidedTourService],
        };
    };
    GuidedTourModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [GuidedTourComponent],
                    imports: [CommonModule],
                    providers: [WindowRefService],
                    exports: [GuidedTourComponent],
                    entryComponents: [GuidedTourComponent],
                },] }
    ];
    return GuidedTourModule;
}());
export { GuidedTourModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV2RDtJQUFBO0lBY0EsQ0FBQzs7OztJQU5lLHdCQUFPOzs7SUFBckI7UUFDRSxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixTQUFTLEVBQUUsQ0FBQyxZQUFZLEVBQUUsaUJBQWlCLENBQUM7U0FDN0MsQ0FBQztJQUNKLENBQUM7O2dCQWJGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixTQUFTLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDN0IsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQzlCLGVBQWUsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2lCQUN2Qzs7SUFRRCx1QkFBQztDQUFBLEFBZEQsSUFjQztTQVBZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEd1aWRlZFRvdXJTZXJ2aWNlIH0gZnJvbSAnLi9ndWlkZWQtdG91ci5zZXJ2aWNlJztcbmltcG9ydCB7IEd1aWRlZFRvdXJDb21wb25lbnQgfSBmcm9tICcuL2d1aWRlZC10b3VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOZ01vZHVsZSwgRXJyb3JIYW5kbGVyLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgV2luZG93UmVmU2VydmljZSB9IGZyb20gJy4vd2luZG93cmVmLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtHdWlkZWRUb3VyQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIHByb3ZpZGVyczogW1dpbmRvd1JlZlNlcnZpY2VdLFxuICBleHBvcnRzOiBbR3VpZGVkVG91ckNvbXBvbmVudF0sXG4gIGVudHJ5Q29tcG9uZW50czogW0d1aWRlZFRvdXJDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBHdWlkZWRUb3VyTW9kdWxlIHtcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogR3VpZGVkVG91ck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW0Vycm9ySGFuZGxlciwgR3VpZGVkVG91clNlcnZpY2VdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==