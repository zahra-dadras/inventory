import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../enum/app-enum.enum';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  protected appEnum = AppEnum;

  columnDefs: ColDef[] = [
    {
      headerName: this.appEnum.OPERATION,
      field: 'actions',
      cellRenderer: (params: ICellRendererParams) => {
        const container = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => this.editRow(params));
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => this.deleteRow(params));

        container.appendChild(editButton);
        container.appendChild(deleteButton);

        return container;
      }
    },
    { headerName: this.appEnum.STATUS, field: 'status', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.MEASUREMENT_UNIT, field: 'mesurementUnit', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_TYPE, field: 'commodityType', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_ENGLISH_TITLE, field: 'commodityEnglishTitle', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_PERSIAN_TITLE, field: 'commodityPersianTitle', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.COMMODITY_ID, field: 'commodityId', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true }
  ];


  constructor(
    private router: Router
  ) { }

  protected addProductBank() {
    this.router.navigate(['/product/detail'])
  }

  protected editRow(params: ICellRendererParams) {
    console.log('Edit row', params.data.commodityId);
  }

  protected deleteRow(params: ICellRendererParams) {
    console.log('Delete row', params);
  }

  rowData = [
    { commodityId: 0, commodityPersianTitle: 'انبار محصول', commodityEnglishTitle: "commodity1", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 1, commodityPersianTitle: 'انبار مواد مصرفی', commodityEnglishTitle: "commodity2", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 2, commodityPersianTitle: 'انبار مواد اولیه', commodityEnglishTitle: "commodity3", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 3, commodityPersianTitle: 'انبار نیمه ساخته', commodityEnglishTitle: "commodity4", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 4, commodityPersianTitle: '1انبار محصول', commodityEnglishTitle: "commodity5", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 5, commodityPersianTitle: '2انبار محصول', commodityEnglishTitle: "commodity6", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 6, commodityPersianTitle: '3انبار محصول', commodityEnglishTitle: "commodity7", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 7, commodityPersianTitle: '4انبار محصول', commodityEnglishTitle: "commodity8", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 8, commodityPersianTitle: '5انبار محصول', commodityEnglishTitle: "commodity9", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
    { commodityId: 9, commodityPersianTitle: '6انبار محصول', commodityEnglishTitle: "commodity10", commodityType: 'مواد اولیه', mesurementUnit: 'عدد', status: 'فعال' },
  ];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40
  };

  defaultColDef: ColDef = {
    filter: true
  };

  onClickButton(event: any) {
    console.log("Button clicked", event);
  }

  ngOnInit() { }
}
