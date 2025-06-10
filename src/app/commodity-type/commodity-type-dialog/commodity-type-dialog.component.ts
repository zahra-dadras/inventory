import { Component, Inject, OnInit } from '@angular/core';
import { AppEnum } from '../../enum/app-enum.enum';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductEditDialogComponent } from '../../product/product-edit-dialog/product-edit-dialog.component';
import moment from 'moment';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-commodity-type-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './commodity-type-dialog.component.html',
  styleUrl: './commodity-type-dialog.component.scss'
})
export class CommodityTypeDialogComponent implements OnInit {
   protected appEnum = AppEnum;
   isFormValid: boolean = false;
   myForm !: FormGroup;

   constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
   ) {
   
    
   }
  ngOnInit(): void {
    // moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });

    this.myForm = this.fb.group({
      commodityTypeCode: ['', Validators.required],
      commodityTypeTitle: ['', Validators.required],
      createDate: [moment().format('jYYYY/jMM/jDD')]
    })
  }



   onConfirm(): void {
    if (this.myForm.valid) {
      this.dialogRef.close(this.myForm.value);
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
