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
import {GetProfilesDetailApiUrl} from '../../../statics/api_urls.statics';
import { catchError } from 'rxjs/operators';
import { handleError } from '../../../statics/error_handler'

@Component({
    selector: 'app-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {
    allUsers: Observable<RestrictedUser[]>;
    displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];

    constructor(private coreSB: CoreSandboxService, private router: Router, private http: HttpClient) {}

    ngOnInit() {
        this.coreSB.startLoadingOtherUsers();
        this.allUsers = this.coreSB.getOtherUsers().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
    }

    onUnlockClick(id: number): void {
        // todo
        this.coreSB.showSuccessSnackBar('Clicked!');
    }

    onDeActiveClick(user: FullUser): void {
        // todo
        this.coreSB.showSuccessSnackBar('Clicked!');
        if (user.is_active) {
        } else {
        }
    }
    

    onDeleteClick(id: number): void {
        this.http.delete(GetProfilesDetailApiUrl(id), {})
            .pipe(catchError(handleError))
            .subscribe(resp => console.log(resp))
        this.coreSB.showSuccessSnackBar('Clicked!');
    }

    onAcceptClick(id: number): void {
        // todo
        this.coreSB.showSuccessSnackBar('Clicked!');
    }
}
