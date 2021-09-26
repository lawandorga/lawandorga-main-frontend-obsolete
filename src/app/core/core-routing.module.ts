import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
import { ForeignProfileComponent } from './components/foreign-profile/foreign-profile.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupComponent } from './components/group/group.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { NewUserRequestsComponent } from './components/new-user-requests/new-user-requests.component';
import { NotificationGroupsListComponent } from './components/notification-groups-list/notification-groups-list.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { ArticleComponent } from './components/article/article.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {
    path: 'profiles',
    pathMatch: 'full',
    component: ProfilesListComponent,
  },
  {
    path: 'settings',
    pathMatch: 'full',
    component: SettingsComponent,
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent,
  },
  {
    path: 'profiles/:id',
    component: ForeignProfileComponent,
  },
  {
    path: 'groups',
    pathMatch: 'full',
    component: GroupsListComponent,
  },
  {
    path: 'groups/:id',
    component: GroupComponent,
  },
  {
    path: 'permissions',
    pathMatch: 'full',
    component: PermissionListComponent,
  },
  {
    path: 'new_user_requests',
    component: NewUserRequestsComponent,
  },
  {
    path: 'notifications',
    component: NotificationGroupsListComponent,
  },
  {
    path: 'statistics',
    component: StatisticsPageComponent,
  },
  // without access control

  { path: 'articles/:id', component: ArticleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
