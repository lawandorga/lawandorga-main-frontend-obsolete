import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathInformationComponent } from './path-information.component';

describe('PathInformationComponent', () => {
  let component: PathInformationComponent;
  let fixture: ComponentFixture<PathInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
