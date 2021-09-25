import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsListComponent } from './components/record-list/records-list.component';
import { CreateRecordComponent } from './components/create-record/create-record.component';
import { RecordComponent } from './components/record/record.component';
import { RecordsPermitRequestsComponent } from './components/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './components/record-pool/record-pool.component';
import { TagsComponent } from './components/tags/tags.component';

const recordsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RecordsListComponent,
  },
  {
    path: 'add',
    component: CreateRecordComponent,
  },
  {
    path: 'record_pool',
    component: RecordPoolComponent,
  },
  {
    path: 'permit_requests',
    component: RecordsPermitRequestsComponent,
  },
  {
    path: 'tags',
    component: TagsComponent,
  },
  {
    path: ':id',
    component: RecordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(recordsRoutes)],
  exports: [RouterModule],
})
export class RecordsRoutingModule {}
