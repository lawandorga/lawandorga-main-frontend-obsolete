import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from 'src/app/shared/components/form-dialog/form-dialog.component';
import { addToArray, DjangoError, removeFromArray, replaceInArray } from 'src/app/shared/services/axios';
import { Tag } from '../../models/tag.model';

@Component({
  selector: 'settings-page',
  templateUrl: './tags.component.html',
})
export class TagsComponent implements OnInit {
  tags: Tag[];
  tagFields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      tag: 'input',
      required: true,
    },
  ];
  tagErrors: DjangoError;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.http.get('api/records/tags/').subscribe((response: Tag[]) => (this.tags = response));
  }

  deleteTag(id: number): void {
    this.http.delete(`api/records/tags/${id}`).subscribe(() => {
      this.tags = removeFromArray(this.tags, id) as Tag[];
    });
  }

  updateTag(tag: Tag): void {
    const data = { title: 'Update Tag', fields: [{ label: 'Name', name: 'name', tag: 'input' }], data: tag, submit: 'Save' };
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: { name: string }) => {
      if (result)
        this.http.patch(`api/records/tags/${tag.id}/`, result).subscribe((response: Tag) => {
          this.tags = replaceInArray(this.tags, response) as Tag[];
        });
    });
  }

  createTag(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { title: 'Create Tag', fields: [{ label: 'Name', name: 'name', tag: 'input' }], submit: 'Create' },
    });

    dialogRef.afterClosed().subscribe((result: { name: string }) => {
      if (result)
        this.http.post(`api/records/tags/`, result).subscribe({
          next: (response: Tag) => {
            this.tags = addToArray(this.tags, response) as Tag[];
          },
          error: (error: HttpErrorResponse) => (this.tagErrors = error.error as DjangoError),
        });
    });
  }
}
