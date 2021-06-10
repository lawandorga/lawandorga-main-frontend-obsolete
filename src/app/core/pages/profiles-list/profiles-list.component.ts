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
import { FullUser } from '../../models/user.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { GetProfilesDetailApiUrl, GetProfilesUnlockApiUrl, PROFILES_API_URL } from '../../../statics/api_urls.statics';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { removeFromArray } from '../../../shared/services/axios';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
})
export class ProfilesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
  users: FullUser[];

  constructor(private coreSB: CoreSandboxService, private sharedSB: SharedSandboxService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(PROFILES_API_URL).subscribe((response: FullUser[]) => (this.users = response));
  }

  updateUsers(response: FullUser): void {
    const user = response;
    const index = this.users.findIndex((localUser) => localUser.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1, user);
      this.users = [...this.users];
    }
  }

  onUnlockClick(id: number): void {
    this.http.post(GetProfilesUnlockApiUrl(id), {}).subscribe((response: FullUser) => this.updateUsers(response));
  }

  onDeActiveClick(user: FullUser): void {
    this.http
      .patch(GetProfilesDetailApiUrl(parseInt(user.id)), { is_active: !user.is_active })
      .subscribe((response: FullUser) => this.updateUsers(response));
  }

  getUserDetailUrl(id: number): string {
    return `/profiles/${id}/`;
  }

  onDeleteClick(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete User',
        description: 'Are you sure you want to delete this user?',
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(GetProfilesDetailApiUrl(id)).subscribe(() => {
            this.users = removeFromArray(this.users, id) as FullUser[];
          });
        }
      }
    );
  }

  onAcceptClick(id: number): void {
    this.http.get(`api/profiles/${id}/accept/`).subscribe((response: FullUser) => this.updateUsers(response));
  }
}
