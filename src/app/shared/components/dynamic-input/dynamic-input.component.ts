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

import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true,
    },
  ],
})
export class DynamicInputComponent implements ControlValueAccessor {
  @Input() label: DynamicField['label'];
  @Input() tag: DynamicField['tag'];
  @Input() type: DynamicField['type'];
  @Input() value: DynamicField['value'];
  @Input() name: DynamicField['name'];
  @Input() required: DynamicField['required'];

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
