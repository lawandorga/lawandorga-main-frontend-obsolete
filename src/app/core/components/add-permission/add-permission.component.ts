import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Permission } from '../../models/permission.model';
import axios from '../../../shared/services/axios';
import { AxiosResponse } from 'axios';

@Component({
  selector: 'add-permission',
  templateUrl: 'add-permission.component.html',
})
export class AddPermissionComponent implements OnInit {
  permissions: Permission[];
  selectedPermission: number;

  constructor(public dialogRef: MatDialogRef<AddPermissionComponent>) {}

  ngOnInit(): void {
    void axios
      .get(`api/permissions/`)
      .then((response: AxiosResponse<Permission[]>) => (this.permissions = response.data))
      .catch();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
