/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { GuidedTourService } from './guided-tour.service';
import { GuidedTourComponent } from './guided-tour.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowRefService } from './windowref.service';
export class GuidedTourModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: GuidedTourModule,
            providers: [ErrorHandler, GuidedTourService],
        };
    }
}
GuidedTourModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GuidedTourComponent],
                imports: [CommonModule],
                providers: [WindowRefService],
                exports: [GuidedTourComponent],
                entryComponents: [GuidedTourComponent],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpZGVkLXRvdXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWd1aWRlZC10b3VyLyIsInNvdXJjZXMiOlsibGliL2d1aWRlZC10b3VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzVFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQVN2RCxNQUFNLE9BQU8sZ0JBQWdCOzs7O0lBQ3BCLE1BQU0sQ0FBQyxPQUFPO1FBQ25CLE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFNBQVMsRUFBRSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQztTQUM3QyxDQUFDO0lBQ0osQ0FBQzs7O1lBYkYsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDOUIsZUFBZSxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDdkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHdWlkZWRUb3VyU2VydmljZSB9IGZyb20gJy4vZ3VpZGVkLXRvdXIuc2VydmljZSc7XG5pbXBvcnQgeyBHdWlkZWRUb3VyQ29tcG9uZW50IH0gZnJvbSAnLi9ndWlkZWQtdG91ci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIEVycm9ySGFuZGxlciwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IFdpbmRvd1JlZlNlcnZpY2UgfSBmcm9tICcuL3dpbmRvd3JlZi5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbR3VpZGVkVG91ckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBwcm92aWRlcnM6IFtXaW5kb3dSZWZTZXJ2aWNlXSxcbiAgZXhwb3J0czogW0d1aWRlZFRvdXJDb21wb25lbnRdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtHdWlkZWRUb3VyQ29tcG9uZW50XSxcbn0pXG5leHBvcnQgY2xhc3MgR3VpZGVkVG91ck1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEd1aWRlZFRvdXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtFcnJvckhhbmRsZXIsIEd1aWRlZFRvdXJTZXJ2aWNlXSxcbiAgICB9O1xuICB9XG59XG4iXX0=