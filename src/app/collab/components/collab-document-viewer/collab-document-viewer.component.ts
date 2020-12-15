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
import { QuillEditorComponent } from 'ngx-quill';
import { Router } from '@angular/router';
import { GetCollabEditFrontUrl } from '../../../statics/frontend_links.statics';

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

    quillRef: Quill;

    loading = true;

    @ViewChild(QuillEditorComponent, { static: true }) editor: QuillEditorComponent;
    modules = {};

    constructor(private collabSB: CollabSandboxService, private router: Router) {
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
        console.log('on destroy');
        this.text_document = undefined;
    }

    fetchIfNewDocumentId() {
        if (this.document_id && this.current_id !== this.document_id) {
            console.log('fetch in collab document viewer');
            this.current_id = this.document_id;
            this.loading = true;
            this.collabSB.fetchTextDocument(this.document_id).subscribe(response => {
                this.text_document = TextDocument.getTextDocumentFromJson(response);
                this.loading = false;
                console.log('fetch in collab document viewer finished', response);
                // this.quillRef.setContents(JSON.parse(this.text_document.content));
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
}
