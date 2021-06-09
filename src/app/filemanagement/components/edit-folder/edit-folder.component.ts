import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Folder } from '../../models/folder.model';

@Component({
  selector: 'edit-folder',
  templateUrl: './edit-folder.component.html',
})
export class EditFolderComponent implements OnInit {
  folders: Folder[];
  name: string;
  selectedFolder: number;

  constructor(public dialogRef: MatDialogRef<EditFolderComponent>, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`api/files/folder/`).subscribe((response: Folder[]) => (this.folders = response));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
