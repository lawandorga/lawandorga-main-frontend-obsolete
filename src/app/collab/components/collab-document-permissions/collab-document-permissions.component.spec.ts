import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabDocumentPermissionsComponent } from './collab-document-permissions.component';

describe('CollabDocumentPermissionsComponent', () => {
  let component: CollabDocumentPermissionsComponent;
  let fixture: ComponentFixture<CollabDocumentPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabDocumentPermissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabDocumentPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
