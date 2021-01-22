/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2021  Dominik Walser
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { TextDocument } from '../../models/text-document.model';
import { TextDocumentVersion } from '../../models/text-document-version.model';

@Component({
    selector: 'app-text-version',
    templateUrl: './text-version.component.html',
    styleUrls: ['./text-version.component.scss']
})
export class TextVersionComponent implements OnInit {
    @Input()
    document: TextDocument;

    @Output() changedVersion: EventEmitter<TextDocumentVersion> = new EventEmitter();

    constructor(private collabSB: CollabSandboxService) {}

    ngOnInit(): void {
        this.collabSB.fetchTextDocumentVersions(this.document.id).subscribe(response => {
            console.log('response from fetching text document versions: ', response);
            const versions = TextDocumentVersion.getTextDocumentVersionsFromJsonArray(response);
            // TODO: don't replace, (quill contents?)
            this.document.versions = versions;
        });
    }

    onVersionClick(version: TextDocumentVersion): void {
        this.collabSB.fetchTextDocumentVersion(version.id).subscribe(response => {
            const full_version = TextDocumentVersion.getTextDocumentVersionFromJson(response);
            this.document.versions[0] = this.document.versions[1] = full_version;
            // this.document = this.document;
            this.changedVersion.emit(full_version);
            // console.log('document after version click: ', this.document);
        });
    }
}
