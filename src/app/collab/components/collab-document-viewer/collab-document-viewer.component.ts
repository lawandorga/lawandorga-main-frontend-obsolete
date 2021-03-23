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

import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { TextDocument } from '../../models/text-document.model';
import Quill from 'quill';
import { Router } from '@angular/router';
import { COLLAB_BASE, GetCollabEditFrontUrl } from '../../../statics/frontend_links.statics';
import { TextDocumentVersion } from '../../models/text-document-version.model';
import { CustomQuillContainerComponent } from '../custom-quill-container/custom-quill-container.component';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { NameCollabDocument } from '../../models/collab-document.model';

@Component({
    selector: 'app-collab-document-viewer',
    templateUrl: './collab-document-viewer.component.html',
    styleUrls: ['./collab-document-viewer.component.scss']
})
export class CollabDocumentViewerComponent implements OnInit, OnChanges, OnDestroy {
    @Input()
    document_id: number;

    current_id: number;

    text_document: TextDocument;
    collab_document: NameCollabDocument;

    quillRef: Quill;

    loading = true;

    versionsOpened = false;
    infoOpened = false;

    @ViewChild(CustomQuillContainerComponent) quillEditor: CustomQuillContainerComponent;

    constructor(
        private collabSB: CollabSandboxService,
        private router: Router,
        public sharedSB: SharedSandboxService
    ) {
        this.current_id = undefined;
        this.text_document = undefined;
    }

    ngOnInit(): void {
        this.fetchIfNewDocumentId();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.fetchIfNewDocumentId();
    }

    ngOnDestroy(): void {
        this.text_document = undefined;
    }

    fetchIfNewDocumentId() {
        if (this.document_id && this.current_id !== this.document_id) {
            this.current_id = this.document_id;
            this.loading = true;
            this.collabSB.fetchTextDocument(this.document_id).subscribe(response => {
                const received_document = TextDocument.getTextDocumentFromJson(response);
                received_document.content = received_document.versions[0].is_draft
                    ? received_document.versions[1].content
                    : received_document.versions[0].content;
                this.text_document = received_document;
                this.loading = false;
            });
            this.collabSB
                .getSingleDocumentById(this.document_id)
                .subscribe((document: NameCollabDocument) => {
                    this.collab_document = document;
                });
        }
    }

    created(event: Quill) {
        this.quillRef = event;
        this.quillRef.enable(false);
    }

    onEditClick(): void {
        this.router.navigateByUrl(GetCollabEditFrontUrl(this.current_id));
    }

    onMenuHistoryClick(): void {
        this.versionsOpened = !this.versionsOpened;
        this.infoOpened = false;
    }

    onDeleteClick(): void {
        this.sharedSB.openConfirmDialog(
            {
                description: 'are you sure you want to delete this document?',
                confirmLabel: 'remove',
                confirmColor: 'warn'
            },
            (remove: boolean) => {
                if (remove) {
                    this.collabSB.startDeletingCollabDocument(this.current_id);
                    this.router.navigateByUrl(COLLAB_BASE);
                }
            }
        );
    }

    onInfoClick(): void {
        this.infoOpened = !this.infoOpened;
        this.versionsOpened = false;
        console.log('document: ', this.text_document);
    }

    onChangedVersion(text_document_version: TextDocumentVersion): void {
        this.text_document.content = text_document_version.content;
        this.quillEditor.initQuill();
    }
}
