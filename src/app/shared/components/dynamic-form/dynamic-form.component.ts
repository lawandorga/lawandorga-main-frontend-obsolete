import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DynamicField } from '../dynamic-input/dynamic-input.component';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: DynamicField[];
  @Input() data: Object; // eslint-disable-line
  @Input() errors: Object; // eslint-disable-line
  @Input() button = 'Save';
  @Input() processing = false;
  @Output() send = new EventEmitter();
  form: FormGroup;
  controls: { [key: string]: FormControl } = {};

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

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
      // for debug
      // Object.keys(this.controls).forEach((key) => this.controls[key].setErrors({ incorrect: true }));
      // end debug
      Object.keys(changes.errors.currentValue).forEach((key) => {
        if (key in this.controls) this.controls[key].setErrors({ incorrect: true });
      });
    }
  }

  onSubmit(): void {
    this.errors = null;
    this.send.emit(this.form.value);
  }
}
