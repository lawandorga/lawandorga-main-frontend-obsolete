import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordPoolComponent } from './record-pool.component';

describe('RecordPoolComponent', () => {
  let component: RecordPoolComponent;
  let fixture: ComponentFixture<RecordPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
