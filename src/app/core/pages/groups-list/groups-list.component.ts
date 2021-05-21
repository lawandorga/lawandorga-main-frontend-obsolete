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
import { RestrictedGroup } from '../../models/group.model';
import { Router } from '@angular/router';
import { GetGroupFrontUrl } from '../../../statics/frontend_links.statics';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { addToArray, removeFromArray } from '../../../shared/services/axios';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './groups-list.component.html',
})
export class GroupsListComponent implements OnInit {
  groups: RestrictedGroup[];
  groupsDisplayedColumns = ['group', 'description', 'action'];

  constructor(
    private coreSB: CoreSandboxService,
    private router: Router,
    public dialog: MatDialog,
    private sharedSB: SharedSandboxService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get('api/groups/').subscribe((response: RestrictedGroup[]) => (this.groups = response));
  }

  onOpenGroup(id: number): void {
    void this.router.navigate([GetGroupFrontUrl(String(id))]);
  }

  onAddGroup(): void {
    const dialogRef = this.dialog.open(AddGroupComponent);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result)
        this.http
          .post(`api/groups/`, { name: result })
          .subscribe((response: RestrictedGroup) => (this.groups = addToArray(this.groups, response) as RestrictedGroup[]));
    });
  }

  groupDetailUrl(id: number): string {
    return `/groups/${id}/`;
  }

  onDeleteGroup(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this group?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(`api/groups/${id}/`).subscribe(() => (this.groups = removeFromArray(this.groups, id) as RestrictedGroup[]));
        }
      }
    );
  }
}
