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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsListComponent } from './pages/record-list/records-list.component';
import { recordsReducer } from './store/records.reducers';
import { RecordsEffects } from './store/effects/records.effects';
import { CreateRecordComponent } from './pages/create-record/create-record.component';
import { RecordsSandboxService } from './services/records-sandbox.service';
import { SharedModule } from '../shared/shared.module';
import { RecordComponent } from './pages/record/record.component';
import { UsersFieldComponent } from './components/users-field/users-field.component';
import { RecordsLoadingEffects } from './store/effects/records-loading.effects';
import { RecordsPermitRequestsComponent } from './pages/records-permit-requests/records-permit-requests.component';
import { RecordPermissionsProcessedPipe, RecordPermissionsRequestedPipe } from './pipes/record_permission.pipe';
import { RecordDeletionRequestsComponent } from './components/record-deletion-requests/record-deletion-requests.component';
import { RecordDeletionsProcessedPipe, RecordDeletionsRequestedPipe } from './pipes/record_deletions.pipe';
import { RecordPoolComponent } from './pages/record-pool/record-pool.component';
import { DeletionRequestsComponent } from './pages/deletion-requests/deletion-requests.component';
import { RecordDocumentDeletionRequestsComponent } from './components/record-document-deletion-requests/record-document-deletion-requests.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    RecordsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('records', recordsReducer),
    EffectsModule.forFeature([RecordsEffects, RecordsLoadingEffects]),
    CoreModule,
  ],
  declarations: [
    RecordsListComponent,
    CreateRecordComponent,
    RecordComponent,
    UsersFieldComponent,
    RecordsPermitRequestsComponent,
    RecordPermissionsRequestedPipe,
    RecordPermissionsProcessedPipe,
    RecordDeletionRequestsComponent,
    RecordDeletionsRequestedPipe,
    RecordDeletionsProcessedPipe,
    RecordPoolComponent,
    DeletionRequestsComponent,
    RecordDocumentDeletionRequestsComponent,
  ],
  providers: [],
})
export class RecordsModule {
  constructor(private recordSB: RecordsSandboxService) {
    this.recordSB.startLoadingRecordStatics();
  }
}
