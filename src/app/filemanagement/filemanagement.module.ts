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

import { NgModule } from '@angular/core';
import { FilemanagementRoutingModule } from './filemanagement-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FolderViewComponent } from './components/folder-view/folder-view.component';
import { StoreModule } from '@ngrx/store';
import { filesReducer } from './store/files.reducers';
import { EffectsModule } from '@ngrx/effects';
import { FilesEffects } from './store/file.effects';
import { AddPermissionForFolderComponent } from './components/add-permission-for-folder/add-permission-for-folder.component';

@NgModule({
  imports: [
    FilemanagementRoutingModule,
    SharedModule,
    StoreModule.forFeature('files', filesReducer),
    EffectsModule.forFeature([FilesEffects]),
  ],
  declarations: [FolderViewComponent, AddPermissionForFolderComponent],
})
export class FilemanagementModule {}
