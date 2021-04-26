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
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PERMISSION_CAN_MANAGE_GROUP, PERMISSION_CAN_MANAGE_GROUPS_RLC } from '../../../statics/permissions.statics';
import { FullGroup } from '../../models/group.model';
import axios, { DjangoError } from '../../../shared/services/axios';
import { AxiosResponse } from 'axios';
import { FullUser } from '../../models/user.model';
import { HasPermission } from '../../models/permission.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
})
export class GroupComponent implements OnInit {
  id: string;
  can_edit = false;
  group: FullGroup;
  errors: DjangoError;
  members: Array<FullUser>;
  permissions: Array<HasPermission>;
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

  constructor(private coreSB: CoreSandboxService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = String(params['id']);
      this.coreSB.startLoadingSpecialGroup(this.id);
    });

    this.coreSB.getGroup().subscribe((group: FullGroup) => {
      this.coreSB.hasPermissionFromString(
        PERMISSION_CAN_MANAGE_GROUP,
        (hasPermission) => {
          if (hasPermission) {
            this.can_edit = true;
          }
        },
        {
          for_group: this.id,
        }
      );

      this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_CAN_MANAGE_GROUPS_RLC, (permission) => {
        if (permission) {
          this.can_edit = true;
        }
      });
    });

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
      .then((response: AxiosResponse<FullGroup>) => (this.group = response.data))
      .catch((error) => (this.errors = error.response.data)); // eslint-disable-line
  }
}
