import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
import { ForeignProfileComponent } from './components/foreign-profile/foreign-profile.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupComponent } from './components/group/group.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { NewUserRequestsComponent } from './components/new-user-requests/new-user-requests.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';
import { NotificationGroupsListComponent } from './components/notification-groups-list/notification-groups-list.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { ArticleComponent } from './components/article/article.component';
import { SettingsComponent } from './components/settings/settings.component';

const apiRoutes: Routes = [
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
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'articles/:id', component: ArticleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:userid/:token', component: ResetPasswordComponent },
  { path: 'activate-account/:userid/:token', component: LoginComponent },
  { path: 'legal_notice', component: LegalNoticeComponent },
  { path: 'privacy_statement', component: PrivacyStatementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(apiRoutes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
