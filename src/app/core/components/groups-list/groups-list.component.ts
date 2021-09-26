import { Component, OnInit } from '@angular/core';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { RestrictedGroup } from '../../models/group.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { addToArray, removeFromArray } from '../../../shared/services/axios';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './groups-list.component.html',
})
export class GroupsListComponent implements OnInit {
  groups: RestrictedGroup[];
  groupsDisplayedColumns = ['group', 'description', 'action'];

  constructor(
    private appSB: AppSandboxService,
    private router: Router,
    public dialog: MatDialog,
    private sharedSB: SharedSandboxService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get('api/groups/').subscribe((response: RestrictedGroup[]) => (this.groups = response));
  }

  onOpenGroup(id: number): string {
    return `groups/${id}/`;
  }

  onAddGroup(): void {
    const dialogRef = this.dialog.open(AddGroupComponent);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result)
        this.http
          .post(`api/groups/`, { name: result })
          .subscribe((response: RestrictedGroup) => (this.groups = addToArray(this.groups, response) as RestrictedGroup[]));
    });
  }

  groupDetailUrl(id: number): string {
    return `/groups/${id}/`;
  }

  onDeleteGroup(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this group?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(`api/groups/${id}/`).subscribe(() => (this.groups = removeFromArray(this.groups, id) as RestrictedGroup[]));
        }
      }
    );
  }
}
