import { NgModule } from '@angular/core';
import { FilemanagementRoutingModule } from './filemanagement-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FolderViewComponent } from './components/folder-view/folder-view.component';
import { AddPermissionForFolderComponent } from './components/add-permission-for-folder/add-permission-for-folder.component';
import { EditFolderComponent } from './components/edit-folder/edit-folder.component';

@NgModule({
  imports: [FilemanagementRoutingModule, SharedModule],
  declarations: [FolderViewComponent, AddPermissionForFolderComponent, EditFolderComponent],
})
export class FilemanagementModule {}
