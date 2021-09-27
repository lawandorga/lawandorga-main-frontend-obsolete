import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { NgMaterialMultilevelMenuModule, MultilevelMenuService } from 'ng-material-multilevel-menu';
import { CdkTableModule } from '@angular/cdk/table';
import { QuillTestComponent } from './components/quill-test/quill-test.component';
import { QuillModule } from 'ngx-quill';
import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { coreReducer } from './store/core.reducers';
import { SharedModule } from '../shared/shared.module';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ForeignProfileComponent } from './components/foreign-profile/foreign-profile.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupComponent } from './components/group/group.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AddGroupComponent } from './components/add-group/add-group.component';
import { NewUserRequestsComponent } from './components/new-user-requests/new-user-requests.component';
import { NotificationGroupsListComponent } from './components/notification-groups-list/notification-groups-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';
import { StatisticsNumberComponent } from './components/statistics-number/statistics-number.component';
import { AddPermissionComponent } from './components/add-permission/add-permission.component';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { ArticleComponent } from './components/article/article.component';
import { AdminComponent } from './components/admin/admin.component';
import { AppSandboxService } from './services/app-sandbox.service';
import { SafeHtmlPipe } from './pipes/safe-html';
import { HelpComponent } from './components/help/help.component';

@NgModule({
  imports: [
    CoreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('core', coreReducer),
    MatTabsModule,
    MatProgressSpinnerModule,
    NgMaterialMultilevelMenuModule,
    CdkTableModule,
    QuillModule,
  ],
  declarations: [
    SafeHtmlPipe,
    DashboardComponent,
    ArticleComponent,
    ProfilesListComponent,
    SidebarComponent,
    HelpComponent,
    ForeignProfileComponent,
    GroupsListComponent,
    GroupComponent,
    PermissionListComponent,
    AddPermissionComponent,
    AddMemberComponent,
    AddGroupComponent,
    NewUserRequestsComponent,
    NotificationGroupsListComponent,
    NotificationListComponent,
    QuillTestComponent,
    AdminComponent,
    StatisticsPageComponent,
    StatisticsNumberComponent,
  ],
  providers: [MultilevelMenuService, AppSandboxService],
  exports: [SidebarComponent],
})
export class CoreModule {}
