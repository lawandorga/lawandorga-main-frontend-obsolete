import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGroupsListComponent } from './notification-groups-list.component';

describe('NotificationsListComponent', () => {
    let component: NotificationGroupsListComponent;
    let fixture: ComponentFixture<NotificationGroupsListComponent>;

    beforeEach(async(() => {
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
