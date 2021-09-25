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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreSandboxService } from '../../../services/core-sandbox.service';
import { Rlc } from '../../../models/rlc.model';
import { dateInPastValidator, matchValidator, passwordValidator } from '../../../../statics/validators.statics';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  // TODO: refactor this
  userForm: FormGroup;
  allRlcs: Rlc[] = [];

  constructor(private coreSB: CoreSandboxService) {}

  ngOnInit() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    this.userForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', Validators.required),
        password: new FormControl('', [Validators.required, passwordValidator]),
        password_confirm: new FormControl('', [Validators.required]),
        phone_number: new FormControl(''),
        street: new FormControl(''),
        postal_code: new FormControl(''),
        city: new FormControl(''),
        birthday: new FormControl(date, [dateInPastValidator]),
        rlc: new FormControl('', [Validators.required]),
      },
      matchValidator('password', 'password_confirm')
    );
  }

  onRegisterClick() {
    // nada
  }
}
