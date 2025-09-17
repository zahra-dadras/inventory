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
import { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, AgGridModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  appEnum = AppEnum;
  protected myForm: FormGroup;
  protected commodityList: CommodityModel[] = [];
  protected storeroomList: StoreroomModel[] = [];
  protected isBrowser: boolean = false;

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
      headerName: this.appEnum.COMMODITY_ID,
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
    // this.loadData();
  }
  rowData: commodityStoreroomModel[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  constructor(
    private commodityService: CommodityService,
    private toastService: ToastService,
    private storeroomService: StoreroomService,
    private location: Location,
    private commodityStoreroomService: CommodityStoreroomService,
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

  clearSelection(value: string) {
    if (value === 'commodityId') {
      this.myForm.controls['commodityId'].patchValue('');
    } else {
      this.myForm.controls['storeroomId'].patchValue('');
    }
  }
}
