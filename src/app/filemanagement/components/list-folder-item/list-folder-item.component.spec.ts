import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFolderItemComponent } from './list-folder-item.component';

describe('ListFolderItemComponent', () => {
  let component: ListFolderItemComponent;
  let fixture: ComponentFixture<ListFolderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFolderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFolderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
