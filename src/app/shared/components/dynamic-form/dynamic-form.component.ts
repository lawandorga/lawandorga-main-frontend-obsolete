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

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DynamicField } from '../dynamic-input/dynamic-input.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent {
  @Input() fields: [DynamicField];
  @Input() data: Object; // eslint-disable-line
  @Input() errors: Object; // eslint-disable-line
  @Output() send = new EventEmitter();

  onSubmit(form: NgForm): void {
    this.send.emit(form.value);
  }
}
