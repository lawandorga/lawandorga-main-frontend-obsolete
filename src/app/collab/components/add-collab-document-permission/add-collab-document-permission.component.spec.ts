import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollabDocumentPermissionComponent } from './add-collab-document-permission.component';

describe('AddCollabDocumentPermissionComponent', () => {
  let component: AddCollabDocumentPermissionComponent;
  let fixture: ComponentFixture<AddCollabDocumentPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCollabDocumentPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCollabDocumentPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
