import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DynamicField } from '../dynamic-input/dynamic-input.component';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DjangoError, SubmitData } from '../../services/axios';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: DynamicField[];
  @Input() url: string;
  @Input() data: Object; // eslint-disable-line
  @Input() errors: Object; // eslint-disable-line
  @Input() button = 'Save';
  @Input() processing = false;
  @Input() success = 'Saved';
  @Output() send = new EventEmitter();
  @Output() successful = new EventEmitter();
  form: FormGroup;
  controls: { [key: string]: FormControl } = {};
  successText: string;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.fields.forEach((field) => {
      this.controls[field.name] = new FormControl();
    });
    this.form = this.fb.group(this.controls);
    if (this.data) this.form.patchValue(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue && this.form) this.form.patchValue(changes.data.currentValue);
    if (changes.errors && changes.errors.currentValue) {
      Object.keys(changes.errors.currentValue).forEach((key) => {
        if (key in this.controls) this.controls[key].setErrors({ incorrect: true });
      });
    }
  }

  onSubmit(): void {
    this.successText = null;
    this.errors = null;
    this.send.emit(this.form.value);
    if (this.url) {
      this.processing = true;
      this.http
        .request(this.data ? 'PATCH' : 'POST', this.url, { body: this.form.value as SubmitData })
        .subscribe({
          next: () => {
            this.successText = this.success;
            setTimeout(() => (this.successText = null), 2000);
            this.successful.emit();
          },
          error: (error: HttpErrorResponse) => {
            this.errors = error.error as DjangoError;
          },
        })
        .add(() => (this.processing = false));
    }
  }
}
