import { NgModule } from '@angular/core';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsListComponent } from './components/records-list/records-list.component';
import { CreateRecordComponent } from './components/records-create/create-record.component';
import { SharedModule } from '../shared/shared.module';
import { RecordComponent } from './components/records-detail/record.component';
import { RecordsPermitRequestsComponent } from './components/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './components/records-pool/record-pool.component';
import { CoreModule } from '../core/core.module';
import { TagsComponent } from './components/records-tags/tags.component';
import { RecordsDeletionRequestsComponent } from './components/records-deletion-requests/records-deletion-requests.component';

@NgModule({
  imports: [RecordsRoutingModule, SharedModule, CoreModule],
  declarations: [
    RecordsListComponent,
    CreateRecordComponent,
    RecordComponent,
    RecordsPermitRequestsComponent,
    RecordsDeletionRequestsComponent,
    RecordPoolComponent,
    TagsComponent,
  ],
  providers: [],
})
export class RecordsModule {}
