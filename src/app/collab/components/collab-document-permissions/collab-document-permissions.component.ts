import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCollabDocumentPermissionComponent } from '../add-collab-document-permission/add-collab-document-permission.component';
import { NameCollabDocument } from '../../models/collab-document.model';

@Component({
    selector: 'app-collab-document-permissions',
    templateUrl: './collab-document-permissions.component.html',
    styleUrls: ['./collab-document-permissions.component.scss']
})
export class CollabDocumentPermissionsComponent implements OnInit {
    @Input()
    collab_document: NameCollabDocument;

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        console.log('collabdocument permission component received doc: ', this.collab_document);
        // TODO: split into 2 parts
        // show folder permissions if user has permission manage_folder_permissions
        // show general permissions if user has permission manage_permissions
    }

    onAddPermission(): void {
        console.log('onAddPermissionClick');
        this.dialog.open(AddCollabDocumentPermissionComponent, { data: this.collab_document.id });
    }
}
