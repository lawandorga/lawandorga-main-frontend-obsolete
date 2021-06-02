/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2020  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { addToArray, DjangoError, SubmitData, removeFromArray } from 'src/app/shared/services/axios';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Folder } from '../../models/folder.model';
import { IFile } from '../../models/file.model';

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

  permissions = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private sharedSB: SharedSandboxService, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let url = 'api/files/folder/';
      if ('id' in params) {
        url = `api/files/folder/${params['id'] as string}/`;
        this.id = params['id'] as string;
      }

      this.http.get(url).subscribe((response: Folder) => {
        this.folder = response;
        this.getItems(this.folder.id);
      });
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
    this.http
      .get(`api/files/file_base/${id}/`, { observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: HttpResponse<Blob>) => {
        this.downloadFile(response, name);
      });
  }

  downloadFile(response: HttpResponse<Blob>, name: string): void {
    const filename: string = name;
    const binaryData = [];
    binaryData.push(response.body);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
}
