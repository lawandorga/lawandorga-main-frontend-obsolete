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
import { MatDialog } from '@angular/material/dialog';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FullGroup } from '../../models/group.model';
import axios, { addToArray, DjangoError, removeFromArray } from '../../../shared/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { FullUser } from '../../models/user.model';
import { HasPermission } from '../../models/permission.model';
import { AddPermissionComponent } from '../../components/add-permission/add-permission.component';
import { AddMemberComponent } from '../../components/add-member/add-member.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
})
export class GroupComponent implements OnInit {
  id: string;
  can_edit = false;
  group: FullGroup;
  errors: DjangoError;
  members: FullUser[];
  permissions: HasPermission[];
  membersDisplayedColumns: string[] = ['member', 'email', 'action'];
  permissionsDisplayedColumns: string[] = ['permission', 'action'];

  fields = [
    {
      label: 'Name',
      type: 'text',
      tag: 'input',
      name: 'name',
      required: true,
    },
    {
      label: 'Description',
      type: 'text',
      tag: 'input',
      name: 'description',
      required: false,
    },
    {
      label: 'Note',
      type: 'text',
      tag: 'input',
      name: 'note',
      required: false,
    },
  ];

  constructor(private coreSB: CoreSandboxService, private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => (this.id = String(params['id'])));

    void axios
      .get(`api/groups/${this.id}/`)
      .then((response: AxiosResponse<FullGroup>) => (this.group = response.data))
      .catch();

    void axios
      .get(`api/groups/${this.id}/members/`)
      .then((response: AxiosResponse<Array<FullUser>>) => (this.members = response.data))
      .catch();

    void axios
      .get(`api/groups/${this.id}/permissions/`)
      .then((response: AxiosResponse<Array<HasPermission>>) => (this.permissions = response.data))
      .catch();
  }

  onSend(values: Object): void { // eslint-disable-line
    void axios
      .patch(`api/groups/${this.id}/`, values)
      .then((response: AxiosResponse<FullGroup>) => {
        this.group = response.data;
        this.coreSB.showSuccessSnackBar('Group information saved.');
      })
      .catch((error: AxiosError) => (this.errors = error.response.data)); // eslint-disable-line
  }

  onAddPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        axios
          .post('api/has_permission/', { permission: result, group_has_permission: this.id })
          .then(
            (response: AxiosResponse<HasPermission>) => (this.permissions = addToArray(this.permissions, response.data) as HasPermission[])
          )
          .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
    });
  }

  onRemovePermission(id: number): void {
    void axios
      .delete(`api/has_permission/${id}/`)
      .then(() => {
        this.permissions = removeFromArray(this.permissions, id) as HasPermission[];
      })
      .catch((error: AxiosError) => console.log(error.response));
  }

  onAddMember(): void {
    const dialogRef = this.dialog.open(AddMemberComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        axios
          .post(`api/groups/${this.id}/member/`, { member: result })
          .then((response: AxiosResponse<FullUser>) => (this.members = addToArray(this.members, response.data) as FullUser[]))
          .catch((error: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(error.response.data.detail));
    });
  }

  onRemoveMember(id: number): void {
    void axios
      .post(`api/groups/${this.id}/remove/`, { member: id })
      .then(() => {
        this.members = removeFromArray(this.members, id) as FullUser[];
      })
      .catch((error: AxiosError) => console.log(error.response));
  }
}
