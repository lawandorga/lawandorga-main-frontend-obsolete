import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { QuillTestComponent } from './components/quill-test/quill-test.component';
import { QuillModule } from 'ngx-quill';
import { CoreRoutingModule } from './core-routing.module';
import { DashboardComponent } from './components/Dashboard/dashboard.component';
import { coreReducer } from './store/reducers';
import { SharedModule } from '../shared/shared.module';
import { ProfilesListComponent } from './components/profiles-list/profiles-list.component';
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
import { HelpComponent } from './components/help/help.component';
import { EffectsModule } from '@ngrx/effects';
import { CoreEffects } from './store/effects';

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
    CdkTableModule,
    QuillModule,
  ],
  declarations: [
    DashboardComponent,
    ArticleComponent,
    ProfilesListComponent,
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
  providers: [AppSandboxService],
})
export class CoreModule {}
