import { Component, Inject, OnInit } from '@angular/core';
import { AppEnum } from '../../enum/app-enum.enum';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment-jalaali';
import { MeasurementUnitService } from '../../services/measurement-unit.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PersianDatepickerComponent } from '../../persian-datepicker/persian-datepicker.component';

@Component({
  selector: 'app-measurement-unit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    PersianDatepickerComponent,
  ],
  templateUrl: './measurement-unit-dialog.component.html',
  styleUrl: './measurement-unit-dialog.component.scss',
})
export class MeasurementUnitDialogComponent implements OnInit {
  protected mode: 'create' | 'edit' = 'create';
  protected appEnum = AppEnum;
  protected isFormValid: boolean = false;
  protected myForm!: FormGroup;
  protected showDatePicker = false;

  constructor(
    public dialogRef: MatDialogRef<MeasurementUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private measurementUnitService: MeasurementUnitService
  ) {
    this.mode = data.mode;
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      measurementUnitCode: [
        {
          value:
            this.mode === 'edit'
              ? this.data.record.data.measurementUnitCode
              : '',
          disabled: true,
        },
        Validators.required,
      ],
      measurementUnitTitle: [
        this.mode === 'edit' ? this.data.record.data.measurementUnitTitle : '',
        Validators.required,
      ],
      createDate: [
        this.mode === 'edit'
          ? moment(this.data.record?.data.createdDate).format('jYYYY/jMM/jDD')
          : '',
      ],
      id: [this.mode === 'edit' ? this.data.record?.data.id : null],
    });

    if (this.mode === 'create') {
      this.measurementUnitService.getGenerateCodeMeasurementUnit().subscribe({
        next: (data) => {
          this.myForm.controls['measurementUnitCode'].setValue(
            data.measurement_unit_code
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }
  onDateSelected(date: string) {
    // تاریخ انتخاب‌شده از تقویم میاد (Jalali)
    this.myForm.patchValue({ createDate: date });
    this.showDatePicker = false; // تقویم بسته میشه
  }
  onConfirm(): void {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      console.log('Form Data to Send:', formData);
      const gregorianDate = moment(formData.createDate, 'jYYYY/jMM/jDD').format(
        'YYYY-MM-DD'
      );
      console.log('Gregorian to DB:', gregorianDate);
      this.dialogRef.close(this.myForm.controls);
      this.isFormValid = true;
    } else {
      console.log('Form is not valid');
      this.isFormValid = false;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
