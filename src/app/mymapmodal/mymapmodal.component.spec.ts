import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MymapmodalComponent } from './mymapmodal.component';

describe('MymapmodalComponent', () => {
  let component: MymapmodalComponent;
  let fixture: ComponentFixture<MymapmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MymapmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MymapmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
