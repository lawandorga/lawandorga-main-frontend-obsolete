import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactTestComponent } from './react-test.component';

describe('ReactTestComponent', () => {
  let component: ReactTestComponent;
  let fixture: ComponentFixture<ReactTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
