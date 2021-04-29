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
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { FullUser } from '../../models/user.model';
import axios, { DjangoError, addToArray, removeFromArray } from '../../../shared/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { HasPermission } from '../../models/permission.model';
import { AddPermissionComponent } from '../../components/add-permission/add-permission.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-foreign-profile',
  templateUrl: './foreign-profile.component.html',
})
export class ForeignProfileComponent implements OnInit {
  user: FullUser;
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

  constructor(private coreSB: CoreSandboxService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'] as number;
      axios
        .get(`api/profiles/${this.id}/`)
        .then((response: AxiosResponse<FullUser>) => (this.user = response.data))
        .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));

      axios
        .get(`api/profiles/${this.id}/permissions/`)
        .then((response: AxiosResponse<HasPermission[]>) => (this.permissions = response.data))
        .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
    });
  }

  onSend(values: Object): void { // eslint-disable-line
    void axios
      .patch(`api/profiles/${this.id}/`, values)
      .then((response: AxiosResponse<FullUser>) => {
        this.user = response.data;
        this.coreSB.showSuccessSnackBar('User information saved.');
      })
      .catch((error: AxiosError) => (this.errors = error.response.data)); // eslint-disable-line
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
    void axios
      .delete(`api/has_permission/${id}/`)
      .then(() => {
        this.permissions = removeFromArray(this.permissions, id) as HasPermission[];
      })
      .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
  }

  onAddPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        axios
          .post('api/has_permission/', { permission: result, user_has_permission: this.id })
          .then(
            (response: AxiosResponse<HasPermission>) => (this.permissions = addToArray(this.permissions, response.data) as HasPermission[])
          )
          .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
    });
  }
}
