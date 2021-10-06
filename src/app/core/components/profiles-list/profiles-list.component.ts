import { Component, OnInit } from '@angular/core';
import { IUser } from '../../models/user.model';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { GetProfilesDetailApiUrl, GetProfilesUnlockApiUrl, PROFILES_API_URL } from '../../../statics/api_urls.statics';
import { SharedSandboxService } from '../../../shared/services/shared-sandbox.service';
import { removeFromArray } from '../../../shared/services/axios';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.component.html',
})
export class ProfilesListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone_number', 'actions'];
  users: IUser[];

  constructor(private appSB: AppSandboxService, private sharedSB: SharedSandboxService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('api/profiles/').subscribe((response: IUser[]) => (this.users = response));
  }

  updateUsers(response: IUser): void {
    const user = response;
    const index = this.users.findIndex((localUser) => localUser.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1, user);
      this.users = [...this.users];
    }
  }

  onUnlockClick(id: number): void {
    this.http.post(GetProfilesUnlockApiUrl(id), {}).subscribe((response: IUser) => this.updateUsers(response));
  }

  onDeActiveClick(user: IUser): void {
    this.http
      .patch(GetProfilesDetailApiUrl(parseInt(user.id)), { is_active: !user.is_active })
      .subscribe((response: IUser) => this.updateUsers(response));
  }

  getUserDetailUrl(id: number): string {
    return `/profiles/${id}/`;
  }

  onDeleteClick(id: number): void {
    this.sharedSB.openConfirmDialog(
      {
        title: 'Delete User',
        description: 'Are you sure you want to delete this user?',
        confirmLabel: 'Delete',
        confirmColor: 'warn',
      },
      (remove: boolean) => {
        if (remove) {
          this.http.delete(GetProfilesDetailApiUrl(id)).subscribe(() => {
            this.users = removeFromArray(this.users, id) as IUser[];
          });
        }
      }
    );
  }

  onAcceptClick(id: number): void {
    this.http.post(`api/profiles/${id}/accept/`, {}).subscribe((response: IUser) => this.updateUsers(response));
  }
}
