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
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isDevMode } from '@angular/core';
import { AppSandboxService } from '../../../services/app-sandbox.service';
import { FORGOT_PASSWORD_FRONT_URL, MAIN_PAGE_FRONT_URL, REGISTER_FRONT_URL } from '../../../../statics/frontend_links.statics';
import { CoreSandboxService } from '../../../services/core-sandbox.service';
import { Store } from '@ngrx/store';
import { TryLogin } from '../../../store/auth/actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appSB: AppSandboxService,
    private coreSB: CoreSandboxService,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (this.appSB.isAuthenticated()) {
      this.router.navigate([MAIN_PAGE_FRONT_URL]);
    }

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    if (isDevMode()) {
      this.loginForm.controls['email'].setValue('dummy@rlcm.de');
      this.loginForm.controls['password'].setValue('qwe123');
    }

    // if an activation link was used try to activate the user
    // url: activate-user/:id/:token/
    this.route.params.subscribe((params: Params) => {
      const token: string = params['token'];
      const userId: number = params['userid'];
      if (token && userId) this.coreSB.startCheckingUserActivationLink(userId, token);
    });
  }

  onLogInClick(): void {
    this.store.dispatch(TryLogin({ username: this.loginForm.value.email, password: this.loginForm.value.password }));
  }

  onRegisterClick(): void {
    this.router.navigate([REGISTER_FRONT_URL]);
  }

  onForgotPasswordClick(): void {
    this.router.navigate([FORGOT_PASSWORD_FRONT_URL]);
  }
}
