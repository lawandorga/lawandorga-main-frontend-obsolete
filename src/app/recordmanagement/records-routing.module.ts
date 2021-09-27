import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsListComponent } from './components/records-list/records-list.component';
import { CreateRecordComponent } from './components/records-create/create-record.component';
import { RecordComponent } from './components/records-detail/record.component';
import { RecordsPermitRequestsComponent } from './components/records-permit-requests/records-permit-requests.component';
import { RecordPoolComponent } from './components/records-pool/record-pool.component';
import { TagsComponent } from './components/records-tags/tags.component';
import { RecordsDeletionRequestsComponent } from './components/records-deletion-requests/records-deletion-requests.component';

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
    path: 'pool',
    component: RecordPoolComponent,
  },
  {
    path: 'permit-requests',
    component: RecordsPermitRequestsComponent,
  },
  {
    path: 'deletion-requests',
    component: RecordsDeletionRequestsComponent,
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
