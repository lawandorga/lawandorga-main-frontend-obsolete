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
import { ActivatedRoute, Router } from '@angular/router';
import { FilesSandboxService } from '../../services/files-sandbox.service';
import { FilesTypes, TableEntry } from '../../models/table-entry.model';
import { GetFolderFrontUrlRelative } from '../../../statics/frontend_links.statics';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { PERMISSION_WRITE_ALL_FOLDERS_RLC } from '../../../statics/permissions.statics';
import { DjangoError, SubmitData } from 'src/app/shared/services/axios';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-folder-view',
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.scss'],
})
export class FolderViewComponent implements OnInit {
  entries: TableEntry[] = [];
  path: string;
  informationOpened = false;
  informationEntry: TableEntry;

  write_permission = false;

  currentFolder: TableEntry;

  @ViewChild('fileInput', { static: true })
  fileInput: ElementRef<HTMLInputElement>;

  columns = ['type', 'name', 'size', 'last_edited', 'more'];

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
  files: File[];
  fileData: { file: string };

  constructor(
    private route: ActivatedRoute,
    private fileSB: FilesSandboxService,
    private router: Router,
    private sharedSB: SharedSandboxService,
    private coreSB: CoreSandboxService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get('api/files/file_base/').subscribe((response: File[]) => (this.files = response));

    this.route.queryParamMap.subscribe((map) => {
      if (map.get('path')) {
        this.path = map.get('path');
      } else {
        this.path = '';
      }
      this.fileSB.startLoadingFolderInformation(this.path);
    });

    this.fileSB.getFolders().subscribe((folders) => {
      folders = folders.sort((a: TableEntry, b: TableEntry) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      this.entries = this.entries.filter((entry) => {
        return entry.type !== FilesTypes.Folder;
      });
      this.entries.push(...folders);
    });
    this.fileSB.getFiles().subscribe((files) => {
      files = files.sort((a: TableEntry, b: TableEntry) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      this.entries = this.entries.filter((entry) => {
        return entry.type !== FilesTypes.File;
      });
      this.entries.push(...files);
    });
    this.fileSB.getCurrentFolder().subscribe((currentFolder: TableEntry) => {
      this.currentFolder = currentFolder;
      this.informationEntry = this.currentFolder;
    });

    this.fileSB.getCurrentFolderWritePermission().subscribe((write_permission: boolean) => {
      this.write_permission = this.write_permission || write_permission;
    });

    this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_WRITE_ALL_FOLDERS_RLC, (hasPermission) => {
      this.write_permission = this.write_permission || hasPermission;
    });
  }

  onEntryClick(entry: TableEntry): void {
    if (entry.type === FilesTypes.Folder) {
      this.router.navigateByUrl(GetFolderFrontUrlRelative(this.path, entry.name)).catch((error) => {});
    }
  }

  onFileSend(data: SubmitData): void {
    const formData = new FormData();
    // eslint-disable-next-line
    formData.append('file', data['file']['_files'][0] as File);
    formData.append('folder', this.currentFolder.id);

    this.http.post(`api/files/file_base/`, formData).subscribe(
      (response: File) => {
        // this.documents = addToArray(this.documents, response[0]) as RecordDocument[];
        // this.documentData = { file: '' };
        this.coreSB.showSuccessSnackBar('File saved successfully.');
      },
      (error: HttpErrorResponse) => (this.fileErrors = error.error)
    );
  }

  dropped($event) {
    $event.preventDefault();
    this.fileSB.upload($event.dataTransfer.items, this.currentFolder.id);
  }

  dragover($event) {
    $event.preventDefault();
  }

  filesSelected($event) {
    event.preventDefault();
    this.fileSB.upload(Array.from(this.fileInput.nativeElement.files), this.currentFolder.id);
    this.fileSB.startLoadingFolderInformation(this.path);
  }

  onFileDownload(id: number, name: string): void {
    this.http
      .get(`api/files/file_base/${id}/`, { observe: 'response', responseType: 'blob' as 'json' })
      .subscribe((response: HttpResponse<Blob>) => {
        this.downloadFile(response, name);
      });
  }

  onDeleteClick(entry: TableEntry) {
    let desc = 'are you sure you want to delete the ';
    if (entry.type === 1) {
      // file
      desc += 'file ';
    } else {
      // folder
      desc += 'folder ';
    }
    desc += entry.name + '?';

    this.sharedSB.openConfirmDialog(
      {
        description: desc,
        confirmLabel: 'delete',
        confirmColor: 'warn',
      },
      (delete_it: boolean) => {
        if (delete_it) {
          this.fileSB.startDeleting([entry], this.path);
        }
      }
    );
  }

  onDownloadClick(entry) {
    this.fileSB.startDownloading([entry], this.path);
  }

  getFileName(response: HttpResponse<Blob>) {
    let filename: string;
    try {
      const contentDisposition: string = response.headers.get('Content-Disposition');
      console.log(response.headers);

      const r = /(?:filename=")(.+)(?:")/;
      filename = r.exec(contentDisposition)[1];
    } catch (e) {
      filename = 'unknown-filename';
    }
    return filename;
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downloadFile(response: HttpResponse<Blob>, name: string): void {
    console.log('download');
    const filename: string = name;
    const binaryData = [];
    binaryData.push(response.body);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: 'blob' }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  onCurrentFolderInformation() {
    this.informationEntry = this.currentFolder;
    this.informationOpened = !this.informationOpened;
  }

  onFolderInformation(entry: TableEntry) {
    this.informationEntry = entry;
    this.informationOpened = true;
  }

  onCreateFolderClick() {
    this.sharedSB.openEditTextDialog(
      {
        short: true,
        descriptionLabel: 'folder name:',
        cancelLabel: 'back',
        saveLabel: 'save',
        saveColor: 'primary',
        title: 'new folder',
      },
      (result: string) => {
        if (result && result !== '') {
          if (result.includes('/')) {
            this.coreSB.showErrorSnackBar("You can't use / in folder names.");
          } else {
            this.fileSB.startCreatingNewFolder(result, this.currentFolder);
          }
        }
      }
    );
  }
}
