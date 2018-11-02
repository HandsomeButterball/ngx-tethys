// import {
//     Directive, OnInit, ElementRef, Renderer2, ViewContainerRef,
//     Input, ComponentRef, Output, EventEmitter, forwardRef, OnChanges, AfterContentInit
// } from '@angular/core';
// import { ComponentLoaderFactory, ComponentLoader } from 'ngx-bootstrap/component-loader';
// import { DatePipe, registerLocaleData } from '@angular/common';
// import localeZhHans from '@angular/common/locales/zh-Hans';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { isObject, isNumber, isDate, inputValueToBoolean } from '../util/helpers';
// import { ThyPositioningService, PlacementTypes } from '../positioning/positioning.service';


// registerLocaleData(localeZhHans, 'zh-Hans');

// const FORMAT_RULES = {
//     default: 'yyyy-MM-dd',
//     short: 'yyyy-MM-dd',
//     full: 'yyyy-MM-dd HH:mm',
// };

// const DATEPICKER_VALUE_ACCESSOR = {
//     provide: NG_VALUE_ACCESSOR,
//     useExisting: forwardRef(() => ThyDatepickerNextDirective),
//     multi: true
// };

// @Directive({
//     selector: '[thyDatepicker]',
//     providers: [DATEPICKER_VALUE_ACCESSOR]
// })
// export class ThyDatepickerNextDirective implements OnInit, AfterContentInit, ControlValueAccessor {
//     dataPipe = new DatePipe('zh-Hans');
//     private _format: string;
//     private _onChange = Function.prototype;
//     private _onTouched = Function.prototype;
//     @Input() thyPlacement: PlacementTypes = PlacementTypes.bottom;
//     @Input() thyAutoAdapt = true;
//     @Input() thyTriggers = 'click';
//     @Input() thyContainer = 'body';
//     @Input() thyOutsideClick = true;
//     @Input() thyDisabled = false;
//     @Input() thyShowTime = false;
//     @Input() thyFormat: string = null;
//     // @Output() thyOnChange: EventEmitter<any> = new EventEmitter();

//     constructor(
//         private _elementRef: ElementRef,
//         private _renderer: Renderer2,
//         _viewContainerRef: ViewContainerRef,
//         cis: ComponentLoaderFactory,
//         private thyPositioningService: ThyPositioningService,

//     ) {
//     }

//     ngOnInit() {
//     }

//     ngAfterContentInit() {
//     }

//     writeValue(value: DatepickerValueEntry | Date | number) {
//         this._initValueDate(value, true);
//         if (this._isAfterContentInit) {
//             this._saveInitValueClone();
//             // this._isFirstInitValueWithNullOnce = true;
//         }
//     }

//     registerOnChange(fn: (value: any) => any): void {
//         this._onChange = fn;
//     }

//     registerOnTouched(fn: () => any): void {
//         this._onTouched = fn;
//     }

//     show() {
//         if (this.thyDisabled) {
//             return;
//         }

//         this.datepickerService.initLocale();

//         const dateContainerRef = this._loader.provide({ provide: ThyDatepickerConfig, useValue: this._config })
//             .attach(ThyDatepickerContainerComponent)
//             .to(this.thyContainer)
//             // .position({ attachment: this.thyPlacement })
//             .show({
//                 hideLoader: () => {
//                     this.hide();
//                 },
//                 initialState: {
//                     withTime: inputValueToBoolean(this.thyShowTime),
//                     value: this._value,
//                     valueRef: this._valueRef,
//                     changeValue: (result: DatepickerValueEntry) => {
//                         // this._isFirstInitValueWithNullOnce = false;
//                         this._initFormatRule(result);
//                         this._setInputProperty(result.date);
//                         this._sendValueToNgModel(result);
//                         this._initValueDate(result);
//                     }
//                 }
//             });
//         this._renderer.addClass(this._elementRef.nativeElement, this._config.openedClass);
//         this.thyPositioningService.setPosition({
//             target: dateContainerRef.location,
//             attach: this._elementRef,
//             placement: this.thyPlacement,
//             autoAdapt: this.thyAutoAdapt,
//             offset: 2,
//             appendToBody: true
//         });
//     }

//     hide() {
//         this._renderer.removeClass(this._elementRef.nativeElement, this._config.openedClass);
//         this._loader.hide();
//     }

//     private _initValueDate(value: DatepickerValueEntry | Date | number | any, isRefreshType?: boolean) {
//         if (isRefreshType) {
//             this._valueType = datepickerUtilIdentificationValueType(value);
//             this._value = datepickerUtilConvertToDatepickerObject(value, this._valueType);
//         } else {
//             this._value = datepickerUtilConvertToDatepickerObject(value);
//         }
//         this._initFormatRule();
//         this._setInputProperty(this._value.date);

//     }

//     private _saveInitValueClone() {
//         if (this._value) {
//             this._valueRef = {
//                 date: this._value.date,
//                 with_time: this._value.with_time
//             };
//         }
//     }

//     private _initFormatRule(value?: DatepickerValueEntry) {
//         if (this.thyFormat) {
//             this._format = this.thyFormat;
//         } else {
//             // if (this._isFirstInitValueWithNullOnce) {
//             //     this._format = '';
//             // } else {
//             const _v = value || this._value;
//             if (_v.with_time) {
//                 this._format = FORMAT_RULES.full;
//             } else {
//                 this._format = FORMAT_RULES.short;
//             }
//             // }
//         }
//     }

//     private _setInputProperty(value: any) {
//         const initialDate = this.dataPipe.transform(value, this._format);
//         this._renderer.setProperty(this._elementRef.nativeElement, 'value', initialDate);
//     }

//     private _sendValueToNgModel(result: any) {
//         switch (this._valueType) {
//             case DatepickerValueShowTypesEnum.datepickerTimeObject:
//                 this._value = {
//                     date: result.date && result.date.getTime() / 1000,
//                     with_time: result.with_time
//                 };
//                 break;
//             case DatepickerValueShowTypesEnum.dateTime:
//                 this._value = result.date && result.date.getTime() / 1000;
//                 break;
//             case DatepickerValueShowTypesEnum.nullValue:
//                 this._value = result.date && result.date.getTime() / 1000;
//                 break;
//             default:
//                 this._value = {
//                     date: result.date && Math.floor(result.date.getTime() / 1000),
//                     with_time: result.with_time
//                 };
//                 break;
//         }
//         this._onChange(this._value);
//     }

// }
