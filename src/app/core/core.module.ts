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
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { coreReducer } from './store/core.reducers';
import { CoreEffects } from './store/core.effects';
import { SharedModule } from '../shared/shared.module';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ForeignProfileComponent } from './components/foreign-profile/foreign-profile.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupComponent } from './components/group/group.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { NewUserRequestsComponent } from './components/new-user-requests/new-user-requests.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { PrivacyStatementComponent } from './components/privacy-statement/privacy-statement.component';
import { NotificationGroupsListComponent } from './components/notification-groups-list/notification-groups-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { StatisticsNumberComponent } from './components/statistics-number/statistics-number.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { ArticleComponent } from './components/article/article.component';
import { SettingsComponent } from './components/settings/settings.component';

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
    AddPermissionComponent,
    AddMemberComponent,
    AddGroupComponent,
    NewUserRequestsComponent,
    LegalNoticeComponent,
    PrivacyStatementComponent,
    NotificationGroupsListComponent,
    NotificationListComponent,
    QuillTestComponent,
    SettingsComponent,
    StatisticsPageComponent,
    StatisticsNumberComponent,
  ],
  providers: [MultilevelMenuService],
  exports: [SidebarComponent],
})
export class CoreModule {}
