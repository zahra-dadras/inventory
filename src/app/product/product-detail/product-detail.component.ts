import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppEnum } from '../../enum/app-enum.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductEditDialogComponent } from '../product-edit-dialog/product-edit-dialog.component';
import { ProductCommodityListComponent } from '../product-commodity-list/product-commodity-list.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ProductCommodityListComponent, MatDialogModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  myForm: FormGroup;
  protected appEnum = AppEnum;
  categories: any[] = []
  units: any[] = []
  statuses: string[] = []
  selectedFruit: string = '';
  childData: any;

  isFormValid: boolean = false;
  constructor(public dialog: MatDialog) {
    this.myForm = new FormGroup({
      productCode: new FormControl('', Validators.required),
      productPersianTitle: new FormControl('', Validators.required),
      productEnglishTitle: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      unitMeasurement: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }
  ngOnInit(): void {
    this.categories = [
      { "id": 1, "name": "Apple" },
      { "id": 2, "name": "Banana" },
      { "id": 3, "name": "Orange" },
      { "id": 4, "name": "Grape" }
    ];

    this.units = [
      { "id": 1, "name": "Apple" },
      { "id": 2, "name": "Banana" },
      { "id": 3, "name": "Orange" },
      { "id": 4, "name": "Grape" }
    ]

    this.statuses = ['فعال', 'غیرفعال']
  }

  onSubmit() {
    console.log(this.myForm)
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.isFormValid = true;
    } else {
      console.log('Form is not valid');
      this.isFormValid = false;
    }

  }

  storeroomDialog(data: any) {

    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.childData = result
      }
    })
  }

  closePage() { }
}
