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

import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DjangoError } from '../../services/axios';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(): boolean {
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
  options: Array<{ id: number; name: string }>;
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
  @Input() errors: DjangoError;
  @Input() control: FormControl;
  @Input() options: DynamicField['options'];

  matcher = new MyErrorStateMatcher();
}
