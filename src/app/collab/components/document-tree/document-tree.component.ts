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
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { NameCollabDocument } from '../../models/collab-document.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GetCollabViewFrontUrl } from '../../../statics/frontend_links.statics';

@Component({
    selector: 'app-document-tree',
    templateUrl: './document-tree.component.html',
    styleUrls: ['./document-tree.component.scss']
})
export class DocumentTreeComponent implements OnInit {
    treeControl = new NestedTreeControl<NameCollabDocument>(node => node.children);
    dataSource = new MatTreeNestedDataSource<NameCollabDocument>();
    route_id: number;

    constructor(
        private collabSB: CollabSandboxService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.dataSource.data = [];
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.route_id = Number(params['id']);
        });

        this.collabSB.startLoadingAllDocuments();
        this.collabSB.getAllDocuments().subscribe((documents: NameCollabDocument[]) => {
            this.dataSource.data = documents;

            this.expandToSelected();
        });
    }

    hasChild = (_: number, node: NameCollabDocument) => !!node.children && node.children.length > 0;

    onNodeClick(data: NameCollabDocument): void {
        this.router.navigateByUrl(GetCollabViewFrontUrl(data.id));
    }

    expandToSelected(): void {
        for (const doc of this.dataSource.data) {
            this.expandThis(doc);
        }
    }

    expandThis(node: NameCollabDocument): boolean {
        for (const child of node.children) {
            if (child.id === this.route_id) {
                this.treeControl.expand(node);
                this.treeControl.expand(child);
                return true;
            }

            const result = this.expandThis(child);
            if (result) {
                this.treeControl.expand(node);
                return true;
            }
        }
        return false;
    }
}
