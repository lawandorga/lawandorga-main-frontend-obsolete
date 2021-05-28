/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
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
import { NewRestrictedRecord } from '../../models/record.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CoreSandboxService } from '../../../core/services/core-sandbox.service';
import { MatTableDataSource } from '@angular/material/table';
import { SharedSandboxService } from 'src/app/shared/services/shared-sandbox.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-records',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss'],
})
export class RecordsListComponent implements OnInit {
  displayedColumns = ['record_token', 'consultants', 'tags', 'note', 'created_on', 'last_edited', 'actions'];
  dataSource: MatTableDataSource<NewRestrictedRecord>;
  records: NewRestrictedRecord[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private coreSB: CoreSandboxService, private sharedSB: SharedSandboxService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('api/records/records/').subscribe((response: NewRestrictedRecord[]) => {
      this.records = response;
      this.dataSource = new MatTableDataSource(this.records);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: NewRestrictedRecord, filter: string) => {
        return (
          data.record_token.toLowerCase().includes(filter) ||
          this.getState(data.state).toLowerCase().includes(filter) ||
          this.getConsultants(data.working_on_record).toLowerCase().includes(filter) ||
          this.getTags(data.tagged).toLowerCase().includes(filter)
        );
      };
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getConsultants(consultants: { id: number; name: string; email: string }[]): string {
    return consultants.map((consultant) => consultant.name).join(', ');
  }

  getTags(tags: { id: number; name: string }[]): string {
    return tags.map((tag) => tag.name).join(', ');
  }

  getState(state: string): string {
    switch (state) {
      case 'op':
        return 'Open';
      case 'wa':
        return 'Waiting';
      case 'cl':
        return 'Closed';
      case 'wo':
        return 'Working';
      default:
        return 'Unknown';
    }
  }

  getStateColor(state: string): string {
    switch (state) {
      case 'op':
        return 'darkgreen';
      case 'wa':
        return 'chocolate';
      case 'cl':
        return 'gray';
      case 'wo':
        return 'cornflowerblue';
      default:
        return 'red';
    }
  }

  getRecordDetailUrl(id: number): string {
    return `/records/${id}/`;
  }

  requestAccess(id: number): void {
    this.http
      .post(`api/records/records/${id}/request_permission/`, {})
      .subscribe(() => this.coreSB.showSuccessSnackBar('Access application has been made. The admins will be informed.'));
  }

  onRequestDeletion(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete',
        description: 'Are you sure you want to delete this record?',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          const data = {
            record_id: id,
            explanation: '',
          };
          this.http
            .post(`api/records/record_deletion_requests/`, data)
            .subscribe(() => this.coreSB.showSuccessSnackBar('Deletion request has been made. The admins will be informed.'));
        }
      }
    );
  }
}
