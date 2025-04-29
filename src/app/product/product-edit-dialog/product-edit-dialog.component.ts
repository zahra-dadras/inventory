import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppEnum } from '../../enum/app-enum.enum';

@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './product-edit-dialog.component.html',
  styleUrl: './product-edit-dialog.component.scss'
})
export class ProductEditDialogComponent {
  myForm: FormGroup;
  protected appEnum = AppEnum;
  categories: any[] = []
  storeroomTitles: any[] = []
  statuses: string[] = []
  selectedFruit: string = '';

  isFormValid: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myForm = new FormGroup({
      storeroomTitle: new FormControl('', Validators.required),
      storeroomId: new FormControl('', Validators.required),
      storeroomManager: new FormControl('', Validators.required),
      storeroomType: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {

    this.storeroomTitles = [
      { "id": 1, "name": "storeroomTitle1" },
      { "id": 2, "name": "storeroomTitle2" },
      { "id": 3, "name": "storeroomTitle3" },
      { "id": 4, "name": "storeroomTitle4" }
    ]

    if (this.data) {
      console.log(this.data)
      this.myForm.setValue(this.data)
    }
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
