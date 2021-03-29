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
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { RestrictedUser } from '../../models/user.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { GetProfileFrontUrl } from '../../../statics/frontend_links.statics';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}
  
const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'hier soll ein button hin'},
];


@Component({
    selector: 'app-profiles-list',
    templateUrl: './profiles-list.component.html',
    styleUrls: ['./profiles-list.component.scss']
})
export class ProfilesListComponent implements OnInit {
    otherUsers: Observable<RestrictedUser[]>;
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource = ELEMENT_DATA;

    constructor(private coreSB: CoreSandboxService, private router: Router) {}

    ngOnInit() {
        this.coreSB.startLoadingOtherUsers();

        this.otherUsers = this.coreSB.getOtherUsers().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
    }

    onUserClick(user: RestrictedUser) {
        this.router.navigateByUrl(GetProfileFrontUrl(user));
    }
}
