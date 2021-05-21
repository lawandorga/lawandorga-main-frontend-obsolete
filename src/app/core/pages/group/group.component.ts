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
import { addToArray, DjangoError, removeFromArray } from '../../../shared/services/axios';
import { FullUser } from '../../models/user.model';
import { HasPermission } from '../../models/permission.model';
import { AddPermissionComponent } from '../../components/add-permission/add-permission.component';
import { AddMemberComponent } from '../../components/add-member/add-member.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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

  constructor(private coreSB: CoreSandboxService, private route: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => (this.id = String(params['id'])));

    this.http.get(`api/groups/${this.id}/`).subscribe((response: FullGroup) => (this.group = response));

    this.http.get(`api/groups/${this.id}/members/`).subscribe((response: FullUser[]) => (this.members = response));

    this.http.get(`api/groups/${this.id}/permissions/`).subscribe((response: HasPermission[]) => (this.permissions = response));
  }

  onSend(values: Object): void { // eslint-disable-line
    this.http.patch(`api/groups/${this.id}/`, values).subscribe(
      (response: FullGroup) => {
        this.group = response;
        this.coreSB.showSuccessSnackBar('Group information saved.');
      },
      (error: HttpErrorResponse) => (this.errors = error.error as DjangoError)
    );
  }

  onAddPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        this.http
          .post('api/has_permission/', { permission: result, group_has_permission: this.id })
          .subscribe((response: HasPermission) => (this.permissions = addToArray(this.permissions, response) as HasPermission[]));
    });
  }

  onRemovePermission(id: number): void {
    this.http.delete(`api/has_permission/${id}/`).subscribe(() => {
      this.permissions = removeFromArray(this.permissions, id) as HasPermission[];
    });
  }

  onAddMember(): void {
    const dialogRef = this.dialog.open(AddMemberComponent);

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result)
        this.http
          .post(`api/groups/${this.id}/member/`, { member: result })
          .subscribe((response: FullUser) => (this.members = addToArray(this.members, response) as FullUser[]));
    });
  }

  onRemoveMember(id: number): void {
    this.http.post(`api/groups/${this.id}/remove/`, { member: id }).subscribe(() => {
      this.members = removeFromArray(this.members, id) as FullUser[];
    });
  }
}
