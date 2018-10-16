import {
    Component, Input, Output, Renderer2, Inject,
    ViewChild, ElementRef, OnInit, OnDestroy, HostListener, EventEmitter
} from '@angular/core';
import { inputValueToBoolean, isArray, isString } from '../util/helpers';
import { ThyUploaderService } from './uploader';
import { mimeTypeConvert } from './util';

@Component({
    selector: '[thyFileSelect],thy-file-select',
    templateUrl: './file-select.component.html'
})
export class ThyFileSelectComponent implements OnInit, OnDestroy {

    _multiple: boolean;

    acceptType: string;

    @Output() thyOnFileSelect = new EventEmitter();

    @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

    @Input()
    set thyMultiple(value: boolean) {
        this._multiple = inputValueToBoolean(value);
    }

    @Input()
    set thyAcceptType(value: Array<string> | string) {
        this.acceptType = mimeTypeConvert(value);
    }

    @HostListener('click', ['$event'])
    click($event: any) {
        this.fileInput.nativeElement.click();
    }

    constructor(
        private thyUploaderService: ThyUploaderService,
        private elementRef: ElementRef
    ) {

    }

    _isInputTypeFile() {
        const nativeElement = this.elementRef.nativeElement;
        return nativeElement.tagName.toLowerCase() === 'input' && nativeElement.type && nativeElement.type.toLowerCase() === 'file';
    }

    selectFile($event: Event) {
        const files = this.fileInput.nativeElement.files;
        if (files && files.length > 0) {
            this.thyOnFileSelect.emit({
                files: files,
                nativeEvent: $event
            });
            this.fileInput.nativeElement.value = '';
        }
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }
}
