import { NgModule, Component, DebugElement } from '@angular/core';
import { ThyProgressModule } from '../progress.module';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThyProgressComponent } from '../progress.component';
import { ThyProgressBarComponent } from '../bar/progress-bar.component';
import { ThyProgressTypes, ThyStackedValue } from '../interfaces';
import { hexToRgb } from '../../util/helpers';

const PROGRESS_CLASS_NAME = 'progress';
const PROGRESS_BAR_CLASS_NAME = 'progress-bar';

@Component({
    selector: 'thy-demo-progress-basic',
    template: `
        <thy-progress [thyValue]="value" [thyType]="type" [thySize]="size">
            20%
        </thy-progress>
    `
})
class ThyDemoProgressBasicComponent {
    value = 20;
    type: ThyProgressTypes;
    size: string;
}

@Component({
    selector: 'thy-demo-progress-stacked',
    template: `
        <thy-progress [thyValue]="value" [thySize]="size"> </thy-progress>
    `
})
class ThyDemoProgressStackedComponent {
    value: ThyStackedValue[] = [
        {
            type: 'success',
            value: 40
        },
        {
            type: 'danger',
            value: 60
        },
        {
            type: 'warning',
            value: 100
        }
    ];
    size: string;
}

@NgModule({
    imports: [ThyProgressModule],
    declarations: [ThyDemoProgressBasicComponent, ThyDemoProgressStackedComponent],
    exports: [ThyDemoProgressBasicComponent]
})
export class ProgressTestModule {}

describe(`ThyProgressComponent`, () => {
    describe(`basic`, () => {
        let fixture: ComponentFixture<ThyDemoProgressBasicComponent>;
        let basicTestComponent: ThyDemoProgressBasicComponent;
        let progressComponent: DebugElement;
        let progressBarComponent: DebugElement;
        let progressElement: HTMLElement;
        let progressBarElement: HTMLElement;
        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule],
                providers: [
                    // { provide: Location, useClass: SpyLocation }
                ]
            });

            TestBed.compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressBasicComponent);
            basicTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
        });

        function assertProgressAndBarComponentClass(styleWidth: string = '20%') {
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            const barElement = progressBarComponent.nativeElement;
            expect(barElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            expect(barElement.style.width).toEqual(styleWidth);
        }

        it('should be created progress component', () => {
            expect(progressComponent).toBeTruthy();
        });

        it('should be correct class by default type', () => {
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            assertProgressAndBarComponentClass();
        });

        it('should be correct class when input type is success or warning', () => {
            basicTestComponent.type = 'success';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            assertProgressAndBarComponentClass();
            expect(
                progressBarComponent.nativeElement.classList.contains(`progress-bar-${basicTestComponent.type}`)
            ).toBe(true);
            expect(progressBarComponent.nativeElement.classList.contains(`bg-${basicTestComponent.type}`)).toBe(true);

            basicTestComponent.type = 'warning';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            assertProgressAndBarComponentClass();
            expect(progressBarElement.classList.contains(`progress-bar-${basicTestComponent.type}`)).toBe(true);
            expect(progressBarElement.classList.contains(`bg-${basicTestComponent.type}`)).toBe(true);
        });

        it('should be correct class when input size is sm', () => {
            basicTestComponent.size = 'sm';
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            assertProgressAndBarComponentClass();
            expect(progressElement.classList.contains('progress-sm')).toBe(true);
        });

        it('should be correct percent with dynamically changed values', () => {
            fixture.detectChanges();
            progressBarComponent = fixture.debugElement.query(By.directive(ThyProgressBarComponent));
            progressBarElement = progressBarComponent.nativeElement;
            assertProgressAndBarComponentClass();

            basicTestComponent.value = 30;
            fixture.detectChanges();
            expect(progressBarElement.style.width).toEqual('30%');
        });
    });

    describe(`stacked`, () => {
        let fixture: ComponentFixture<ThyDemoProgressStackedComponent>;
        let stackedTestComponent: ThyDemoProgressStackedComponent;
        let progressComponent: DebugElement;
        let progressBarComponents: DebugElement[];
        let progressElement: HTMLElement;
        let progressBarElements: HTMLElement[];

        beforeEach(fakeAsync(() => {
            TestBed.configureTestingModule({
                imports: [ThyProgressModule, ProgressTestModule],
                providers: [
                    // { provide: Location, useClass: SpyLocation }
                ]
            });

            TestBed.compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ThyDemoProgressStackedComponent);
            stackedTestComponent = fixture.debugElement.componentInstance;
            progressComponent = fixture.debugElement.query(By.directive(ThyProgressComponent));
            progressElement = progressComponent.nativeElement;
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
        });

        it('should be created progress component', () => {
            expect(progressComponent).toBeTruthy();
        });

        it('should be correct class by stacked value', () => {
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(3);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });
            expect(progressBarElements[0].style.width).toEqual('20%');
            expect(progressBarElements[1].style.width).toEqual('30%');
            expect(progressBarElements[2].style.width).toEqual('50%');
        });

        it('should be correct color by custom stacked value with color', () => {
            stackedTestComponent.value = [
                {
                    value: 20,
                    color: '#4e8af9'
                },
                {
                    value: 40,
                    color: '#66c060'
                },
                {
                    value: 80,
                    color: '#ffd234'
                }
            ];
            fixture.detectChanges();
            progressBarComponents = fixture.debugElement.queryAll(By.directive(ThyProgressBarComponent));
            progressBarElements = progressBarComponents.map(item => item.nativeElement);
            expect(progressElement.classList.contains(PROGRESS_CLASS_NAME)).toBe(true);

            expect(progressBarElements.length).toBe(3);
            progressBarElements.forEach(progressBarElement => {
                expect(progressBarElement.classList.contains(PROGRESS_BAR_CLASS_NAME)).toBe(true);
            });

            expect(progressBarElements[0].style.width).toEqual('14.29%');
            expect(progressBarElements[1].style.width).toEqual('28.57%');
            expect(progressBarElements[2].style.width).toEqual('57.14%');

            expect(progressBarElements[0].style['background-color']).toEqual(hexToRgb('#4e8af9'));
            expect(progressBarElements[1].style['background-color']).toEqual(hexToRgb('#66c060'));
            expect(progressBarElements[2].style['background-color']).toEqual(hexToRgb('#ffd234'));
        });
    });
});
