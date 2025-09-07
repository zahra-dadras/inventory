import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersianDatepickerComponent } from './persian-datepicker.component';

describe('PersianDatepickerComponent', () => {
  let component: PersianDatepickerComponent;
  let fixture: ComponentFixture<PersianDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersianDatepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersianDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
