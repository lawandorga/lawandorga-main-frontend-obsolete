import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { NOTIFICATIONS_API_URL } from '../../../statics/api_urls.statics';
import { HttpClient } from '@angular/common/http';
import { NotificationGroup } from '../../models/notification_group.model';
import { CoreSandboxService } from '../../services/core-sandbox.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent implements OnInit {
  columns = [];

  @Input()
  notificationGroup: NotificationGroup;

  constructor(private httpClient: HttpClient, private coreSB: CoreSandboxService) {}

  ngOnInit() {
    this.columns = ['read1', 'created1', 'text1'];
  }

  onReadClick(notification: Notification): void {
    const toPost = {
      read: !notification.read,
    };
    this.httpClient.patch(`${NOTIFICATIONS_API_URL}${notification.id}/`, toPost).subscribe((response) => {
      notification.read = !notification.read;
      if (!notification.read && this.notificationGroup.read) {
        this.notificationGroup.read = false;
      } else {
        for (const current_notification of this.notificationGroup.notifications) {
          if (!current_notification.read) {
            return;
          }
        }
        this.notificationGroup.read = true;
        this.coreSB.decrementNotificationCounter();
      }
    });
  }
}
