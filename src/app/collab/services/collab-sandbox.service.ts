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
import {
    StartAddingDocument,
    StartDeletingCollabDocument,
    StartLoadingAllDocuments,
    StartLoadingCollabDocumentPermissions,
    StartLoadingCollabPermissions
} from '../store/collab.actions';
import { HttpClient } from '@angular/common/http';
import { SharedSandboxService } from '../../shared/services/shared-sandbox.service';
import { NameCollabDocument } from '../models/collab-document.model';
import { Observable } from 'rxjs';
import {
    GetCollabEditingApiUrl,
    GetCollabTextDocumentApiUrl,
    GetCollabTextDocumentVersionsApiUrl,
    GetCollabTextDocumentVersionsModelApiUrl
} from '../../statics/api_urls.statics';
import { AppSandboxService } from '../../core/services/app-sandbox.service';
import { EditingRoom } from '../models/editing-room.model';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class CollabSandboxService {
    constructor(
        private router: Router,
        private collabStore: Store<CollabState>,
        private http: HttpClient,
        private sharedSB: SharedSandboxService,
        private snackbackService: SnackbarService
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
                    if (result.includes('/')) {
                        this.snackbackService.showErrorSnackBar("document name can't contain /");
                        return;
                    }
                    if (id) {
                        this.getSingleDocumentById(id)
                            .subscribe((parent: NameCollabDocument) => {
                                result = `${parent.path}/${result}`;
                                this.collabStore.dispatch(
                                    new StartAddingDocument({ path: result })
                                );
                            })
                            .unsubscribe();
                    } else {
                        this.collabStore.dispatch(new StartAddingDocument({ path: result }));
                    }
                }
            }
        );
    }

    getSingleDocumentById(id: number): Observable<NameCollabDocument> {
        return this.collabStore.pipe(select((state: any) => state.collab.all_documents[id]));
    }

    getAllDocuments(): Observable<NameCollabDocument[]> {
        return this.collabStore.pipe(
            select((state: any) => Object.values(state.collab.all_documents))
        );
    }

    getAllTreeDocuments(): Observable<NameCollabDocument[]> {
        return this.collabStore.pipe(
            select((state: any) => Object.values(state.collab.all_documents_tree))
        );
    }

    fetchTextDocument(id: number): Observable<any> {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        return this.http.get(GetCollabTextDocumentApiUrl(id), privateKeyPlaceholder);
    }

    fetchTextDocumentVersions(id: number): Observable<any> {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        return this.http.get(GetCollabTextDocumentVersionsApiUrl(id), privateKeyPlaceholder);
    }

    fetchTextDocumentVersion(version_id: number): Observable<any> {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        return this.http.get(
            GetCollabTextDocumentVersionsModelApiUrl(version_id),
            privateKeyPlaceholder
        );
    }

    startDeletingCollabDocument(id: number): void {
        this.collabStore.dispatch(new StartDeletingCollabDocument({ id }));
    }

    saveTextDocument(id: number, content: string, is_draft: boolean = false): void {
        const privateKeyPlaceholder = AppSandboxService.getPrivateKeyPlaceholder();
        this.http
            .post(
                GetCollabTextDocumentVersionsApiUrl(id),
                { content, is_draft },
                privateKeyPlaceholder
            )
            .subscribe(response => {
                // check response?
                if (is_draft) {
                    this.snackbackService.showSuccessSnackBar('document draft saved');
                } else {
                    this.snackbackService.showSuccessSnackBar('document saved');
                }
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

    startLoadingCollabDocumentPermission(document_id: number): void {
        this.collabStore.dispatch(new StartLoadingCollabDocumentPermissions({ id: document_id }));
    }

    startAddingCollabDocumentPermission(
        document_id: number,
        grou_id: string,
        permission: string
    ): void {}

    startLoadingCollabPermissions(): void {
        this.collabStore.dispatch(new StartLoadingCollabPermissions());
    }
}
