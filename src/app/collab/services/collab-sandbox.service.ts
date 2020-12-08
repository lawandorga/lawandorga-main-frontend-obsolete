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
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { CollabState } from '../store/collab.reducers';
import { StartAddingDocument, StartLoadingAllDocuments } from '../store/collab.actions';
import { HttpClient } from '@angular/common/http';
import { SharedSandboxService } from '../../shared/services/shared-sandbox.service';
import { NameCollabDocument } from '../models/collab-document.model';
import { Observable } from 'rxjs';
import {
    GetCollabEditingApiUrl,
    GetCollabTextDocumentApiUrl
} from '../../statics/api_urls.statics';
import { AppSandboxService } from '../../core/services/app-sandbox.service';
import { EditingRoom } from '../models/editing-room.model';

@Injectable({
    providedIn: 'root'
})
export class CollabSandboxService {
    constructor(
        private router: Router,
        private collabStore: Store<CollabState>,
        private http: HttpClient,
        private sharedSB: SharedSandboxService
    ) {}

    startLoadingAllDocuments(): void {
        this.collabStore.dispatch(new StartLoadingAllDocuments());
    }

    addNewCollabDocument(id?: number): void {
        this.sharedSB.openEditTextDialog(
            {
                short: true,
                descriptionLabel: 'name',
                saveLabel: 'create',
                title: 'add new document'
            },
            result => {
                if (result) {
                    this.collabStore.dispatch(
                        new StartAddingDocument({ name: result, parent_id: id ? id : null })
                    );
                }
            }
        );
    }

    getAllDocuments(): Observable<NameCollabDocument[]> {
        return this.collabStore.pipe(select((state: any) => state.collab.all_documents));
    }

    fetchTextDocument(id: number): Observable<any> {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        return this.http.get(GetCollabTextDocumentApiUrl(id), privateKeyPlaceholder);
    }

    saveTextDocument(id: number, content: string): void {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        this.http
            .patch(GetCollabTextDocumentApiUrl(id), { content }, privateKeyPlaceholder)
            .subscribe(response => {
                // console.log('i got something back: ', response);
                // TODO: do something here? show snackbar
            });
    }

    connectToEditingRoom(id: number): Observable<any> {
        return this.http.get(GetCollabEditingApiUrl(id));
    }

    closeEditingRoom(document_id: number): void {
        this.http.delete(GetCollabEditingApiUrl(document_id)).subscribe(res => {
            console.log('response from deleting editing room: ', res);
        });
    }
}
