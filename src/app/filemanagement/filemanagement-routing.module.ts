import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
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
})
export class FilemanagementRoutingModule {}
