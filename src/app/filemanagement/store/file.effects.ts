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


import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { FilesSandboxService } from '../services/files-sandbox.service';
import { SET_FILES, SET_FOLDERS, START_LOADING_FOLDER, StartLoadingFolder } from './files.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { GetFolderInformationApiUrl } from '../../statics/api_urls.statics';
import { TableEntry } from '../models/table-entry.model';

@Injectable()
export class FilesEffects{
    constructor(
        private actions: Actions,
        private http: HttpClient,
        private fileSB: FilesSandboxService
    ) {}

    @Effect()
    startLoadingFolder = this.actions.pipe(
        ofType(START_LOADING_FOLDER),
        map((action: StartLoadingFolder) => {
            return action.payload;
        }),
        mergeMap((path: string) => {
            console.log('effect fired');
            return from(
                this.http.get(GetFolderInformationApiUrl(path)).pipe(
                    catchError(error => {
                        console.log('error: ', error);
                        return []
                    }),
                    mergeMap((response: any) => {
                        console.log('response from loading folder', response);
                        const folders = TableEntry.getFolderTableEntriesFromJsonArray(response.folders);
                        const files = TableEntry.getFileTableEntriesFromJsonArray(response.files);

                        return [{type: SET_FOLDERS, payload: folders}, {type: SET_FILES, payload: files}];
                    })
                )
            );
        })
    )

}
