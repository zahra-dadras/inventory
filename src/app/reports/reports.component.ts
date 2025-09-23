import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AppEnum } from '../enum/app-enum.enum';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { CommodityModel } from '../models/commodity.model';
import { CommodityService } from '../services/commodity.service';
import { ToastService } from '../services/toast.service';
import { StoreroomModel } from '../models/storeroom.model';
import { StoreroomService } from '../services/storeroom.service';
import {
  CommodityStoreroomService,
  commodityStoreroomModel,
} from '../services/commodity-storeroom.service';
import { ColDef, GridApi, GridOptions, Theme } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { BlobOptions } from 'buffer';
import { ExportService } from '../services/export.service';
import { LucideAngularModule } from 'lucide-angular';
import {
  FileText,
  FileSpreadsheet
} from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, AgGridModule, LucideAngularModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  
  appEnum = AppEnum;
  protected myForm: FormGroup;
  protected commodityList: CommodityModel[] = [];
  protected storeroomList: StoreroomModel[] = [];
  protected isBrowser: boolean = false;
  FileSpreadsheet= FileSpreadsheet;
  FileText= FileText;
  columnDefs: ColDef[] = [
    {
      headerName: this.appEnum.VALUE,
      field: 'value',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_DOCUMENT_TYPE,
      field: 'documentType',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_DOCUMENT_TITLE,
      field: 'documentTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_DOCUMENT_CODE,
      field: 'documentCode',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM,
      field: 'storeroomTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
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

  protected gridApi!: GridApi;

  defaultColDef: ColDef = {
    filter: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  rowData: commodityStoreroomModel[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: () => 40,
  };

  constructor(
    private commodityService: CommodityService,
    private toastService: ToastService,
    private storeroomService: StoreroomService,
    private location: Location,
    private commodityStoreroomService: CommodityStoreroomService,
    private exportService: ExportService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.myForm = new FormGroup({
      commodityId: new FormControl(''),
      storeroomId: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.commodityService.getCommodityList().subscribe({
      next: (res) => {
        this.commodityList = res;
      },
      error: (err) => {
        this.toastService.error(err.error);
      },
    });

    this.storeroomService.getStoreroomList().subscribe({
      next: (res) => {
        this.storeroomList = res;
      },
      error: (err) => {
        this.toastService.error(err.error);
      },
    });
  }

  protected closePage() {
    this.location.back();
  }

  protected onSubmit() {
    this.commodityStoreroomService
      .getReports(
        this.myForm.controls['commodityId'].value,
        this.myForm.controls['storeroomId'].value
      )
      .subscribe({
        next: (res) => {
          this.rowData = res;
        },
        error: (err) => {
          this.toastService.error(err.error);
        },
      });
  }

  protected clearSelection(value: string) {
    if (value === 'commodityId') {
      this.myForm.controls['commodityId'].patchValue('');
    } else {
      this.myForm.controls['storeroomId'].patchValue('');
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
  protected exportPdf() {
    this.exportService
      .exportToPDF(this.rowData, 'گزارش-جدول', this.columnDefs)
      .subscribe((blob: Blob) => {
        this.downloadFile(blob, 'گزارش-جدول.pdf');
      });
  }
  
  protected exportExcel() {
    this.exportService
      .exportToExcel(this.rowData, 'گزارش-جدول', this.columnDefs)
      .subscribe((blob: Blob) => {
        this.downloadFile(blob, 'گزارش-جدول.xlsx');
      });
  }
  
}
