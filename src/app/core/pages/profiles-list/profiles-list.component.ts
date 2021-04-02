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
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { FullUser, RestrictedUser } from '../../models/user.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
    GetProfilesDetailApiUrl,
    GetProfilesUnlockApiUrl
} from '../../../statics/api_urls.statics';
import { catchError } from 'rxjs/operators';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import {
    PERMISSION_CAN_PERMIT_RECORD_PERMISSION_REQUESTS,
    PERMISSION_MANAGE_USERS
} from '../../../statics/permissions.statics';

@Component({
    selector: 'app-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {
    allUsersDirect: FullUser[];
    displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
    canDelete = false;

    constructor(
        private coreSB: CoreSandboxService,
        private sharedSB: SharedSandboxService,
        private router: Router,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.coreSB.startLoadingOtherUsers();
        this.coreSB.getOtherUserDirect().subscribe(response => {
            console.log('response from loading users');
            this.allUsersDirect = FullUser.getFullUsersFromJsonArray(
                response.results ? response.results : response
            );
        });
        this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_MANAGE_USERS, hasPermission => {
            console.log('hasPermission', hasPermission);
            this.canDelete = hasPermission;
        });
    }

    onUnlockClick(id: number): void {
        this.http.post(GetProfilesUnlockApiUrl(id), {}).subscribe(resp => console.log(resp));
        // todo
        this.coreSB.showSuccessSnackBar('Clicked!');
    }

    onDeActiveClick(user: FullUser): void {
        this.http
            .patch(GetProfilesDetailApiUrl(parseInt(user.id)), { is_active: !user.is_active })
            .subscribe(resp => {
                console.log('resp from deactivating ', resp);
                const userFromResponse = FullUser.getFullUserFromJson(resp);
                // this.allUsersDirect

                const index = this.allUsersDirect.findIndex(
                    (localUser: FullUser) => localUser.id === user.id
                );
                if (index !== -1) {
                    this.allUsersDirect.splice(index, 1, userFromResponse);
                    this.allUsersDirect = [...this.allUsersDirect];
                }
            });
    }

    onDeleteClick(id: number): void {
        this.sharedSB.openConfirmDialog(
            {
                description: 'Are you sure you want to delete this user?',
                confirmLabel: 'remove',
                confirmColor: 'warn'
            },
            (remove: boolean) => {
                if (remove) {
                    this.http.delete(GetProfilesDetailApiUrl(id), {}).subscribe(resp => {
                        this.allUsersDirect = this.allUsersDirect.filter((user: FullUser) => {
                            return parseInt(user.id) !== id;
                        });
                    });
                }
            }
        );
    }

    onAcceptClick(id: number): void {
        // todo
        this.coreSB.showSuccessSnackBar('This is not implemented yet!');
    }
}
