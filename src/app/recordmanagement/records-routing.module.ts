import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsListComponent } from './pages/record-list/records-list.component';
import { CreateRecordComponent } from './pages/create-record/create-record.component';
import { RecordComponent } from './pages/record/record.component';
import { RecordsPermitRequestsComponent } from './pages/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './pages/record-pool/record-pool.component';
import { TagsComponent } from './pages/tags/tags.component';

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
