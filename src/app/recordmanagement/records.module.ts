import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsListComponent } from './pages/record-list/records-list.component';
import { CreateRecordComponent } from './pages/create-record/create-record.component';
import { SharedModule } from '../shared/shared.module';
import { RecordComponent } from './pages/record/record.component';
import { RecordsPermitRequestsComponent } from './pages/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './pages/record-pool/record-pool.component';
import { CoreModule } from '../core/core.module';
import { TagsComponent } from './pages/tags/tags.component';

@NgModule({
  imports: [RecordsRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, CoreModule],
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
