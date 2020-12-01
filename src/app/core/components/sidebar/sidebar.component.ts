/*
 * law&orga - record and organization management software for refugee law clinics
 * Copyright (C) 2019  Dominik Walser
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSandboxService } from '../../services/app-sandbox.service';
import { FullUser } from '../../models/user.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';
import {
    PERMISSION_ACCEPT_NEW_USERS_RLC,
    PERMISSION_ACCESS_TO_FILES_RLC,
    PERMISSION_ACTIVATE_INACTIVE_USERS,
    PERMISSION_CAN_ADD_RECORD_RLC,
    PERMISSION_CAN_CONSULT,
    PERMISSION_CAN_PERMIT_RECORD_PERMISSION_REQUESTS,
    PERMISSION_CAN_VIEW_PERMISSIONS_RLC,
    PERMISSION_CAN_VIEW_RECORDS,
    PERMISSION_PROCESS_RECORD_DELETION_REQUESTS,
    PERMISSION_PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS
} from '../../../statics/permissions.statics';
import {
    ACCEPT_NEW_USER_REQUESTS_FRONT_URL,
    DELETION_REQUESTS_FRONT_URL,
    FILES_FRONT_URL,
    GROUPS_FRONT_URL,
    INACTIVE_USERS_FRONT_URL,
    LEGAL_NOTICE_FRONT_URL,
    OWN_PROFILE_FRONT_URL,
    PERMISSIONS_FRONT_URL,
    PROFILES_FRONT_URL,
    RECORD_POOL_FRONT_URL,
    RECORDS_ADD_FRONT_URL,
    RECORDS_FRONT_URL,
    RECORDS_PERMIT_REQUEST_FRONT_URL
} from '../../../statics/frontend_links.statics';
import { RlcSettings } from '../../models/rlc_settings.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    name = '';
    email = '';

    timerCheckPermissions = null;
    timerLoadUnreadNotifications = null;
    checkPermissionInterval = 30000;
    checkNotificationsInterval = 15000;

    number_of_notifications = '0';

    legalNoticeUrl = LEGAL_NOTICE_FRONT_URL;

    show_tab_permissions = {
        records: false,
        add_record: false,
        record_permission_request: false,
        permissions: false,
        accept_new_user: false,
        activate_inactive_users: false,
        process_deletion_requests: false,
        show_files: false,
        record_pool: false
    };

    sidebarItemsOrg = [
        {
            label: 'Records',
            icon: 'folder',
            link: RECORDS_FRONT_URL
        },
        {
            label: 'Create Record',
            icon: 'create_new_folder',
            link: RECORDS_ADD_FRONT_URL
        },
        {
            label: 'Record Pool',
            icon: 'library_books',
            link: RECORD_POOL_FRONT_URL
        },
        {
            label: 'Profiles',
            icon: 'people_outline',
            link: PROFILES_FRONT_URL
        },
        {
            label: 'Groups',
            icon: 'group',
            link: GROUPS_FRONT_URL
        },
        {
            label: 'Files',
            icon: 'folder_open',
            link: FILES_FRONT_URL
        },
        {
            label: 'Collab',
            icon: 'article',
            link: 'collab'
        },
        {
            label: 'Admin',
            icon: 'lock',
            items: [
                {
                    label: 'Permit Requests',
                    icon: 'offline_pin',
                    link: RECORDS_PERMIT_REQUEST_FRONT_URL
                },
                {
                    label: 'Permissions',
                    icon: 'vpn_key',
                    link: PERMISSIONS_FRONT_URL
                },
                {
                    label: 'New Users',
                    icon: 'person_add',
                    link: ACCEPT_NEW_USER_REQUESTS_FRONT_URL
                },
                {
                    label: 'Inactive Users',
                    icon: 'perm_identity',
                    link: INACTIVE_USERS_FRONT_URL
                },
                {
                    label: 'Deletion Requests',
                    icon: 'delete_forever',
                    link: DELETION_REQUESTS_FRONT_URL
                }
            ]
        }
    ];
    actualSidebarItems = [];

    config = {
        // interfaceWithRoute: true,
        highlightOnSelect: true
    };

    static removeLink(
        link: string,
        itemsToSearch
    ): { removed: boolean; newItems; deleteMe: boolean } {
        for (const item of itemsToSearch) {
            if (item.link === link) {
                return {
                    removed: true,
                    newItems: itemsToSearch.filter(innerItem => innerItem.link !== link),
                    deleteMe: itemsToSearch.length < 2
                };
            }
            if (item.items) {
                const result = this.removeLink(link, item.items);
                if (result.deleteMe) {
                    return {
                        removed: true,
                        newItems: itemsToSearch.filter(innerItem => innerItem !== item),
                        deleteMe: itemsToSearch.length < 2
                    };
                }
                if (result.removed) {
                    item.items = result.newItems;
                    return {
                        removed: true,
                        newItems: itemsToSearch,
                        deleteMe: false
                    };
                }
            }
        }
        return {
            removed: false,
            newItems: itemsToSearch,
            deleteMe: false
        };
    }

    constructor(
        private router: Router,
        private appSB: AppSandboxService,
        private coreSB: CoreSandboxService
    ) {
        this.actualSidebarItems = this.sidebarItemsOrg;
    }

    ngOnInit() {
        this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_CAN_VIEW_RECORDS, hasPermission => {
            if (this.show_tab_permissions.records !== hasPermission) {
                this.show_tab_permissions.records = hasPermission;
                this.recheckSidebarItems();
            }
        });

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_CAN_ADD_RECORD_RLC,
            hasPermission => {
                if (this.show_tab_permissions.add_record !== hasPermission) {
                    this.show_tab_permissions.add_record = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_CAN_PERMIT_RECORD_PERMISSION_REQUESTS,
            hasPermission => {
                if (this.show_tab_permissions.record_permission_request !== hasPermission) {
                    this.show_tab_permissions.record_permission_request = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_CAN_VIEW_PERMISSIONS_RLC,
            hasPermission => {
                if (this.show_tab_permissions.permissions !== hasPermission) {
                    this.show_tab_permissions.permissions = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_ACCEPT_NEW_USERS_RLC,
            hasPermission => {
                if (this.show_tab_permissions.accept_new_user !== hasPermission) {
                    this.show_tab_permissions.accept_new_user = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_ACTIVATE_INACTIVE_USERS,
            hasPermission => {
                if (this.show_tab_permissions.activate_inactive_users !== hasPermission) {
                    this.show_tab_permissions.activate_inactive_users = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_PROCESS_RECORD_DELETION_REQUESTS,
            hasPermission => {
                if (this.show_tab_permissions.process_deletion_requests !== hasPermission) {
                    this.show_tab_permissions.process_deletion_requests = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_PROCESS_RECORD_DOCUMENT_DELETION_REQUESTS,
            hasPermission => {
                if (this.show_tab_permissions.process_deletion_requests !== hasPermission) {
                    this.show_tab_permissions.process_deletion_requests = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(
            PERMISSION_ACCESS_TO_FILES_RLC,
            hasPermission => {
                if (this.show_tab_permissions.show_files !== hasPermission) {
                    this.show_tab_permissions.show_files = hasPermission;
                    this.recheckSidebarItems();
                }
            }
        );

        this.coreSB.hasPermissionFromStringForOwnRlc(PERMISSION_CAN_CONSULT, hasPermission => {
            this.coreSB.getRlcSettings().subscribe((settings: RlcSettings) => {
                if (settings && settings.recordPoolEnabled && hasPermission) {
                    this.show_tab_permissions.record_pool = true;
                    this.recheckSidebarItems();
                }
            });
        });
        this.recheckSidebarItems();

        this.subscriptions.push(
            this.coreSB.getUser().subscribe((user: FullUser) => {
                this.name = user ? user.name : '';
                this.email = user ? user.email : '';
            })
        );

        this.subscriptions.push(
            this.coreSB.getNotifications().subscribe((number_of_notifications: number) => {
                this.number_of_notifications = number_of_notifications.toString();
            })
        );

        if (!isDevMode()) {
            this.timerCheckPermissions = setInterval(() => {
                this.coreSB.startCheckingUserHasPermissions();
            }, this.checkPermissionInterval);
            this.recheckSidebarItems();
        }

        this.timerLoadUnreadNotifications = setInterval(() => {
            this.coreSB.startLoadingUnreadNotifications();
        }, this.checkNotificationsInterval);
    }

    recheckSidebarItems() {
        let newSidebarItems = JSON.parse(JSON.stringify(this.sidebarItemsOrg));
        if (!this.show_tab_permissions.records)
            newSidebarItems = SidebarComponent.removeLink(RECORDS_FRONT_URL, newSidebarItems)
                .newItems;
        if (!this.show_tab_permissions.add_record)
            newSidebarItems = SidebarComponent.removeLink(RECORDS_ADD_FRONT_URL, newSidebarItems)
                .newItems;
        if (!this.show_tab_permissions.record_permission_request)
            newSidebarItems = SidebarComponent.removeLink(
                RECORDS_PERMIT_REQUEST_FRONT_URL,
                newSidebarItems
            ).newItems;
        if (!this.show_tab_permissions.permissions)
            newSidebarItems = SidebarComponent.removeLink(PERMISSIONS_FRONT_URL, newSidebarItems)
                .newItems;
        if (!this.show_tab_permissions.activate_inactive_users)
            newSidebarItems = SidebarComponent.removeLink(INACTIVE_USERS_FRONT_URL, newSidebarItems)
                .newItems;
        if (!this.show_tab_permissions.accept_new_user)
            newSidebarItems = SidebarComponent.removeLink(
                ACCEPT_NEW_USER_REQUESTS_FRONT_URL,
                newSidebarItems
            ).newItems;
        if (!this.show_tab_permissions.process_deletion_requests)
            newSidebarItems = SidebarComponent.removeLink(
                DELETION_REQUESTS_FRONT_URL,
                newSidebarItems
            ).newItems;
        if (!this.show_tab_permissions.show_files)
            newSidebarItems = SidebarComponent.removeLink(FILES_FRONT_URL, newSidebarItems)
                .newItems;
        if (!this.show_tab_permissions.record_pool)
            newSidebarItems = SidebarComponent.removeLink(RECORD_POOL_FRONT_URL, newSidebarItems)
                .newItems;
        this.actualSidebarItems = newSidebarItems;
    }

    logout() {
        clearInterval(this.timerCheckPermissions);
        clearInterval(this.timerLoadUnreadNotifications);
        this.appSB.logout();
    }

    showProfile() {
        this.router.navigate([OWN_PROFILE_FRONT_URL]);
    }

    selectedItem(event) {
        this.router.navigate([event.link]);
    }

    ngOnDestroy() {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
        clearInterval(this.timerCheckPermissions);
        clearInterval(this.timerLoadUnreadNotifications);
    }
}
