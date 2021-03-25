import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCollabDocumentPermissionComponent } from '../add-collab-document-permission/add-collab-document-permission.component';
import { NameCollabDocument } from '../../models/collab-document.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { HasPermission, Permission } from '../../../core/models/permission.model';
import { CollabPermission, CollabPermissionFrom } from '../../models/collab_permission.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GetSpecialCollabDocumentApiUrl } from '../../../statics/api_urls.statics';
import { GetCollabViewFrontUrl } from '../../../statics/frontend_links.statics';

@Component({
    selector: 'app-collab-document-permissions',
    templateUrl: './collab-document-permissions.component.html',
    styleUrls: ['./collab-document-permissions.component.scss']
})
export class CollabDocumentPermissionsComponent implements OnInit {
    @Input()
    collab_document: NameCollabDocument;

    general_permissions: Observable<HasPermission[]>;
    collab_document_permissions: Observable<CollabPermission[]>;

    document_columns = ['permission', 'group', 'action'];

    collab_permission_write: Permission;
    collab_permission_read: Permission;

    from_children = CollabPermissionFrom.Children;

    constructor(
        private collabSB: CollabSandboxService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.general_permissions = this.collabSB.getDocumentPermissionsGeneral();
        this.collab_document_permissions = this.collabSB.getDocumentPermissionsCollab();

        this.collabSB.getCollabPermissions().subscribe((permissions: Permission[]) => {
            for (const perm of permissions) {
                if (perm.name.toUpperCase().includes('WRITE')) {
                    this.collab_permission_write = perm;
                } else if (perm.name.toUpperCase().includes('READ')) {
                    this.collab_permission_read = perm;
                }
            }
        });
    }

    onAddPermission(): void {
        this.dialog.open(AddCollabDocumentPermissionComponent, { data: this.collab_document.id });
    }

    removeCollabPermission(permission: CollabPermission): void {
        this.collabSB.startDeletingDocumentPermission(permission.id);
        this.collabSB.startLoadingCollabDocumentPermission(this.collab_document.id);
    }

    onCollabPermissionGoToClick(permission: CollabPermission): void {
        this.router.navigateByUrl(GetCollabViewFrontUrl(permission.document.id));
    }
}
