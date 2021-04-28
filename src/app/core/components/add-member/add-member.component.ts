import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import axios from '../../../shared/services/axios';
import { AxiosResponse } from 'axios';
import { FullUser } from '../../models/user.model';

@Component({
  selector: 'add-member',
  templateUrl: 'add-member.component.html',
})
export class AddMemberComponent implements OnInit {
  members: FullUser[];
  selectedMember: number;

  constructor(public dialogRef: MatDialogRef<AddMemberComponent>) {}

  ngOnInit(): void {
    void axios
      .get('api/profiles/')
      .then((response: AxiosResponse<FullUser[]>) => (this.members = response.data))
      .catch();
  }
}
