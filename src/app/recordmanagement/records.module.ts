import { NgModule } from '@angular/core';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsListComponent } from './components/record-list/records-list.component';
import { CreateRecordComponent } from './components/create-record/create-record.component';
import { SharedModule } from '../shared/shared.module';
import { RecordComponent } from './components/record/record.component';
import { RecordsPermitRequestsComponent } from './components/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './components/record-pool/record-pool.component';
import { CoreModule } from '../core/core.module';
import { TagsComponent } from './components/tags/tags.component';

@NgModule({
  imports: [RecordsRoutingModule, SharedModule, CoreModule],
  declarations: [
    RecordsListComponent,
    CreateRecordComponent,
    RecordComponent,
    RecordsPermitRequestsComponent,
    RecordPoolComponent,
    TagsComponent,
  ],
  providers: [],
})
export class RecordsModule {}
