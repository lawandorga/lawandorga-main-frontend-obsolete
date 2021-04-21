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

import { Component, Input, OnInit } from '@angular/core';
import { DynamicField } from '../dynamic-input/dynamic-input.component';
import { environment } from '../../../../environments/environment';
import axios, { Method } from 'axios';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent {
  @Input() fields: [DynamicField];
  @Input() data: Object;
  @Input() action: string;
  @Input() method: Method;

  onSubmit(form: NgForm): void {
    console.log(form.value);

    const headers = {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'private-key': localStorage.getItem('users_private_key').replace(/(?:\r\n|\r|\n)/g, ''),
    };

    void axios({ method: this.method, url: `${environment.apiUrl}${this.action}`, headers: headers })
      .then((response) => console.log(response))
      .catch();
  }
}
