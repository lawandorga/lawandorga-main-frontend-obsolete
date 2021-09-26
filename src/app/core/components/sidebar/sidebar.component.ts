import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { Store } from '@ngrx/store';
import {
  PERMISSION_ACCESS_TO_FILES_RLC,
  PERMISSION_CAN_ADD_RECORD_RLC,
  PERMISSION_CAN_CONSULT,
  PERMISSION_CAN_VIEW_RECORDS,
} from '../../../statics/permissions.statics';
import { Subscription } from 'rxjs';
import { Logout } from 'src/app/auth/store/actions';
import { Rlc } from '../../models/rlc.model';
import { IUser } from '../../models/user.model';

interface SidebarItem {
  label: string;
  icon: string;
  link?: string;
  items?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  subscriptions: Subscription[] = [];
  user: IUser = { name: '', email: '' };

  number_of_notifications = '0';

  show_tab_permissions = {
    records: false,
    add_record: false,
    record_pool: false,
  };

  allSidebarItems: SidebarItem[] = [
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
          link: '/records/permit_requests/',
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
  sidebarItems: SidebarItem[] = [];
  permissions: string[];
  rlc: Rlc;
  config = {
    // interfaceWithRoute: true,
    highlightOnSelect: true,
  };

  constructor(private router: Router, private appSB: AppSandboxService, private store: Store) {}

  ngOnInit(): void {
    this.sidebarItems = this.allSidebarItems;
    this.appSB
      .getNotifications()
      .subscribe((number_of_notifications: number) => (this.number_of_notifications = number_of_notifications.toString()));
    this.appSB.getUser().subscribe((user: IUser) => (this.user = user));
    this.appSB.getRlc().subscribe((rlc: Rlc) => {
      this.rlc = rlc;
      this.recheckSidebarItems();
    });
    this.appSB.getUserPermissions().subscribe((permissions: string[]) => {
      this.permissions = permissions;
      this.recheckSidebarItems();
    });
    this.recheckSidebarItems();
  }

  recheckSidebarItems(): void {
    this.sidebarItems = this.allSidebarItems;
    if (this.permissions && !this.permissions.includes(PERMISSION_CAN_VIEW_RECORDS))
      this.sidebarItems = this.sidebarItems.filter((item) => item.link !== '/records/');
    if (this.permissions && !this.permissions.includes(PERMISSION_CAN_ADD_RECORD_RLC))
      this.sidebarItems = this.sidebarItems.filter((item) => item.link !== '/records/add/');
    if (this.permissions && !this.permissions.includes(PERMISSION_ACCESS_TO_FILES_RLC))
      this.sidebarItems = this.sidebarItems.filter((item) => item.link !== '/files/');
    if ((this.rlc && !this.rlc.use_record_pool) || (this.permissions && !this.permissions.includes(PERMISSION_CAN_CONSULT)))
      this.sidebarItems = this.sidebarItems.filter((item) => item.link !== '/records/record_pool/');
  }

  logout(): void {
    this.store.dispatch(Logout());
  }

  selectedItem(event: { link: string }): void {
    void this.router.navigate([event.link]);
  }
}
