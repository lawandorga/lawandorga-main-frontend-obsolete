import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationGroupsListComponent } from './notification-groups-list.component';

describe('NotificationsListComponent', () => {
    let component: NotificationGroupsListComponent;
    let fixture: ComponentFixture<NotificationGroupsListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [NotificationGroupsListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationGroupsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
