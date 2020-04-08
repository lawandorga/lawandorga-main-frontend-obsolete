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
import { createUrlResolverWithoutPackagePrefix } from '@angular/compiler';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';

@Component({
    selector: 'app-folder-view',
    templateUrl: './folder-view.component.html',
    styleUrls: ['./folder-view.component.scss']
})
export class FolderViewComponent implements OnInit {
    entries: TableEntry[] = [];
    path: string;
    informationOpened = false;
    informationEntry: TableEntry;

    currentFolder: TableEntry;

    @ViewChild('fileInput')
    fileInput: ElementRef<HTMLInputElement>;

    columns = ['type', 'name', 'size', 'last_edited', 'more'];

    constructor(
        private route: ActivatedRoute,
        private fileSB: FilesSandboxService,
        private router: Router,
        private sharedSB: SharedSandboxService
    ) {}

    ngOnInit() {
        this.route.queryParamMap.subscribe(map => {
            if (map.get('path')) {
                this.path = map.get('path');
                // console.log('path set: ', this.path);
            } else {
                // console.log('root');
                this.path = '';
            }
            this.fileSB.startLoadingFolderInformation(this.path);
        });

        this.fileSB.getFolders().subscribe(folders => {
            folders = folders.sort((a: TableEntry, b: TableEntry) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );
            this.entries = this.entries.filter(entry => {
                return entry.type !== FilesTypes.Folder;
            });
            this.entries.push(...folders);
        });
        this.fileSB.getFiles().subscribe(files => {
            files = files.sort((a: TableEntry, b: TableEntry) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );
            this.entries = this.entries.filter(entry => {
                return entry.type !== FilesTypes.File;
            });
            this.entries.push(...files);
        });
        this.fileSB.getCurrentFolder().subscribe((currentFolder: TableEntry) => {
            this.currentFolder = currentFolder;
            this.informationEntry = this.currentFolder;
        });
    }

    onEntryClick(entry: TableEntry): void {
        if (entry.type === FilesTypes.Folder) {
            this.router
                .navigateByUrl(GetFolderFrontUrlRelative(this.path, entry.name))
                .catch(error => {
                    console.log('error at redirecting: ', error);
                });
        }
    }

    dropped($event) {
        $event.preventDefault();
        console.log('datatransfer of dropped', $event.dataTransfer);
        console.log('datatransfer items of dropped', $event.dataTransfer.items);
        this.fileSB.upload($event.dataTransfer.items, this.path);
    }

    dragover($event) {
        $event.preventDefault();
    }

    filesSelected($event) {
        event.preventDefault();
        // const files = Array.from(this.fileInput.nativeElement.files);
        // console.log('files', files);
        // const dataTransfer = new DataTransfer();
        // console.log('empty DataTransfer', dataTransfer);
        //
        // // const itemList = new DataTransferItemList();
        //
        //
        // for (const file of files){
        //     // dataTransfer.add(file);
        //     dataTransfer.items.add(file);
        //     console.log('i add ', file);
        //
        //     // itemList.add(file)
        //
        // }
        // dataTransfer.effectAllowed = 'all';
        // console.log('dataTransfer after adding', dataTransfer);

        // this.fileSB.upload(dataTransfer.items, this.path);
        this.fileSB.upload(Array.from(this.fileInput.nativeElement.files), this.path);
        this.fileSB.startLoadingFolderInformation(this.path);
    }

    onDeleteClick(entry: TableEntry) {
        let desc = 'are you sure you want to delete the ';
        if (entry.type === 1){
            // file
            desc += 'file ';
        } else {
            // folder
            desc += 'folder ';
        }
        desc += entry.name + '?';

        this.sharedSB.openConfirmDialog({
            description: desc,
            confirmLabel: 'delete',
            confirmColor: 'warn'
        }, (delete_it: boolean) => {
            if (delete_it){
                this.fileSB.startDeleting([entry], this.path);
            }
        })
    }

    onDownloadClick(entry) {
        this.fileSB.startDownloading([entry], this.path);
    }

    onCurrentFolderInformation() {
        this.informationEntry = this.currentFolder;
        this.informationOpened = !this.informationOpened;
    }

    onFolderInformation(entry: TableEntry) {
        this.informationEntry = entry;
        this.informationOpened = true;
    }

    onCreateFolderClick(){
        this.sharedSB.openEditTextDialog({
            short: true,
            descriptionLabel: 'folder name:',
            cancelLabel: 'back',
            saveLabel: 'save',
            saveColor: 'primary',
            title: 'new folder'
        }, (result) => {
            this.fileSB.startCreatingNewFolder(result, this.currentFolder);
        })
    }
}
