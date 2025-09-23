import { Component, Inject, OnInit } from '@angular/core';
import { AppEnum } from '../../enum/app-enum.enum';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment-jalaali';
import { CommonModule } from '@angular/common';
import { CommodityTypeService } from '../../services/commodity-type.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { PersianDatepickerComponent } from '../../persian-datepicker/persian-datepicker.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-commodity-type-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    PersianDatepickerComponent,
  ],
  templateUrl: './commodity-type-dialog.component.html',
  styleUrl: './commodity-type-dialog.component.scss',
})
export class CommodityTypeDialogComponent implements OnInit {
  protected mode: 'create' | 'edit' = 'create';
  protected appEnum = AppEnum;
  protected myForm!: FormGroup;
  protected showDatePicker = false;

  constructor(
    public dialogRef: MatDialogRef<CommodityTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private commodityTypeService: CommodityTypeService,
    private toastrService: ToastService
  ) {
    this.mode = data.mode;
  }
  ngOnInit(): void {
    this.myForm = this.fb.group({
      commodityTypeCode: [
        {
          value:
            this.mode === 'edit'
              ? this.data.record?.data.commodityTypeCode
              : '',
          disabled: true,
        },
        Validators.required,
      ],
      commodityTypeTitle: [
        this.mode === 'edit' ? this.data.record?.data.commodityTypeTitle : '',
        [Validators.required, Validators.minLength(3)],
      ],
      createDate: [
        this.mode === 'edit'
          ? moment(this.data.record?.data.createdDate).format('jYYYY/jMM/jDD')
          : '',
      ],
      id: [this.mode === 'edit' ? this.data.record?.data.id : null],
    });

    if (this.mode === 'create') {
      this.commodityTypeService.getGenerateCodingCommodityType().subscribe({
        next: (data) => {
          this.myForm.controls['commodityTypeCode'].setValue(
            data.commodity_code
          );
        },
        error: (err) => {
          this.toastrService.error(err.error);
        },
      });
    }
  }

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: string) {
    this.myForm.patchValue({ createDate: date });
    this.showDatePicker = false;
  }

  onConfirm(): void {
    if (this.myForm.valid) {
      this.dialogRef.close(this.myForm.controls);
    } else {
      this.toastrService.error('Form is not valid')
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
