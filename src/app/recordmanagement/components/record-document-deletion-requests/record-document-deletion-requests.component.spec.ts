import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDocumentDeletionRequestsComponent } from './record-document-deletion-requests.component';

describe('RecordDocumentDeletionRequestsComponent', () => {
  let component: RecordDocumentDeletionRequestsComponent;
  let fixture: ComponentFixture<RecordDocumentDeletionRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDocumentDeletionRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDocumentDeletionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
