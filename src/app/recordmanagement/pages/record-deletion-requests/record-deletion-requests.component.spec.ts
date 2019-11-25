import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDeletionRequestsComponent } from './record-deletion-requests.component';

describe('RecordDeletionRequestsComponent', () => {
  let component: RecordDeletionRequestsComponent;
  let fixture: ComponentFixture<RecordDeletionRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDeletionRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDeletionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
