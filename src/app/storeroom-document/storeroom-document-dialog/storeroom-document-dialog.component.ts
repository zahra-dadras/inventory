import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AppEnum } from '../../enum/app-enum.enum';
import { CommodityService } from '../../services/commodity.service';
import { CommodityModel } from '../../models/commodity.model';
import { CommodityStoreroomService } from '../../services/commodity-storeroom.service';
import { MeasurementUnitModel } from '../../models/measurement-unit.model';
import { MeasurementUnitService } from '../../services/measurement-unit.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-storeroom-document-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './storeroom-document-dialog.component.html',
  styleUrl: './storeroom-document-dialog.component.scss',
})
export class StoreroomDocumentDialogComponent {
  protected myForm: FormGroup;
  protected appEnum = AppEnum;
  protected commodityList: CommodityModel[] = [];
  protected measurementUnitList: MeasurementUnitModel[] = [];

  constructor(
    private commodityService: CommodityService,
    private commodityStoreroomService: CommodityStoreroomService,
    private measurementUnitService: MeasurementUnitService,
    private toastrService: ToastService,
    public dialogRef: MatDialogRef<StoreroomDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myForm = new FormGroup({
      commodityId: new FormControl('', Validators.required),
      commodityCode: new FormControl({ value: '', disabled: true }),
      measurementUnitId: new FormControl({ value: '', disabled: true }),
      value: new FormControl('', Validators.required),
      //  storeroomId: new FormControl(0),
    });
  }
  ngOnInit(): void {
    this.commodityService.getCommodityList().subscribe({
      next: (res) => {
        this.commodityList = res;
      },
      error: (err) => {
        this.toastrService.error(err.error);
      },
    });

    this.measurementUnitService.getMeasurementUnits().subscribe({
      next: (res) => {
        this.measurementUnitList = res;
      },
      error: (err) => {
        this.toastrService.error(err.error);
      },
    });
    this.myForm.get('commodityId')?.valueChanges.subscribe((value) => {
      const selected = this.commodityList.find((x) => x.id === value);
      if (selected) {
        this.myForm.patchValue({
          commodityCode: selected.commodityCode,
          measurementUnitId: selected.measurementUnitTitle,
        });
      }
    });

    if (this.data.mode === 'edit') {
      this.myForm.patchValue({
        commodityId: this.data.rowData.commodityId,
        commodityCode: this.data.rowData.commodityCode,
        measurementUnitId: this.data.rowData.measurementUnitTitle,
        // storeroomPersianTitle: this.data.rowData.storeroomPersianTitle,
        // storeroomId: this.data.rowData.id,
      });
    }
  }

  onConfirm(): void {
    const payload = {
      commodityId: this.myForm.controls['commodityId'].value,
      storeroomId: this.data.storeroomId,
      value: this.myForm.controls['value'].value,
    };
    if (this.data.mode === 'create') {
      this.commodityStoreroomService
        .createCommodityStoreroom(payload)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(this.data.id);
          },
          error: (err) => {
            this.toastrService.error(err.error);
          },
        });
    } else {
      this.commodityStoreroomService
        .updateCommodityStoreroom(this.data.rowData.id, payload)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(this.data.commodityId);
          },
          error: (err) => {
            this.toastrService.error(err.error);
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
