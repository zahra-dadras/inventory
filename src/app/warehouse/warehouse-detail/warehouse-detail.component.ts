import { CommonModule, NgFor, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../../enum/app-enum.enum';
import { ColDef, GridOptions } from 'ag-grid-community';
import { StoreroomService } from '../../services/storeroom.service';
import { StoreroomTypeModel } from '../../models/storeroom-type.model';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PersianDatepickerComponent } from '../../persian-datepicker/persian-datepicker.component';
import moment from 'moment-jalaali';
import { Location } from '@angular/common';
import { CommodityStoreroomService } from '../../services/commodity-storeroom.service';

@Component({
  selector: 'app-warehouse-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgFor,
    AgGridModule,
    MatDatepickerModule,
    PersianDatepickerComponent,
  ],
  templateUrl: './warehouse-detail.component.html',
  styleUrl: './warehouse-detail.component.scss',
})
export class WarehouseDetailComponent {
  myForm: FormGroup;
  protected appEnum = AppEnum;
  protected statuses: string[] = [];
  protected storeroomTypes: StoreroomTypeModel[] = [];
  showDatePicker = false;

  columnDefs: ColDef[] = [
    {
      headerName: this.appEnum.INVENTORY,
      field: 'inventory',
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

  rowData: any[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  defaultColDef: ColDef = {
    filter: true,
  };

  gridApi!: any;

  onGridReady(params: any) {
    this.gridApi = params.api;
    // this.loadData();
  }

  isBrowser = false;
  mode: 'create' | 'edit' = 'create';
  constructor(
    private storeroomService: StoreroomService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private location: Location,
    private commodityStoreroomService: CommodityStoreroomService
  ) {
    this.myForm = new FormGroup({
      storeroomTitle: new FormControl('', Validators.required),
      storeroomCode: new FormControl(
        {
          value: '',
          disabled: true,
        },
        Validators.required
      ),
      // status: new FormControl(''),
      storeroomTypeId: new FormControl('', Validators.required),
      storeroomChairman: new FormControl('', Validators.required),
      minTemperature: new FormControl(''),
      maxTemperature: new FormControl(''),
      minHumidity: new FormControl(''),
      maxHumidity: new FormControl(''),
      createDate: new FormControl(''),
      id: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      // this.loadData();
      this.statuses = ['فعال', 'غیرفعال'];
      // this.storeroomTypes = ['نوع انبار1', 'نوع انبار2', 'نوع انبار3'];
      this.storeroomService.getStoreroomTypeList().subscribe({
        next: (res) => {
          this.storeroomTypes = res;
        },
        error: (err) => {
          console.log(err);
        },
      });

      if (this.route.snapshot.paramMap.has('id')) {
        this.mode = 'edit';
        this.storeroomService
          .getStoreroomById(Number(this.route.snapshot.paramMap.get('id')))
          .subscribe({
            next: (res) => {
              const patchedData = {
                ...res,
                // تبدیل تاریخ میلادی به شمسی
                createDate: res.createDate
                  ? moment(res.createDate).locale('fa').format('jYYYY/jMM/jDD')
                  : null,
              };
              this.myForm.patchValue(patchedData);
              this.commodityStoreroomService
                .getCommodityStoreroomByStoreroomId(res.id ? res.id : 0)
                .subscribe({
                  next: (res) => {
                    this.rowData = res;
                  },
                  error: (err) => {},
                });
            },
            error: (error) => {},
          });
        // TODO: گرفتن دیتای رکورد از API
        // this.service.getById(this.id).subscribe(res => this.formData = res);
        console.log(this.myForm.value.id);
      } else {
        this.mode = 'create';
        this.storeroomService.getGenerateCodeStoreroom().subscribe({
          next: (res) => {
            this.myForm.patchValue({ storeroomCode: res.storeroomCode });
          },
          error: (error) => {},
        });
      }
    }
  }

  protected closePage() {
    this.location.back();
  }

  private getStoreroomTypeById(id: number) {
    this.storeroomService.getStoreroomTypeById(id).subscribe({
      next: (res) => {
        this.myForm.controls['storeroomType'].setValue(res);
        console.log(this.myForm);
      },
    });
  }

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: string) {
    // تاریخ انتخاب‌شده از تقویم میاد (Jalali)
    this.myForm.patchValue({ createDate: date });
    this.showDatePicker = false; // تقویم بسته میشه
  }

  protected save() {
    let form = this.myForm.controls;
    if (this.mode === 'create') {
      console.log(this.myForm.controls['createDate'].value);

      this.storeroomService
        .createStoreroom({
          storeroomTitle: this.myForm.value.storeroomTitle,
          storeroomCode: this.myForm.controls['storeroomCode'].value,
          storeroomChairman: this.myForm.value.storeroomChairman,
          createDate: form['createDate'].value,
          maxTemperature: Number(this.myForm.value.maxTemperature),
          minTemperature: Number(this.myForm.value.minTemperature),
          maxHumidity: Number(this.myForm.value.maxHumidity),
          minHumidity: Number(this.myForm.value.minHumidity),
          storeroomTypeId: Number(this.myForm.value.storeroomTypeId),
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this.mode = 'edit';
          },
          error: (err) => {},
        });
    } else {
      console.log(this.myForm);
      this.storeroomService
        .updateStoreroom(Number(this.myForm.value.id), {
          storeroomTitle: this.myForm.value.storeroomTitle,
          storeroomCode: this.myForm.controls['storeroomCode'].value,
          storeroomChairman: this.myForm.value.storeroomChairman,
          createDate: form['createDate'].value,
          maxTemperature: Number(this.myForm.value.maxTemperature),
          minTemperature: Number(this.myForm.value.minTemperature),
          maxHumidity: Number(this.myForm.value.maxHumidity),
          minHumidity: Number(this.myForm.value.minHumidity),
          storeroomTypeId: Number(this.myForm.value.storeroomTypeId),
        })
        .subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {},
        });
    }
  }
}
