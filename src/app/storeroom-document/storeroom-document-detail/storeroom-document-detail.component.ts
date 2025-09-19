import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { StoreroomDocumentModel } from '../../models/storeroom-document.model';
import { AppEnum } from '../../enum/app-enum.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { StoreroomDocumentService } from '../../services/storeroom-document.service';
import moment from 'moment-jalaali';
import { StoreroomService } from '../../services/storeroom.service';
import { StoreroomModel } from '../../models/storeroom.model';
import { Location } from '@angular/common';
import { PersianDatepickerComponent } from '../../persian-datepicker/persian-datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CommodityStoreroomService } from '../../services/commodity-storeroom.service';
import { StoreroomDocumentDialogComponent } from '../storeroom-document-dialog/storeroom-document-dialog.component';
import { InventoryModel } from '../../models/inventory.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-storeroom-document-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    PersianDatepickerComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule,
  ],
  templateUrl: './storeroom-document-detail.component.html',
  styleUrl: './storeroom-document-detail.component.scss',
})
export class StoreroomDocumentDetailComponent {
  protected myForm: FormGroup;
  protected appEnum = AppEnum;
  protected storeroomList: StoreroomModel[] = [];
  protected documentTypeList = [{ value: 'ورود' }, { value: 'خروج' }];
  protected mode: 'create' | 'edit' = 'create';
  protected showDatePicker: boolean = false;
  protected isBrowser = false;
  protected rowData: InventoryModel[] = []; 

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
      headerName: this.appEnum.VALUE,
      field: 'value',
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
      headerName: this.appEnum.COMMODITY_CODE,
      field: 'commodityCode',
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
  ];

  gridApi!: any;

  defaultColDef: ColDef = {
    filter: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private location: Location,
    private storeroomDocumentService: StoreroomDocumentService,
    private commodityStoreroomService: CommodityStoreroomService,
    private storeroomService: StoreroomService,
    private toastrService: ToastService
  ) {
    this.myForm = new FormGroup({
      documentCode: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      documentTitle: new FormControl('', Validators.required),
      documentType: new FormControl('', Validators.required),
      documentDate: new FormControl(''),
      storeroomId: new FormControl('', Validators.required),
      deliverer: new FormControl(''),
      reciever: new FormControl(''),
      id: new FormControl(0),
    });
  }
  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.storeroomService.getStoreroomList().subscribe({
      next: (res) => {
        this.storeroomList = res;
      },
      error: (err) => {
        this.toastrService.error(err.error.message);
      },
    });

    if (this.route.snapshot.paramMap.has('id')) {
      this.mode = 'edit';
      this.storeroomDocumentService
        .getStoreroomDocumentyById(
          Number(this.route.snapshot.paramMap.get('id'))
        )
        .subscribe({
          next: (res) => {
            if (res.id) {
              const patchedData = {
                ...res,
                documentDate: res.documentDate
                  ? moment(res.documentDate)
                      .locale('fa')
                      .format('jYYYY/jMM/jDD')
                  : null,
              };
              this.myForm.patchValue(patchedData);

              if (this.isBrowser) {
                this.loadData(res.id);
              }
            }
          },
          error: (err) => {
            this.toastrService.error(err.error.message);
          },
        });
    } else {
      this.mode = 'create';

      this.storeroomDocumentService.generateCodeStoreroomDocument().subscribe({
        next: (res) => {
          this.myForm.controls['documentCode'].patchValue(
            res.storeroomDocumentCode
          );
        },
        error: (err) => {
          this.toastrService.error(err.error.message);
        },
      });
    }
  }

  onSubmit() {
    let form = this.myForm.controls;
    const payload = {
      documentDate: form['documentDate'].value,
      documentTitle: form['documentTitle'].value,
      documentType: form['documentType'].value,
      storeroomId: Number(form['storeroomId'].value),
      reciever: form['reciever'].value,
      deliverer: form['deliverer'].value,
    };
    if (this.mode === 'create') {
      this.storeroomDocumentService
        .createStoreroomDocument({
          ...payload,
          documentCode: form['documentCode'].value,
        })
        .subscribe({
          next: (res) => {
            this.mode = 'edit';
            this.myForm.controls['id'].patchValue(res);
            this.loadData(this.myForm.controls['id'].value);
            this.toastrService.success('سند انبار با موفقیت ایجاد شد');
          },
          error: (err) => {
            this.toastrService.error(err.error.message);
          },
        });
    } else {
      this.storeroomDocumentService
        .updateStoreroomDocument(this.myForm.controls['id'].value, payload)
        .subscribe({
          next: (res) => {
            this.loadData(this.myForm.controls['id'].value);
            this.toastrService.success('سند انبار با موفقیت ویرایش شد');
          },
          error: (err) => {
            this.toastrService.error(err.error.message);
          },
        });
    }
  }

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: string) {
    this.myForm.patchValue({ documentDate: date });
    this.showDatePicker = false;
  }

  protected addCommodityBank() {
    const data = {
      storeroomId: this.myForm.controls['storeroomId'].value,
      mode: 'create',
      storeroomDocumentId: this.myForm.controls['id'].value
    };
    const dialogRef = this.dialog.open(StoreroomDocumentDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const id = this.myForm.controls['id'].value;
      this.loadData(id);
      this.toastrService.success('تخصیص انبار به کالا با موفقیت ایجاد شد.');
    });
  }

  protected editRow(params: ICellRendererParams) {
    const data = {
      rowData: params.data,
      storeroomId: this.myForm.controls['storeroomId'].value,
      storeroomDocumentId: this.myForm.controls['id'].value,
      mode: 'edit',
    };
    const dialogRef = this.dialog.open(StoreroomDocumentDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const id = this.myForm.controls['id'].value;
      this.loadData(id);
      this.toastrService.success(
        'جدول تخصیص انبار به کالا با موفقیت ویرایش شد'
      );
    });
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

      this.commodityStoreroomService
        .deleteCommodityStoreroom(params.data.id)
        .subscribe({
          next: () => {
            this.loadData(this.myForm.controls['id'].value);
            this.toastrService.success('با موفقیت حذف شد');
          },
          error: (err) => this.toastrService.error(err.error.message),
        });
    });
  }

  loadData(id: number) {
    this.commodityStoreroomService
      .getCommodityStoreroomByStoreroomDocumentId(id)
      .subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.rowData = [...data];
            if (this.gridApi) {
              this.gridApi.setRowData(this.rowData);
            }
            this.cdr.detectChanges();
          });
        },
        error: (err) => this.toastrService.error(err.error.message),
      });
  }

  closePage() {
    this.location.back();
  }
}
