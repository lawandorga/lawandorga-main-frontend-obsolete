/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
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

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CoreSandboxService} from '../../core/services/core-sandbox.service';
import {SnackbarService} from '../../shared/services/snackbar.service';
import { FilesState } from '../store/files.reducers';
import { select, Store } from '@ngrx/store';
import { StartDeletingFilesAndFolders, StartDownloadFilesAndFolders, StartLoadingFolder } from '../store/files.actions';
import { Observable } from 'rxjs';
import { TableEntry } from '../models/table-entry.model';
import { StorageService } from '../../shared/services/storage.service';

@Injectable({
    providedIn: "root"
})
export class FilesSandboxService {
    constructor(
        private router: Router,
        private filesStore: Store<FilesState>,
        private coreSB: CoreSandboxService,
        private snackbarService: SnackbarService,
        private storage: StorageService
    ) {

    }

    startLoadingFolderInformation(path: string){
        this.filesStore.dispatch(new StartLoadingFolder(path));
    }

    getFolders(asArray: boolean = true): Observable<TableEntry[]> {
        return this.filesStore.pipe(
            select((state: any) => {
                const values = state.files.folders;
                return asArray ? Object.values(values) : values;
            })
        )
    }

    getFiles(asArray: boolean = true): Observable<TableEntry[]> {
        return this.filesStore.pipe(
            select((state: any) => {
                const values = state.files.files;
                return asArray ? Object.values(values) : values;
            })
        )
    }

    getCurrentFolder(): Observable<TableEntry> {
        return this.filesStore.pipe(
            select((state: any) => {
                return state.files.current_folder;
            })
        );
    }

    upload(stuff: any, path: string){
        // console.log('i want to upload: ', stuff);
        // console.log('i want to upload here: ', path);
        this.storage.upload(path, stuff, (response) => {
            this.startLoadingFolderInformation(path);
        });
    }

    startDeleting(stuff: TableEntry[], path: string){
        this.filesStore.dispatch(new StartDeletingFilesAndFolders({'entries': stuff, path}));
    }

    startDownloading(stuff: TableEntry[], path: string){
        this.filesStore.dispatch(new StartDownloadFilesAndFolders({'entries': stuff, path}));
    }
}

