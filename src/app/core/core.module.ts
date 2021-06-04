import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { NgMaterialMultilevelMenuModule, MultilevelMenuService } from 'ng-material-multilevel-menu';
import { CdkTableModule } from '@angular/cdk/table';
import { QuillTestComponent } from './components/quill-test/quill-test.component';
import { QuillModule } from 'ngx-quill';
import { CoreRoutingModule } from './core-routing.module';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/Dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { coreReducer } from './store/core.reducers';
import { CoreEffects } from './store/core.effects';
import { SharedModule } from '../shared/shared.module';
import { ProfilesListComponent } from './pages/profiles-list/profiles-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ForeignProfileComponent } from './pages/foreign-profile/foreign-profile.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { GroupsListComponent } from './pages/groups-list/groups-list.component';
import { GroupComponent } from './pages/group/group.component';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { AddHasPermissionComponent } from './components/add-has-permission/add-has-permission.component';
import { AddHasPermissionForComponent } from './components/add-has-permission-for/add-has-permission-for.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { NewUserRequestsComponent } from './pages/new-user-requests/new-user-requests.component';
import { NewUserRequestProcessedPipe, NewUserRequestRequestedPipe } from '../recordmanagement/pipes/new_user_request.pipe';
import { LegalNoticeComponent } from './pages/legal-notice/legal-notice.component';
import { InactiveUsersComponent } from './pages/inactive-users/inactive-users.component';
import { PrivacyStatementComponent } from './pages/privacy-statement/privacy-statement.component';
import { NotificationGroupsListComponent } from './pages/notification-groups-list/notification-groups-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { StatisticsNumberComponent } from './components/statistics-number/statistics-number.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { ArticleComponent } from './pages/article/article.component';

@NgModule({
  imports: [
    CoreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('core', coreReducer),
    EffectsModule.forFeature([CoreEffects]),
    MatTabsModule,
    MatProgressSpinnerModule,
    NgMaterialMultilevelMenuModule,
    CdkTableModule,
    QuillModule,
  ],
  declarations: [
    RegisterComponent,
    DashboardComponent,
    LoginComponent,
    ArticleComponent,
    ProfilesListComponent,
    SidebarComponent,
    ForeignProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    GroupsListComponent,
    GroupComponent,
    PermissionListComponent,
    AddHasPermissionComponent,
    AddHasPermissionForComponent,
    AddPermissionComponent,
    AddMemberComponent,
    AddGroupComponent,
    NewUserRequestsComponent,
    NewUserRequestRequestedPipe,
    NewUserRequestProcessedPipe,
    LegalNoticeComponent,
    InactiveUsersComponent,
    PrivacyStatementComponent,
    NotificationGroupsListComponent,
    NotificationListComponent,
    QuillTestComponent,
    StatisticsPageComponent,
    StatisticsNumberComponent,
  ],
  providers: [MultilevelMenuService],
  exports: [SidebarComponent],
})
export class CoreModule {}
