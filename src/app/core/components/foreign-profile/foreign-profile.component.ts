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
import { ActivatedRoute, Params } from '@angular/router';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { IUser } from '../../models/user.model';
import { DjangoError, addToArray, removeFromArray } from '../../../shared/services/axios';
import { HasPermission } from '../../models/permission.model';
import { AddPermissionComponent } from '../../components/add-permission/add-permission.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-foreign-profile',
  templateUrl: './foreign-profile.component.html',
})
export class ForeignProfileComponent implements OnInit {
  user: IUser;
  id: number;
  permissions: HasPermission[];
  permissionsDisplayedColumns: string[] = ['permission', 'source', 'action'];
  errors: DjangoError;
  fields = [
    {
      label: 'Name',
      type: 'text',
      tag: 'input',
      name: 'name',
      required: true,
    },
    {
      label: 'Phone',
      type: 'tel',
      tag: 'input',
      name: 'phone_number',
      required: false,
    },
    {
      label: 'Street',
      type: 'text',
      tag: 'input',
      name: 'street',
      required: false,
    },
    {
      label: 'City',
      type: 'text',
      tag: 'input',
      name: 'city',
      required: false,
    },
    {
      label: 'Postal Code',
      type: 'text',
      tag: 'input',
      name: 'postal_code',
      required: false,
    },
  ];

  constructor(private appSB: AppSandboxService, private route: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] as number;
      this.http.get(`api/profiles/${this.id}/`).subscribe((response: IUser) => (this.user = response));

      this.http.get(`api/profiles/${this.id}/permissions/`).subscribe((response: HasPermission[]) => (this.permissions = response));
    });
  }

  onSend(values: Object): void { // eslint-disable-line
    void this.http.patch(`api/profiles/${this.id}/`, values).subscribe(
      (response: IUser) => {
        this.user = response;
        this.appSB.showSuccessSnackBar('User information saved.');
      },
      (error: HttpErrorResponse) => (this.errors = error.error as DjangoError)
    );
  }

  getPermissionSource(permission: HasPermission): string {
    if (permission.user_has_permission) {
      return `User: ${permission.user_has_permission.name}`;
    } else if (permission.group_has_permission) {
      return `Group: ${permission.group_has_permission.name}`;
    } else if (permission.rlc_has_permission) {
      return `RLC: ${permission.rlc_has_permission.name}`;
    }
    return 'Unknown - Please send an email to it@law-orga.de - This is weird';
  }

  onRemovePermission(id: number): void {
    void this.http.delete(`api/has_permission/${id}/`).subscribe(() => {
      this.permissions = removeFromArray(this.permissions, id) as HasPermission[];
    });
  }

  onAddPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        this.http
          .post('api/has_permission/', { permission: result, user_has_permission: this.id })
          .subscribe((response: HasPermission) => (this.permissions = addToArray(this.permissions, response) as HasPermission[]));
    });
  }
}
