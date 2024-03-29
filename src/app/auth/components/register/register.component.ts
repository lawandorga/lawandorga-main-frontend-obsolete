import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IRlc } from 'src/app/core/models/rlc.model';
import { DynamicField } from 'src/app/shared/components/dynamic-input/dynamic-input.component';
import { AppSandboxService } from '../../../core/services/app-sandbox.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  constructor(private appSB: AppSandboxService, private http: HttpClient) {}

  registerFields: DynamicField[] = [
    {
      label: 'RLC',
      name: 'rlc',
      tag: 'select',
      options: [],
    },
    {
      label: 'E-Mail',
      name: 'email',
      tag: 'input',
      type: 'email',
      required: true,
    },
    {
      label: 'Name',
      name: 'name',
      tag: 'input',
      required: true,
    },
    {
      label: 'Password',
      name: 'password',
      tag: 'input',
      type: 'password',
      required: true,
    },
    {
      label: 'Password Confirm',
      name: 'password_confirm',
      tag: 'input',
      type: 'password',
      required: true,
    },
  ];
  success = false;

  ngOnInit(): void {
    this.http.get('api/rlcs/').subscribe((response: IRlc[]) => (this.registerFields[0].options = response));
  }
}
