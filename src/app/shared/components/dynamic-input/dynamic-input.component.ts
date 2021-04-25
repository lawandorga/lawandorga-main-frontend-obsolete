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

import { Component, Input, forwardRef, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    console.log(control);
    console.log(form);
    return true;
  }
}

export interface DynamicField {
  label: string;
  tag: string;
  type: string;
  name: string;
  value: string | number;
  required: boolean;
}

@Component({
  selector: 'dynamic-input',
  templateUrl: './dynamic-input.component.html',
})
export class DynamicInputComponent {
  @Input() label: DynamicField['label'];
  @Input() tag: DynamicField['tag'];
  @Input() type: DynamicField['type'];
  @Input() value: DynamicField['value'];
  @Input() name: DynamicField['name'];
  @Input() required: DynamicField['required'];
  @Input() errors: Object;
  @Input() control: FormControl;

  matcher = new MyErrorStateMatcher();

  writeValue(obj: string | number): void {
    if (obj !== undefined) this.value = obj;
  }

  // eslint-disable-next-line
  propagateChange = (_: any): void => {
    // do nothing
  };

  // eslint-disable-next-line
  registerOnChange(fn: any): void {
    // eslint-disable-next-line
    this.propagateChange = fn;
  }

  // eslint-disable-next-line
  registerOnTouched(fn: any): void {
    // do nothing
  }

  onChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.propagateChange(value);
  }
}
