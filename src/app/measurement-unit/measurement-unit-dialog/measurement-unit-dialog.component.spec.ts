import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementUnitDialogComponent } from './measurement-unit-dialog.component';

describe('MeasurementUnitDialogComponent', () => {
  let component: MeasurementUnitDialogComponent;
  let fixture: ComponentFixture<MeasurementUnitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementUnitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeasurementUnitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
