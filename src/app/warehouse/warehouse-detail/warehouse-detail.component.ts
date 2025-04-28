import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../../enum/app-enum.enum';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgFor, AgGridModule],
  templateUrl: './warehouse-detail.component.html',
  styleUrl: './warehouse-detail.component.scss'
})
export class WarehouseDetailComponent {
  myForm: FormGroup;
  protected appEnum = AppEnum;
  protected statuses: string[] = [];
  protected storeroomTypes: string[] = [];

  columnDefs: ColDef[] = [

    { headerName: this.appEnum.INVENTORY, field: 'inventory', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_ENGLISH_TITLE, field: 'commodityEnglishTitle', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_PERSIAN_TITLE, field: 'commodityPersianTitle', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_ID, field: 'commodityId', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true }
  ];

  rowData = [
    { commodityId: 11, commodityPersianTitle: "محصول 1", commodityEnglishTitle: 'product1', inventory: 2 },
    { commodityId: 12, commodityPersianTitle: "محصول 2", commodityEnglishTitle: 'product2', inventory: 2 }
  ];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40 
  };

  defaultColDef: ColDef = {
    filter: true,
  };

  constructor() {
    this.myForm = new FormGroup({
      storeroomTitle: new FormControl('', Validators.required),
      storeroomId: new FormControl('', Validators.required),
      status: new FormControl(''),
      storeroomType: new FormControl('', Validators.required),
      manager: new FormControl(''),
      minTemperature: new FormControl(''),
      maxTemperature: new FormControl(''),
      minHumidity: new FormControl(''),
      maxHumidity: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.statuses = ['فعال', 'غیرفعال'];
    this.storeroomTypes = ['نوع انبار1', 'نوع انبار2', 'نوع انبار3']
  }

  protected closePage() { }
}
