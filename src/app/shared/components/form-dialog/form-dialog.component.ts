import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubmitData } from '../../services/axios';
import { DynamicField } from '../dynamic-input/dynamic-input.component';

@Component({
  selector: 'form-dialog',
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; submit: string; fields: DynamicField[]; data: SubmitData }
  ) {}

  onSend(data: SubmitData): void {
    this.dialogRef.close(data);
  }
}
