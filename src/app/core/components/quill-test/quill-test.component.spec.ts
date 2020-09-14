import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuillTestComponent } from './quill-test.component';

describe('QuillTestComponent', () => {
  let component: QuillTestComponent;
  let fixture: ComponentFixture<QuillTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuillTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuillTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
