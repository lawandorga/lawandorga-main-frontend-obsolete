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

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { CollabDocument } from '../../models/collab-document.model';

@Component({
    selector: 'app-collab-document-viewer',
    templateUrl: './collab-document-viewer.component.html',
    styleUrls: ['./collab-document-viewer.component.scss']
})
export class CollabDocumentViewerComponent implements OnInit, OnChanges {
    @Input()
    document_id: number;

    current_id: number;

    text_;

    constructor(private collabSB: CollabSandboxService) {
        this.current_id = undefined;
    }

    ngOnInit(): void {
        this.fetchIfNewDocumentId();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.fetchIfNewDocumentId();
    }

    fetchIfNewDocumentId() {
        if (this.document_id && this.current_id !== this.document_id) {
            this.current_id = this.document_id;
            this.collabSB.fetchTextDocument(this.document_id).subscribe(response => {
                const collab_document = CollabDocument.getCollabDocumentFromJson(response);
            });
        }
    }
}
