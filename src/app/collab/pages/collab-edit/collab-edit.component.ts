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

import { Component, OnInit, ViewChild } from '@angular/core';
import { HasUnsaved } from '../../../core/services/can-have-unsaved.interface';
import { TextDocument } from '../../models/text-document.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CustomQuillContainerComponent } from '../../components/custom-quill-container/custom-quill-container.component';

@Component({
    selector: 'app-collab-edit',
    templateUrl: './collab-edit.component.html',
    styleUrls: ['./collab-edit.component.scss']
})
export class CollabEditComponent implements OnInit, HasUnsaved {
    text_document: TextDocument;

    @ViewChild(CustomQuillContainerComponent) child: CustomQuillContainerComponent;

    constructor(private collabSB: CollabSandboxService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.collabSB
                .fetchTextDocument(params['id'])
                .subscribe((text_document: TextDocument) => {
                    this.text_document = text_document;
                });
        });
    }

    hasUnsaved(): boolean {
        return this.child.hasUnsaved();
    }
}
