/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DynamicField } from '../dynamic-input/dynamic-input.component';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() fields: [DynamicField];
  @Input() data: Object; // eslint-disable-line
  @Input() errors: Object; // eslint-disable-line
  @Output() send = new EventEmitter();
  form: FormGroup;
  controls: { [key: string]: FormControl } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fields.forEach((field) => {
      this.controls[field.name] = new FormControl();
    });
    this.form = this.fb.group(this.controls);
    if (this.data) this.form.patchValue(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) this.form.patchValue(changes.data.currentValue);
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
