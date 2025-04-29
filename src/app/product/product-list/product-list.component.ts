import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../../enum/app-enum.enum';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-commodity-list',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Output() editStoreroom = new EventEmitter<any>();
  @Input() storeroomDialogData: any;

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
        editButton.addEventListener('click', () => this.editRoww(params));

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => this.deleteRoww(params));

        container.appendChild(editButton);
        container.appendChild(deleteButton);

        return container;
      }
    },
    { headerName: this.appEnum.STOREROOM_TYPE, field: 'storeroomType', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.STOREROOM_MANAGER, field: 'storeroomManager', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.STOREROOM_ID, field: 'storeroomId', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
    { headerName: this.appEnum.STOREROOM_TITLE, field: 'storeroomTitle', cellStyle: { textAlign: 'right' }, flex: 1, sortable: true, filter: true },
  ];


  constructor(
    private router: Router,
    public dialog: MatDialog
  ) { }

  protected addProductBank() {

    this.editStoreroom.emit(null);

  }

  protected editRoww(params: ICellRendererParams) {
    console.log('Edit row', params);
    this.editStoreroom.emit(params.data)
  }

  protected deleteRoww(params: ICellRendererParams) {
    console.log('Delete row', params);
  }

  rowData = [
    { storeroomTitle: 'انبار محصول شماره 1', storeroomId: 1234, storeroomManager: 'زهرا', storeroomType: 'محصول' },
    { storeroomTitle: 'انبار محصول شماره 2', storeroomId: 54321, storeroomManager: 'مرجان', storeroomType: 'نیمه ساخته' }
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

  onClickButton(event: any) {
    console.log("Button clicked", event);
  }

  ngOnInit() { }

  editRow(params: ICellRendererParams) {
    const rowNode = params.node;
    const rowIndex = rowNode.rowIndex;

    rowNode.setDataValue('name', `<input value="${rowNode.data.name}" />`);
    rowNode.setDataValue('age', `<input value="${rowNode.data.age}" />`);
    rowNode.setDataValue('email', `<input value="${rowNode.data.email}" />`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.storeroomDialogData)
  }
}
