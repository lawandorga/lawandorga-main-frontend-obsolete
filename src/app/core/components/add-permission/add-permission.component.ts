import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'add-permission',
  templateUrl: 'add-permission.component.html',
})
export class AddPermissionComponent implements OnInit {
  permissions: Permission[];
  selectedPermission: number;

  constructor(public dialogRef: MatDialogRef<AddPermissionComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`api/permissions/`).subscribe((response: Permission[]) => (this.permissions = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
