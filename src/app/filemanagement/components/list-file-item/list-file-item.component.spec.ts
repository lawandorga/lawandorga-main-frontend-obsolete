import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileItemComponent } from './list-file-item.component';

describe('ListFileItemComponent', () => {
  let component: ListFileItemComponent;
  let fixture: ComponentFixture<ListFileItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFileItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFileItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
