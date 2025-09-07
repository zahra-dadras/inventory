import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { AppEnum } from '../enum/app-enum.enum';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import moment from 'moment-jalaali';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommodityTypeDialogComponent } from './commodity-type-dialog/commodity-type-dialog.component';
import { CommodityTypeService } from '../services/commodity-type.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CommodityTypeModel } from '../models/commodity-type.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-commodity-type',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatDialogModule],
  templateUrl: './commodity-type.component.html',
  styleUrl: './commodity-type.component.scss',
})
export class CommodityTypeComponent implements OnInit {
  protected appEnum = AppEnum;

  protected rowData: CommodityTypeModel[] = [];

  columnDefs: ColDef[] = [
    {
      headerName: this.appEnum.OPERATION,
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
      field: 'createdDate',
      valueFormatter: (params) =>
        moment(params.value).locale('fa').format('jYYYY/jMM/jDD'),
    },
    {
      headerName: this.appEnum.COMMODITY_TYPE_TITLE,
      field: 'commodityTypeTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.COMMODITY_TYPE_CODE,
      field: 'commodityTypeCode',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
  ];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: () => 40,
  };
  gridApi!: any;

  defaultColDef: ColDef = {
    filter: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.loadData();
  }

  isBrowser = false;

  constructor(
    private dialog: MatDialog,
    private commodityTypeService: CommodityTypeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadData();
    }
  }

  private editRow(params: ICellRendererParams): void {
    const dialogRef = this.dialog.open(CommodityTypeDialogComponent, {
      data: {
        mode: 'edit',
        record: params,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commodityTypeService
          .updateCommodityType(result.id.value, {
            commodityTypeTitle: result.commodityTypeTitle.value,
            createdDate: result.createDate.value,
          })
          .subscribe({
            next: () => this.loadData(),
            error: (err) => console.log(err),
          });
      }
    });
  }

  private deleteRow(params: ICellRendererParams): void {
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

      this.commodityTypeService.deleteCommodityType(params.data.id).subscribe({
        next: () => this.loadData(),
        error: (err) => console.error('Error deleting record:', err),
      });
    });
  }

  loadData() {
    this.commodityTypeService.getCommodityTypes().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.rowData = [...data];
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
          this.cdr.detectChanges(); // 👈 اجباراً رندر می‌کنه
        });
      },
      error: (err) => console.error('Error from API:', err),
    });
  }

  protected addCommodityType(): void {
    const dialogRef = this.dialog.open(CommodityTypeDialogComponent, {
      data: {
        mode: 'create',
        record: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commodityTypeService
          .createCommodityType({
            commodityTypeTitle: result.commodityTypeTitle.value,
            commodityTypeCode: result.commodityTypeCode.value,
            createdDate: result.createDate.value,
          })
          .subscribe({
            next: () => this.loadData(),
            error: (err) => console.error('Error from API:', err),
          });
      }
    });
  }
}
