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
import { StoreroomService } from '../../services/storeroom.service';
import { StoreroomModel } from '../../models/storeroom.model';
import { CommodityStoreroomService } from '../../services/commodity-storeroom.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-commodity-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './commodity-edit-dialog.component.html',
  styleUrl: './commodity-edit-dialog.component.scss',
})
export class CommodityEditDialogComponent {
  protected myForm: FormGroup;
  protected appEnum = AppEnum;
  protected storeroomList: StoreroomModel[] = [];

  constructor(
    private storeroomService: StoreroomService,
    public dialogRef: MatDialogRef<CommodityEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commodityStoreroomService: CommodityStoreroomService,
    private toastService: ToastService
  ) {
    this.myForm = new FormGroup({
      storeroomTitle: new FormControl('', Validators.required),
      storeroomChairman: new FormControl({ value: '', disabled: true }),
      storeroomPersianTitle: new FormControl({ value: '', disabled: true }),
      value: new FormControl('', Validators.required),
      storeroomId: new FormControl(0),
    });
  }
  ngOnInit(): void {
    this.storeroomService.getStoreroomList().subscribe({
      next: (res) => {
        this.storeroomList = res;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });

    this.myForm.get('storeroomTitle')?.valueChanges.subscribe((value) => {
      const selected = this.storeroomList.find((x) => x.id === value);
      if (selected) {
        this.myForm.patchValue({
          storeroomCode: selected.storeroomCode,
          storeroomChairman: selected.storeroomChairman,
          storeroomPersianTitle: selected.storeroomTypePersianTitle,
          storeroomId: selected.id,
        });
      }
    });

    if (this.data.mode === 'edit') {
      this.myForm.patchValue({
        storeroomTitle: this.data.rowData.storeroomId,
        storeroomCode: this.data.rowData.storeroomCode,
        storeroomChairman: this.data.rowData.storeroomChairman,
        storeroomPersianTitle: this.data.rowData.storeroomPersianTitle,
        storeroomId: this.data.rowData.storeroomId,
        value: this.data.rowData.value
      });
    }
  }

  onConfirm(): void {
    const payload = {
      commodityId: this.data.commodityId,
      storeroomId: this.myForm.controls['storeroomId'].value,
      value: this.myForm.controls['value'].value,
      storeroomDocumentId: null
    };
    if (this.data.mode === 'create') {
      this.commodityStoreroomService
        .createCommodityStoreroom(payload)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(this.data.id);
            this.toastService.success('با موفقیت ایجاد شد');
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          },
        });
    } else {
      this.commodityStoreroomService
        .updateCommodityStoreroom(this.data.rowData.id, payload)
        .subscribe({
          next: (res) => {
            this.dialogRef.close(this.data.commodityId);
            this.toastService.success('با موفقیت ویرایش شد');
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          },
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
