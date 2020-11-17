import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeletionRequestsComponent } from './deletion-requests.component';

describe('DeletionRequestsComponent', () => {
  let component: DeletionRequestsComponent;
  let fixture: ComponentFixture<DeletionRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
