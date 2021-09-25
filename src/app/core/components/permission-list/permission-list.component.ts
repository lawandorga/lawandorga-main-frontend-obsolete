import { Component, OnInit } from '@angular/core';
import { Permission } from '../../models/permission.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
})
export class PermissionListComponent implements OnInit {
  permissions: Permission[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('api/permissions/').subscribe((response: Permission[]) => (this.permissions = response));
  }
}
