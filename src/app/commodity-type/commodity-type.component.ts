import { Component } from '@angular/core';
import { AppEnum } from '../enum/app-enum.enum';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import moment from 'moment-jalaali';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommodityTypeDialogComponent } from './commodity-type-dialog/commodity-type-dialog.component';

@Component({
  selector: 'app-commodity-type',
  standalone: true,
  imports: [AgGridModule, MatDialogModule],
  templateUrl: './commodity-type.component.html',
  styleUrl: './commodity-type.component.scss'
})
export class CommodityTypeComponent {
  protected appEnum = AppEnum;

  // const nowJalali = moment().locale('fa').format('jYYYY/jMM/jDD');


  columnDefs: ColDef[] = [
    {
      headerName: this.appEnum.OPERATION,
      cellRenderer: (params: ICellRendererParams) => {
        const container = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => this.editRow(params));

        const delettButton = document.createElement('button');
        delettButton.innerText = 'Delete';
        delettButton.className = 'delete-btn';
        delettButton.addEventListener('click', () => this.deleteRow(params));

        container.appendChild(editButton);
        container.appendChild(delettButton);

        return container;
      }
    },
    {
      headerName: this.appEnum.CREATE_DATE,
      field: 'createDate',
      valueFormatter: (params) => moment(params.value).locale('fa').format('jYYYY/jMM/jDD')
    },
    {
      headerName: this.appEnum.COMMODITY_TYPE_TITLE,
      field: 'commodityTypeTitle',
      cellStyle: { textAlign: 'right' }, 
      flex: 1, 
      sortable: true, 
      filter: true
    },
    {
      headerName: this.appEnum.COMMODITY_TYPE_CODE,
      field: 'commodityTypeCode',
      cellStyle: { textAlign: 'right' }, 
      flex: 1, 
      sortable: true, 
      filter: true
    }
  ]

  rowData = [
    {createDate: '2025-04-30T10:15:00Z' , commodityTypeTitle: 'حبوبات', commodityTypeCode: 123},
    {createDate: '2025-04-30T10:15:00Z' , commodityTypeTitle: 'کنسرو', commodityTypeCode: 234},
    {createDate: '2025-04-30T10:15:00Z' , commodityTypeTitle: 'آرایشی و بهداشتی', commodityTypeCode: 456},
    {createDate: '2025-04-30T10:15:00Z' , commodityTypeTitle: 'ماکارونی', commodityTypeCode: 785},
    {createDate: '2025-04-30T10:15:00Z' , commodityTypeTitle: 'نوشیدنی', commodityTypeCode: 985},
  ]

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40
  };

  defaultColDef: ColDef = {
    filter: true
  };

  constructor(
    private dialog: MatDialog
  ) { }

  jalaliDateFormatter(params: any): string {
    if (!params.value) return '---';
    return moment(params.value).locale('fa').format('jYYYY/jMM/jDD');
  }

  private editRow(params: ICellRendererParams): void {

  }

  private deleteRow(params: ICellRendererParams): void {

  }
  protected addCommodityType(): void {
    const dialogRef = this.dialog.open( CommodityTypeDialogComponent, {
      // width: '450px',
      // height: '250px',
      // panelClass: 'custom-dialog-container',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    })

  }


}
