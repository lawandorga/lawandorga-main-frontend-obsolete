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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FullGroup } from '../../models/group.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupMemberComponent } from '../add-group-member/add-group-member.component';
import { PERMISSION_CAN_MANAGE_PERMISSIONS_RLC } from '../../../statics/permissions.statics';
import { RestrictedRlc } from '../../models/rlc.model';
import { Observable, Subscription } from 'rxjs';
import { HasPermission } from '../../models/permission.model';
import { AddHasPermissionForComponent } from '../add-has-permission-for/add-has-permission-for.component';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
})
export class EditGroupComponent implements OnInit, OnDestroy {
  group: FullGroup;
  canEditPermissions = false;

  groupHasPermissions: HasPermission[];
  groupPermissionsLoaded = false;
  memberColumns = ['member', 'remove'];

  getGroupSubscription: Subscription;
  getActualHasPermission: Subscription;

  constructor(private coreSB: CoreSandboxService, public dialog: MatDialog) {}

  ngOnInit() {
    this.coreSB.startLoadingPermissionStatics();

    this.getGroupSubscription = this.coreSB.getGroup().subscribe((group: FullGroup) => {
      if (group) {
        this.group = group;
        if (this.group && this.canEditPermissions && !this.groupPermissionsLoaded) {
          this.coreSB.startLoadingGroupHasPermissions(this.group.id);
          this.groupPermissionsLoaded = true;
        }
      }
    });
    this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_CAN_MANAGE_PERMISSIONS_RLC, (hasPermission) => {
      this.canEditPermissions = hasPermission;
    });

    this.getActualHasPermission = this.coreSB.getActualHasPermissions().subscribe((hasPermissions: HasPermission[]) => {
      this.groupHasPermissions = hasPermissions;
    });
  }

  ngOnDestroy(): void {
    this.coreSB.resetSpecialGroup();
    if (this.getActualHasPermission) this.getActualHasPermission.unsubscribe();
    if (this.getGroupSubscription) this.getGroupSubscription.unsubscribe();
  }

  onAddGroupMemberClick() {
    this.dialog.open(AddGroupMemberComponent);
  }

  onRemoveGroupMemberClick(user_id: string) {
    this.coreSB.removeGroupMember(user_id, this.group.id);
  }

  onAddPermissionsClick(): void {
    if (this.canEditPermissions) this.dialog.open(AddHasPermissionForComponent, { data: this.group });
  }
}
