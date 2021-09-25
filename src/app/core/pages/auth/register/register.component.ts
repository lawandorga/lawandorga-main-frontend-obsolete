import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Rlc } from 'src/app/core/models/rlc.model';
import { DynamicField } from 'src/app/shared/components/dynamic-input/dynamic-input.component';
import { CoreSandboxService } from '../../../services/core-sandbox.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  constructor(private coreSB: CoreSandboxService, private http: HttpClient) {}

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
    {
      label: 'Phone',
      name: 'phone',
      tag: 'input',
      type: 'tel',
    },
  ];
  success = false;

  ngOnInit(): void {
    this.http.get('api/rlcs/').subscribe((response: Rlc[]) => (this.registerFields[0].options = response));
  }
}
