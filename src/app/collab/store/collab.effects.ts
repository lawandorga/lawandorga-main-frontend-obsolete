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
import {
    SET_ALL_DOCUMENTS,
    START_ADDING_DOCUMENT,
    START_LOADING_ALL_DOCUMENTS,
    StartAddingDocument
} from './collab.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { COLLAB_COLLAB_DOCUMENTS } from '../../statics/api_urls.statics';
import { NameCollabDocument } from '../models/collab-document.model';

@Injectable()
export class CollabEffects {
    constructor(private actions: Actions, private http: HttpClient) {}

    @Effect()
    startLoadingAllDocuments = this.actions.pipe(
        ofType(START_LOADING_ALL_DOCUMENTS),
        switchMap(() => {
            return from(
                this.http.get(COLLAB_COLLAB_DOCUMENTS).pipe(
                    catchError(err => {
                        console.log('error');
                        return [];
                    }),
                    mergeMap(response => {
                        console.log('response from loading collab documents: ', response);
                        const documents = NameCollabDocument.getNameCollabDocumentsFromJsonArray(
                            response
                        );
                        console.log('documents from response:', documents);
                        return [{ type: SET_ALL_DOCUMENTS, payload: documents }];
                    })
                )
            );
        })
    );

    @Effect()
    startAddingDocument = this.actions.pipe(
        ofType(START_ADDING_DOCUMENT),
        map((action: StartAddingDocument) => {
            return action.payload;
        }),
        switchMap((payload: { path: string }) => {
            console.log('path to add: ', payload.path);
            return new Observable();
            // return from(
            //     this.http
            //         .post(COLLAB_COLLAB_DOCUMENTS, {
            //             path: payload.path
            //         })
            //         .pipe(
            //             catchError(err => {
            //                 console.log('error at adding document', err);
            //                 return [];
            //             }),
            //             mergeMap(response => {
            //                 return [{ type: START_LOADING_ALL_DOCUMENTS }];
            //             })
            //         )
            // );
        })
    );
}
