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
import axios, { DjangoError, removeFromArray } from '../../../shared/services/axios';
import { AxiosError, AxiosResponse } from 'axios';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
  styleUrls: ['./profiles-list.component.scss'],
})
export class ProfilesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
  users: FullUser[];

  constructor(private coreSB: CoreSandboxService, private sharedSB: SharedSandboxService) {}

  ngOnInit(): void {
    axios
      .get(PROFILES_API_URL)
      .then((response: AxiosResponse<FullUser[]>) => (this.users = response.data))
      .catch((err) => console.log(err));
  }

  updateUsers(response: AxiosResponse<FullUser>): void {
    const user = response.data;
    const index = this.users.findIndex((localUser) => localUser.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1, user);
      this.users = [...this.users];
    }
  }

  onUnlockClick(id: number): void {
    axios
      .post(GetProfilesUnlockApiUrl(id), {})
      .then((response) => this.updateUsers(response))
      .catch((err: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(err.response.data.detail));
  }

  onDeActiveClick(user: FullUser): void {
    axios
      .patch(GetProfilesDetailApiUrl(parseInt(user.id)), { is_active: !user.is_active })
      .then((response) => this.updateUsers(response))
      .catch((err: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(err.response.data.detail));
  }

  onDeleteClick(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        description: 'Are you sure you want to delete this user?',
        confirmLabel: 'remove',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          axios
            .delete(GetProfilesDetailApiUrl(id), {})
            .then(() => {
              this.users = this.users.filter((user) => parseInt(user.id) !== id);
            })
            .catch((err: AxiosError<DjangoError>) => this.coreSB.showErrorSnackBar(err.response.data.detail));
        }
      }
    );
  }

  onAcceptClick(id: number): void {
    // todo
    this.coreSB.showSuccessSnackBar('This is not implemented yet!');
  }
}
