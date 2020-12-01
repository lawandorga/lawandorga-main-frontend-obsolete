import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabMainViewComponent } from './collab-main-view.component';

describe('CollabMainViewComponent', () => {
  let component: CollabMainViewComponent;
  let fixture: ComponentFixture<CollabMainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollabMainViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollabMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
