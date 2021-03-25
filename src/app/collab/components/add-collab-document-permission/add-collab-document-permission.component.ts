import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { RestrictedGroup } from '../../../core/models/group.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';
import { Permission } from '../../../core/models/permission.model';

@Component({
    selector: 'app-add-collab-document-permission',
    templateUrl: './add-collab-document-permission.component.html',
    styleUrls: ['./add-collab-document-permission.component.scss']
})
export class AddCollabDocumentPermissionComponent implements OnInit {
    groups: Observable<RestrictedGroup[]>;
    selectedGroup: RestrictedGroup = null;
    collabPermissions: Permission[] = [];

    selectedPermission: string;

    constructor(
        private coreSB: CoreSandboxService,
        private collabSB: CollabSandboxService,
        public dialogRef: MatDialogRef<AddCollabDocumentPermissionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number
    ) {}

    ngOnInit(): void {
        this.coreSB.startLoadingGroups();
        this.groups = this.coreSB.getGroups().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
        // this.collabSB.getCollab
        this.collabSB.getCollabPermissions().subscribe((permissions: Permission[]) => {
            this.collabPermissions = permissions;
        });
    }

    selectedGroupChanged(selectedGroup: RestrictedGroup): void {
        this.selectedGroup = selectedGroup;
    }

    onCloseClick() {
        this.dialogRef.close();
    }

    onAddClick() {
        if (this.selectedPermission) {
            const collab_permission_id = this.collabPermissions.filter((perm: Permission) =>
                perm.name.toUpperCase().includes(this.selectedPermission.toUpperCase())
            )[0].id;
            console.log('permission id: ', collab_permission_id);

            this.collabSB.startAddingCollabDocumentPermission(
                this.data,
                this.selectedGroup.id,
                collab_permission_id
            );
            this.dialogRef.close();
        } else {
            this.coreSB.showErrorSnackBar('please select a permission');
        }
    }
}
