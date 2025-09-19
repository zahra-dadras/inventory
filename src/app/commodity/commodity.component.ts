import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../enum/app-enum.enum';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { CommodityService } from '../services/commodity.service';
import { CommodityModel } from '../models/commodity.model';
import moment from 'moment-jalaali';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-commodity',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule,
  ],
  templateUrl: './commodity.component.html',
  styleUrl: './commodity.component.scss',
})
export class CommodityComponent implements OnInit {
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
      },
    },
    {
      headerName: this.appEnum.CREATE_DATE,
      field: 'createDate',
      valueFormatter: (params) =>
        moment(params.value).locale('fa').format('jYYYY/jMM/jDD'),
    },
    {
      headerName: this.appEnum.MEASUREMENT_UNIT,
      field: 'measurementUnitTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.COMMODITY_TYPE,
      field: 'commodityTypeTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.COMMODITY_ENGLISH_TITLE,
      field: 'commodityEnglishTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.COMMODITY_PERSIAN_TITLE,
      field: 'commodityPersianTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.COMMODITY_CODE,
      field: 'commodityCode',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
  ];

  gridApi!: any;

  defaultColDef: ColDef = {
    filter: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.loadData();
  }
  rowData: CommodityModel[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  isBrowser = false;

  constructor(
    private router: Router,
    private commodityService: CommodityService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadData() {
    this.commodityService.getCommodityList().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.rowData = [...data];
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
          this.cdr.detectChanges(); 
        });
      },
      error: (err) => this.toastService.error(err.error.message),
    });
  }

  protected addCommodity() {
    this.router.navigate(['/commodity/detail']);
  }

  protected editRow(params: ICellRendererParams) {
    this.router.navigate(['/commodity/edit', params.data.id]);
  }

  protected deleteRow(params: ICellRendererParams) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'تایید حذف',
        message: 'آیا مطمئن هستید که می‌خواهید این رکورد را حذف کنید؟',
        confirmText: 'حذف',
        cancelText: 'لغو',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.commodityService.deleteStoreroom(params.data.id).subscribe({
        next: () => {
          this.loadData();
          this.toastService.success('با موفقیت حذف شد');
        },
        error: (err) => this.toastService.error(err.error),
      });
    });
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadData();
    }
  }
}
