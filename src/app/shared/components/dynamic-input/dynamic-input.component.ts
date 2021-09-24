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
  name: string;
  tag: string;
  type?: string;
  value?: string | number;
  required?: boolean;
  options?: Array<{ id: number; name: string }>;
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
  @Input() options: DynamicField['options'];
  @Input() errors: DjangoError;
  @Input() control: FormControl;

  matcher = new MyErrorStateMatcher();
}
