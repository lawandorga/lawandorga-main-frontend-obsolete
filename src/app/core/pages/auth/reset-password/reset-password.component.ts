import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator, matchValidator } from '../../../../statics/validators.statics';
import { AppSandboxService } from '../../../services/app-sandbox.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  userId: number;
  token: string;

  constructor(private appSB: AppSandboxService, private route: ActivatedRoute) {
    this.resetPasswordForm = new FormGroup(
      {
        new_password: new FormControl('', [Validators.required, passwordValidator]),
        new_password_confirm: new FormControl('', [Validators.required]),
      },
      matchValidator('new_password', 'new_password_confirm')
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userid'];
      this.token = params['token'];
    });
  }

  onSendClick() {
    if (this.resetPasswordForm.valid) {
      const new_pw = this.resetPasswordForm.controls['new_password'].value;
      this.appSB.resetPassword(new_pw, this.userId, this.token);
    }
  }
}
