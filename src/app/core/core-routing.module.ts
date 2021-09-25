import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/Dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfilesListComponent } from './pages/profiles-list/profiles-list.component';
import { ForeignProfileComponent } from './pages/foreign-profile/foreign-profile.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { GroupsListComponent } from './pages/groups-list/groups-list.component';
import { GroupComponent } from './pages/group/group.component';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { NewUserRequestsComponent } from './pages/new-user-requests/new-user-requests.component';
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { PrivacyStatementComponent } from './pages/privacy-statement/privacy-statement.component';
import { NotificationGroupsListComponent } from './pages/notification-groups-list/notification-groups-list.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { STATISTICS_FRONT_URL } from '../statics/frontend_links.statics';
import { ArticleComponent } from './pages/article/article.component';
import { SettingsComponent } from './pages/settings/settings.component';

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
    path: STATISTICS_FRONT_URL,
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
