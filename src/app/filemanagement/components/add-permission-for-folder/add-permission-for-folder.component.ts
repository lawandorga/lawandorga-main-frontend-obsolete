import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FullGroup } from '../../../core/models/group.model';
import { HttpClient } from '@angular/common/http';
import { Permission } from 'src/app/core/models/permission.model';

@Component({
  selector: 'app-add-permission-for-folder',
  templateUrl: './add-permission-for-folder.component.html',
})
export class AddPermissionForFolderComponent implements OnInit {
  permissions: Permission[];
  groups: FullGroup[];
  selectedPermission: number;
  selectedGroup: number;

  constructor(public dialogRef: MatDialogRef<AddPermissionForFolderComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`api/files/folder_permission/`).subscribe((response: Permission[]) => (this.permissions = response));
    this.http.get(`api/groups/`).subscribe((response: FullGroup[]) => (this.groups = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
