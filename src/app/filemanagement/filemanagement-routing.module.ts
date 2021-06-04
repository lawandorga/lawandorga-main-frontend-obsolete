import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { FolderViewComponent } from './components/folder-view/folder-view.component';

const fileRoutes: Routes = [
  {
    path: '',
    component: FolderViewComponent,
  },
  {
    path: ':id',
    component: FolderViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(fileRoutes)],
  exports: [RouterModule],
  providers: [AuthGuardService],
})
export class FilemanagementRoutingModule {}
