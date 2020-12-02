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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollabSandboxService } from '../../services/collab-sandbox.service';

@Component({
    selector: 'app-page-view',
    templateUrl: './page-view.component.html',
    styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
    id: number;

    constructor(private route: ActivatedRoute, private collabSB: CollabSandboxService) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.id = params['id'];
        });
    }

    onAddDocumentClick(): void {
        this.collabSB.addNewCollabDocument(this.id);
    }
}
