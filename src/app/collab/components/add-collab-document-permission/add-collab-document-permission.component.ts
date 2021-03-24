import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { alphabeticalSorterByField } from '../../../shared/other/sorter-helper';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { Observable } from 'rxjs';
import { RestrictedGroup } from '../../../core/models/group.model';
import { CollabSandboxService } from '../../services/collab-sandbox.service';

@Component({
    selector: 'app-add-collab-document-permission',
    templateUrl: './add-collab-document-permission.component.html',
    styleUrls: ['./add-collab-document-permission.component.scss']
})
export class AddCollabDocumentPermissionComponent implements OnInit {
    groups: Observable<RestrictedGroup[]>;
    selectedGroup: RestrictedGroup = null;

    selectedPermission: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private coreSB: CoreSandboxService,
        public dialogRef: MatDialogRef<AddCollabDocumentPermissionComponent>,
        private collabSB: CollabSandboxService
    ) {}

    ngOnInit(): void {
        this.coreSB.startLoadingGroups();
        this.groups = this.coreSB.getGroups().pipe(
            tap(results => {
                alphabeticalSorterByField(results, 'name');
            })
        );
    }

    selectedGroupChanged(selectedGroup: RestrictedGroup): void {
        this.selectedGroup = selectedGroup;
    }

    onCloseClick() {
        this.dialogRef.close();
    }

    onAddClick() {
        if (this.selectedPermission) {
            // TODO: this
            // this.fileSB.startCreatingFolderPermission(
            //     this.data,
            //     this.selectedGroup,
            //     this.selectedPermission
            // );
            console.log('data: ', this.data);
            console.log('group: ', this.selectedGroup);
            console.log('permission: ', this.selectedPermission);
            this.collabSB.startAddingCollabDocumentPermission(
                this.data,
                this.selectedGroup.id,
                this.selectedPermission
            );
            this.dialogRef.close();
        } else {
            this.coreSB.showErrorSnackBar('please select a permission');
        }
    }
}
