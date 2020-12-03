import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabEditComponent } from './collab-edit.component';

describe('CollabEditComponent', () => {
  let component: CollabEditComponent;
  let fixture: ComponentFixture<CollabEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
