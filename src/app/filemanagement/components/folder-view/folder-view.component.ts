import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { addToArray, DjangoError, SubmitData, removeFromArray } from 'src/app/shared/services/axios';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Folder } from '../../models/folder.model';
import { IFile } from '../../models/file.model';
import { AddPermissionForFolderComponent } from '../add-permission-for-folder/add-permission-for-folder.component';
import { MatDialog } from '@angular/material/dialog';
import { FolderPermission } from '../../models/folder_permission.model';
import { EditFolderComponent } from '../edit-folder/edit-folder.component';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
})
export class FolderViewComponent implements OnInit {
  id: string;

  permissionColumns = ['type', 'group', 'source', 'actions'];

  folder: Folder;
  folderFields = [
    {
      label: 'Name',
      type: 'text',
      tag: 'input',
      name: 'name',
      required: false,
    },
  ];
  folderErrors: DjangoError;
  folderData: { name: string };

  fileFields = [
    {
      label: 'File',
      type: 'file',
      tag: 'file',
      name: 'file',
      required: false,
    },
  ];
  fileErrors: DjangoError;
  fileData: { file: string };

  items: (IFile | Folder)[];
  displayedColumns = ['type', 'name', 'created', 'actions'];
  dataSource: MatTableDataSource<IFile | Folder>;

  permissions: FolderPermission[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private sharedSB: SharedSandboxService, private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let url = 'api/files/folder/first/';
      if ('id' in params) {
        url = `api/files/folder/${params['id'] as string}/`;
        this.id = params['id'] as string;
      }

      this.http.get(url).subscribe((response: Folder) => {
        this.folder = response;
        this.getItems(this.folder.id);
        this.getPermissions(this.folder.id);
      });
    });
  }

  getPermissions(id: number): void {
    this.http.get(`api/files/folder/${id}/permissions/`).subscribe((response: FolderPermission[]) => {
      this.permissions = response;
    });
  }

  getItems(id: number): void {
    this.http.get(`api/files/folder/${id}/items/`).subscribe((response: (IFile | Folder)[]) => {
      this.items = response;
      this.dataSource = new MatTableDataSource(this.items);
      this.dataSource.sort = this.sort;
    });
  }

  getFolderUrl(id: number): string {
    return `/files/${id}/`;
  }

  onFileSend(data: SubmitData): void {
    const formData = new FormData();
    // eslint-disable-next-line
    formData.append('file', data['file']['_files'][0] as File);
    if (this.id) formData.append('folder', this.id);

    this.http.post(`api/files/file_base/`, formData).subscribe(
      (response: IFile) => {
        this.items = addToArray(this.items, response) as (IFile | Folder)[];
        this.dataSource.data = this.items;
        this.fileData = { file: '' };
      },
      (error: HttpErrorResponse) => (this.fileErrors = error.error as DjangoError)
    );
  }

  onFolderSend(data: SubmitData): void {
    data['parent'] = this.id;
    this.http.post(`api/files/folder/`, data).subscribe(
      (response: Folder) => {
        this.items = addToArray(this.items, response) as (IFile | Folder)[];
        this.dataSource.data = this.items;
        this.folderData = { name: null };
      },
      (error: HttpErrorResponse) => (this.folderErrors = error.error as DjangoError)
    );
  }

  onFileDelete(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this file?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(`api/files/file_base/${id}/`).subscribe(() => {
            this.items = removeFromArray(this.items, id) as (IFile | Folder)[];
            this.dataSource.data = this.items;
          });
        }
      }
    );
  }

  onFolderDelete(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this folder?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(`api/files/folder/${id}/`).subscribe(() => {
            this.items = removeFromArray(this.items, id) as (IFile | Folder)[];
            this.dataSource.data = this.items;
          });
        }
      }
    );
  }

  onFileDownload(id: number, name: string): void {
    this.http.get(`api/files/file_base/${id}/`, { observe: 'response', responseType: 'blob' }).subscribe((response: HttpResponse<Blob>) => {
      this.downloadFile(response, name);
    });
  }

  downloadFile(response: HttpResponse<Blob>, name: string): void {
    const filename: string = name;
    const binaryData = [];
    binaryData.push(response.body);
    const file = new Blob(binaryData, { type: 'application/pdf' });
    if (name.split('.').pop() === 'pdf') {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(file);
      downloadLink.setAttribute('download', filename);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  }

  onEditFolder(id: number): void {
    const dialogRef = this.dialog.open(EditFolderComponent);

    dialogRef.afterClosed().subscribe((result: { name: string; folder: number }) => {
      if (result)
        this.http
          .patch(`api/files/folder/${id}/`, {
            name: result.name,
            parent: result.folder,
          })
          .subscribe(() => {
            this.getItems(this.folder.id);
            this.getPermissions(this.folder.id);
          });
    });
  }

  onAddPermission(): void {
    const dialogRef = this.dialog.open(AddPermissionForFolderComponent);

    dialogRef.afterClosed().subscribe((result: { permission: number; group: number }) => {
      if (result)
        this.http
          .post('api/files/permission_for_folder/', {
            permission: result.permission,
            group_has_permission: result.group,
            folder: this.folder.id,
          })
          .subscribe((response: FolderPermission) => (this.permissions = addToArray(this.permissions, response) as FolderPermission[]));
    });
  }

  onRemovePermission(id: number): void {
    this.http
      .delete(`api/files/permission_for_folder/${id}/`)
      .subscribe(() => (this.permissions = removeFromArray(this.permissions, id) as FolderPermission[]));
  }
}
