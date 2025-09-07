import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MeasurementUnitDialogComponent } from './measurement-unit-dialog/measurement-unit-dialog.component';
import { AppEnum } from '../enum/app-enum.enum';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import moment from 'moment-jalaali';
import { MeasurementUnitService } from '../services/measurement-unit.service';
import { MeasurementUnitModel } from '../models/measurement-unit.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-measurement-unit',
  standalone: true,
  imports: [CommonModule, AgGridModule, MatDialogModule],
  templateUrl: './measurement-unit.component.html',
  styleUrl: './measurement-unit.component.scss',
})
export class MeasurementUnitComponent implements OnInit {
  protected appEnum = AppEnum;

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
      },
    },
    {
      headerName: this.appEnum.CREATE_DATE,
      field: 'createdDate',
      valueFormatter: (params) =>
        moment(params.value).locale('fa').format('jYYYY/jMM/jDD'),
    },
    {
      headerName: this.appEnum.COMMODITY_MEASUREMENT_UNIT_TITLE,
      field: 'measurementUnitTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.MEASUREMENT_UNIT_CODE,
      field: 'measurementUnitCode',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
  ];

  rowData: MeasurementUnitModel[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  defaultColDef: ColDef = {
    filter: true,
  };
  isBrowser = false;
  private gridApi!: GridApi;
  constructor(
    private dialog: MatDialog,
    private measurementUnitService: MeasurementUnitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadData();
    }
  }

  protected addMeasurementUnit(): void {
    const dialogRef = this.dialog.open(MeasurementUnitDialogComponent, {
      data: {
        mode: 'create',
        record: null,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res);
        this.measurementUnitService
          .createGenerateCodeMeasurementUnit({
            measurementUnitTitle: res.measurementUnitTitle.value,
            measurementUnitCode: res.measurementUnitCode.value,
            createdDate: res.createDate.value,
          })
          .subscribe({
            next: (data) => {
              this.loadData();
            },
            error: (err) => {
              console.error('Error from API:', err);
            },
          });
      }
    });
  }
  // gridApi!: GridApi<MeasurementUnitModel>;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.loadData();
  }

  // constructor(private cdRef: ChangeDetectorRef, ...) { }

  loadData() {
    this.measurementUnitService.getMeasurementUnits().subscribe({
      next: (dataFromApi: MeasurementUnitModel[]) => {
        console.log('Fetched data:', dataFromApi);
        this.rowData = [...dataFromApi]; // ← spread operator باعث میشه grid تغییر رو بفهمه
        (this.gridApi as any)?.setRowData(this.rowData); // ← مستقیم داده رو به grid میدی
      },
      error: (err) => console.error(err),
    });
  }

  private editRow(params: ICellRendererParams): void {
    const dialogRef = this.dialog.open(MeasurementUnitDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        record: params,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result:', result);

      if (result) {
        this.measurementUnitService
          .updateMeasurementUnit(result.id.value, {
            measurementUnitTitle: result.measurementUnitTitle.value,
            createdDate: result.createDate.value,
          })
          .subscribe({
            next: (res) => {
              console.log('Update response:', res);
              this.loadData(); // اینجا باید صدا زده بشه
            },
            error: (err) => {
              console.error('Update error:', err);
            },
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
      if (!confirmed) return; // اگر کاربر لغو کرد، هیچ کاری انجام نشود

      // صدا زدن API حذف
      this.measurementUnitService
        .deleteMeasurementUnit(params.data.id)
        .subscribe({
          next: () => {
            // بعد از حذف موفق، دوباره داده‌ها از API گرفته می‌شود
            this.measurementUnitService.getMeasurementUnits().subscribe({
              next: (data) => {
                this.rowData = [...data]; // spread operator برای رندر مجدد جدول
              },
              error: (err) =>
                console.error('Error fetching updated data:', err),
            });
          },
          error: (err) => console.error('Error deleting record:', err),
        });
    });
  }
}
