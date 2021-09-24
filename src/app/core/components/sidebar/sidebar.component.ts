import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import { Store } from '@ngrx/store';
import { PERMISSION_CAN_ADD_RECORD_RLC, PERMISSION_CAN_CONSULT, PERMISSION_CAN_VIEW_RECORDS } from '../../../statics/permissions.statics';
import { RECORD_POOL_FRONT_URL, RECORDS_ADD_FRONT_URL, RECORDS_FRONT_URL } from '../../../statics/frontend_links.statics';
import { Subscription } from 'rxjs';
import { Logout } from '../../store/auth/actions';
import { Rlc } from '../../models/rlc.model';
import { IUser } from '../../models/user.model';
import { HasPermission } from '../../models/permission.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user: IUser = { name: '', email: '' };
  time = 0;

  number_of_notifications = '0';

  show_tab_permissions = {
    records: false,
    add_record: false,
    record_pool: false,
  };

  allSidebarItems = [
    {
      label: 'Records',
      icon: 'folder',
      link: '/records/',
    },
    {
      label: 'Create Record',
      icon: 'create_new_folder',
      link: '/records/add/',
    },
    {
      label: 'Record Pool',
      icon: 'library_books',
      link: '/records/record_pool/',
    },
    // {
    //   label: 'Profiles',
    //   icon: 'people_outline',
    //   link: '/profiles/',
    // },
    // {
    //   label: 'Groups',
    //   icon: 'group',
    //   link: '/groups/',
    // },
    {
      label: 'Files',
      icon: 'folder_open',
      link: '/files/',
    },
    {
      label: 'Collab',
      icon: 'article',
      link: 'collab',
    },
    {
      label: 'Admin',
      icon: 'lock',
      items: [
        {
          label: 'Records Admin',
          icon: 'folder',
          link: '/records/permit_requests',
        },
        {
          label: 'Statistics',
          icon: 'analytics',
          link: '/statistics/',
        },
        {
          label: 'Permissions',
          icon: 'vpn_key',
          link: '/permissions/',
        },
        {
          label: 'New Users',
          icon: 'person_add',
          link: '/new_user_requests/',
        },
      ],
    },
    {
      label: 'Settings',
      icon: 'settings',
      link: '/settings/',
    },
  ];
  sidebarItems = [];

  config = {
    // interfaceWithRoute: true,
    highlightOnSelect: true,
  };

  constructor(private router: Router, private coreSB: CoreSandboxService, private store: Store) {}

  ngOnInit() {
    this.sidebarItems = this.allSidebarItems;
    this.coreSB.getTimeRemaining().subscribe((time) => (this.time = time));
    this.coreSB
      .getNotifications()
      .subscribe((number_of_notifications: number) => (this.number_of_notifications = number_of_notifications.toString()));
    this.coreSB.getUser().subscribe((user: IUser) => (this.user = user));
    this.coreSB.getUserPermissions().subscribe((permissions: string[]) => {
      this.sidebarItems = this.allSidebarItems;
      if (!permissions.includes(PERMISSION_CAN_VIEW_RECORDS)) {
        console.log('has not');
      } else {
        console.log('has');
      }
    });
  }

  logout(): void {
    this.store.dispatch(Logout());
  }

  selectedItem(event: { link: string }): void {
    void this.router.navigate([event.link]);
  }
}
