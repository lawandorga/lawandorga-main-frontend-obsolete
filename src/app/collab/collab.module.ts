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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollabMainViewComponent } from './pages/collab-main-view/collab-main-view.component';
import { CollabRoutingModule } from './collab-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { collabReducer } from './store/collab.reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CollabEffects } from './store/collab.effects';
import { DocumentTreeComponent } from './components/document-tree/document-tree.component';
import { PageViewComponent } from './pages/page-view/page-view.component';
import { CollabDocumentViewerComponent } from './components/collab-document-viewer/collab-document-viewer.component';
import { QuillConfig, QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { CustomQuillContainerComponent } from './components/custom-quill-container/custom-quill-container.component';
import { CollabEditComponent } from './pages/collab-edit/collab-edit.component';
import { TextVersionComponent } from './components/text-version/text-version.component';
import { CollabDocumentPermissionsComponent } from './components/collab-document-permissions/collab-document-permissions.component';
import { AddCollabDocumentPermissionComponent } from './components/add-collab-document-permission/add-collab-document-permission.component';
import { CollabSandboxService } from './services/collab-sandbox.service';

Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/mention', QuillCursors);
const bold = Quill.import('formats/bold');
bold.tagName = 'b';
Quill.register(bold, true);

const quillConfig: QuillConfig = {
  modules: {
    cursors: true,
    table: true,
    tableUI: true,
  },
};

@NgModule({
  imports: [
    CollabRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    StoreModule.forFeature('collab', collabReducer),
    EffectsModule.forFeature([CollabEffects]),
    QuillModule.forRoot(quillConfig),
  ],
  declarations: [
    CollabMainViewComponent,
    DocumentTreeComponent,
    PageViewComponent,
    CollabDocumentViewerComponent,
    CustomQuillContainerComponent,
    CollabEditComponent,
    TextVersionComponent,
    CollabDocumentPermissionsComponent,
    AddCollabDocumentPermissionComponent,
  ],
  providers: [],
})
export class CollabModule {
  constructor(private collabSB: CollabSandboxService) {
    this.collabSB.startLoadingCollabPermissions();
  }
}
