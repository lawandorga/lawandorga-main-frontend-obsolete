/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
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

import { RouterModule, Routes } from '@angular/router';
import { CollabMainViewComponent } from './pages/collab-main-view/collab-main-view.component';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { UnsavedGuardService } from '../core/services/unsaved-guard.service';
import { PageViewComponent } from './pages/page-view/page-view.component';
import { CollabEditComponent } from './pages/collab-edit/collab-edit.component';
import { TextVersionComponent } from './components/text-version/text-version.component';

const collabRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: PageViewComponent
    },
    {
        path: ':id',
        component: PageViewComponent
    },
    {
        path: 'edit/:id',
        component: CollabEditComponent,
        canDeactivate: [UnsavedGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(collabRoutes)],
    exports: [RouterModule],
    providers: [AuthGuardService, UnsavedGuardService]
})
export class CollabRoutingModule {}
