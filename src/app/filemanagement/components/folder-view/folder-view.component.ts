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
        // console.log('click on: ', entry);
        if (entry.type === FilesTypes.Folder) {
            // console.log('new path: ', GetFolderFrontUrlRelative(this.path, entry.name));
            this.router
                .navigateByUrl(GetFolderFrontUrlRelative(this.path, entry.name))
                .catch(error => {
                    console.log('error at redirecting: ', error);
                });
        }
    }

    dropped($event) {
        $event.preventDefault();

        const items = $event.dataTransfer.items;
        const all = [];
        let count = 0;
        const itemsLength = items.length;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const entry = item.webkitGetAsEntry();
            if (entry.isFile) {
                this.parseFileEntry(entry).then(result => {
                    count = count + 1;
                    all.push(result);
                    if (count === itemsLength) {
                        this.fileSB.upload(all, this.path);
                        this.fileSB.startLoadingFolderInformation(this.path);
                    }
                });
            } else if (entry.isDirectory) {
                this.parseDirectoryEntry(entry).then(result => {
                    count = count + 1;
                    all.push(result);
                    if (count === itemsLength) {
                        this.fileSB.upload(all, this.path);
                        this.fileSB.startLoadingFolderInformation(this.path);
                    }
                });
            }
        }
    }

    dragover($event) {
        $event.preventDefault();
    }

    filesSelected($event) {
        event.preventDefault();
        const files = Array.from(this.fileInput.nativeElement.files);
        this.fileSB.upload(files, this.path);
        this.fileSB.startLoadingFolderInformation(this.path);
    }

    parseFileEntry(fileEntry) {
        return new Promise((resolve, reject) => {
            fileEntry.file(
                file => {
                    resolve(file);
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    parseDirectoryEntry(directoryEntry) {
        const directoryReader = directoryEntry.createReader();
        return new Promise((resolve, reject) => {
            directoryReader.readEntries(
                entries => {
                    resolve(entries);
                },
                err => {
                    reject(err);
                }
            );
        });
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
        // TODO: create new folder here
        this.sharedSB.openEditTextDialog({
            short: true,
            descriptionLabel: 'folder name:',
            cancelLabel: 'back',
            saveLabel: 'save',
            saveColor: 'primary',
            title: 'new folder'
        }, (result) => {
            console.log('result from create new folder: ', result);
            this.fileSB.startCreatingNewFolder(result, this.currentFolder);
        })
    }
}
