import { Component } from '@angular/core';
import { AppEnum } from '../enum/app-enum.enum';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ClientSideRowModelModule, ColDef, GridOptions, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { Router } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
  protected appEnum = AppEnum;
  protected rowData: any[] = [];

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
        container.appendChild(deleteButton)

        return container
      }
    },
    {
      headerName: this.appEnum.STATUS,
      field: 'status',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      headerName: this.appEnum.STOREROOM_MANAGER,
      field: 'storeroomManager',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      headerName: this.appEnum.STOREROOM_TYPE,
      field: 'storeroomType',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      headerName: this.appEnum.STOREROOM_TITLE,
      field: 'storeroomTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      headerName: this.appEnum.STOREROOM_ID,
      field: 'storeroomId',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true
    }
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.rowData = [
      { storeroomId: 1, storeroomTitle: 'انبار محصول', storeroomType: '150', storeroomManager: 'زهرا دادرس', status: 'فعال' },
      { storeroomId: 2, storeroomTitle: 'انبار مواد اولیه', storeroomType: '1570', storeroomManager: 'زهرا دادرس', status: 'فعال' },
      { storeroomId: 3, storeroomTitle: 'انبار مواد مصرفی', storeroomType: '785', storeroomManager: 'زهرا دادرس', status: 'فعال' },
      { storeroomId: 4, storeroomTitle: 'انبار نیمه ساخته', storeroomType: '456', storeroomManager: 'زهرا دادرس', status: 'فعال' }
    ]
  }

  private editRow(params: ICellRendererParams) {
    console.log(params)
  }

  private deleteRow(params: ICellRendererParams) {
    console.log(params)
  }

  protected addStoreroom(): void {
    this.router.navigate(['/warehouse/detail'])
  }

}
