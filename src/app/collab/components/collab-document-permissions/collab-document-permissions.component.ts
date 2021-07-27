import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCollabDocumentPermissionComponent } from '../add-collab-document-permission/add-collab-document-permission.component';
import { NameCollabDocument } from '../../models/collab-document.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { HasPermission, Permission } from '../../../core/models/permission.model';
import { CollabPermission, CollabPermissionFrom } from '../../models/collab_permission.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { GetCollabViewFrontUrl } from '../../../statics/frontend_links.statics';
import {
  PERMISSION_MANAGE_COLLAB_DOCUMENT_PERMISSIONS_RLC,
  PERMISSION_READ_ALL_COLLAB_DOCUMENTS_RLC,
  PERMISSION_WRITE_ALL_COLLAB_DOCUMENTS_RLC,
} from '../../../statics/permissions.statics';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';

@Component({
  selector: 'app-collab-document-permissions',
  templateUrl: './collab-document-permissions.component.html',
  styleUrls: ['./collab-document-permissions.component.scss'],
})
export class CollabDocumentPermissionsComponent implements OnInit {
  @Input()
  collab_document: NameCollabDocument;

  general_permissions: Observable<HasPermission[]>;
  collab_document_permissions: Observable<CollabPermission[]>;

  document_columns = ['permission', 'group', 'action'];
  general_columns = ['permission', 'group'];

  COLLAB_PERMISSION_WRITE: Permission;
  COLLAB_PERMISSION_READ: Permission;
  PERMISSION_READ_ALL_ID: string;
  PERMISSION_WRITE_ALL_ID: string;
  PERMISSION_MANAGE_PERMISSIONS_ID: string;

  from_children = CollabPermissionFrom.Children;

  groups: any;

  constructor(
    private collabSB: CollabSandboxService,
    private router: Router,
    private coreSB: CoreSandboxService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.collabSB.startLoadingCollabPermissions();
    this.coreSB.startLoadingGroups();

    this.general_permissions = this.collabSB.getDocumentPermissionsGeneral();
    this.collab_document_permissions = this.collabSB.getDocumentPermissionsCollab();

    this.collabSB.getCollabPermissions().subscribe((permissions: Permission[]) => {
      for (const perm of permissions) {
        if (perm.name.toUpperCase().includes('WRITE')) {
          this.COLLAB_PERMISSION_WRITE = perm;
        } else if (perm.name.toUpperCase().includes('READ')) {
          this.COLLAB_PERMISSION_READ = perm;
        }
      }
    });

    this.coreSB.getAllPermissions().subscribe((permissions: Permission[]) => {
      for (const permission of permissions) {
        if (permission.name === PERMISSION_WRITE_ALL_COLLAB_DOCUMENTS_RLC) {
          this.PERMISSION_WRITE_ALL_ID = permission.id;
        } else if (permission.name === PERMISSION_READ_ALL_COLLAB_DOCUMENTS_RLC) {
          this.PERMISSION_READ_ALL_ID = permission.id;
        } else if (permission.name === PERMISSION_MANAGE_COLLAB_DOCUMENT_PERMISSIONS_RLC) {
          this.PERMISSION_MANAGE_PERMISSIONS_ID = permission.id;
        }
      }
    });
    this.coreSB.getGroups(false).subscribe((groups: any) => {
      this.groups = groups;
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
    void this.router.navigateByUrl(GetCollabViewFrontUrl(permission.document.id));
  }

  onGroupClick(hasPermission: HasPermission) {
    void this.router.navigateByUrl(`groups/${hasPermission.groupHas}/`);
  }
}
