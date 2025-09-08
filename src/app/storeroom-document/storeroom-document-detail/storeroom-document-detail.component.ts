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
  // @ViewChild(CommodityListComponent) commodityList!: CommodityListComponent;
  myForm: FormGroup;
  protected appEnum = AppEnum;
  storeroomList: StoreroomModel[] = [];
  documentTypeList = [{ value: 'رسید' }, { value: 'فاکتور' }];
  documentGroupList = [{ value: 'خرید' }, { value: 'فروش' }];
  selectedFruit: string = '';
  // childData: any;
  mode: 'create' | 'edit' = 'create';
  isFormValid: boolean = false;
  showDatePicker = false;

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
      headerName: this.appEnum.AMOUNT,
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
      headerName: this.appEnum.Commodity_ENGLISH_TITLE,
      field: 'commodityEnglishTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.Commodity_COD,
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
  isBrowser = false;
  rowData: InventoryModel[] = [];
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
    private storeroomService: StoreroomService
  ) {
    this.myForm = new FormGroup({
      documentCode: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      documentTitle: new FormControl('', Validators.required),
      documentType: new FormControl('', Validators.required),
      documentGroup: new FormControl('', Validators.required),
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
      error: (err) => {},
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
                // تبدیل تاریخ میلادی به شمسی
                documentDate: res.documentDate
                  ? moment(res.documentDate)
                      .locale('fa')
                      .format('jYYYY/jMM/jDD')
                  : null,
              };
              this.myForm.patchValue(patchedData);
              // this.childData = { id: res.id };
              // this.commodityList.loadData(res.id);

              if (this.isBrowser) {
                this.loadData(res.storeroomId);
              }
            }
          },
          error: (err) => {},
        });
    } else {
      this.mode = 'create';

      this.storeroomDocumentService.generateCodeStoreroomDocument().subscribe({
        next: (res) => {
          this.myForm.controls['documentCode'].patchValue(
            res.storeroomDocumentCode
          );
        },
        error: (err) => {},
      });
    }
  }

  onSubmit() {
    let form = this.myForm.controls;
    console.log(form);
    const payload = {
      documentDate: form['documentDate'].value,
      documentTitle: form['documentTitle'].value,
      documentType: form['documentType'].value,
      documentGroup: form['documentGroup'].value,
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
            console.log('reeeeeeeeeeees', res);
            this.mode = 'edit';
            this.myForm.controls['id'].patchValue(res);
            this.loadData(this.myForm.controls['storeroomId'].value);
          },
          error: (err) => {},
        });
    } else {
      this.storeroomDocumentService
        .updateStoreroomDocument(this.myForm.controls['id'].value, payload)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.loadData(this.myForm.controls['storeroomId'].value);
          },
          error: (err) => {},
        });
    }
  }

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: string) {
    // تاریخ انتخاب‌شده از تقویم میاد (Jalali)
    this.myForm.patchValue({ documentDate: date });
    this.showDatePicker = false;
  }

  storeroomDialog(value: any) {
    // console.log(value);
    // const data = {
    //   rowData: value,
    //   commodityId: this.myForm.controls['id'].value,
    //   mode: value ? 'edit' : 'create',
    // };
    // const dialogRef = this.dialog.open(CommodityEditDialogComponent, {
    //   width: '450px',
    //   height: '250px',
    //   panelClass: 'custom-dialog-container',
    //   data: data,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   const id = this.myForm.controls['id'].value;
    //   this.commodityList.loadData(id);
    // });
  }

  protected addCommodityBank() {
    // this.editStoreroom.emit(null);
    const data = {
      storeroomId: this.myForm.controls['storeroomId'].value,
      mode: 'create',
    };
    const dialogRef = this.dialog.open(StoreroomDocumentDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const id = this.myForm.controls['storeroomId'].value;
      this.loadData(id);
    });
  }

  protected editRow(params: ICellRendererParams) {
    // this.editStoreroom.emit(params.data);
    // console.log(params);
    const data = {
      rowData: params.data,
      storeroomId: this.myForm.controls['storeroomId'].value,
      mode: 'edit',
    };
    const dialogRef = this.dialog.open(StoreroomDocumentDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const id = this.myForm.controls['storeroomId'].value;
      this.loadData(id);
    });
  }

  protected deleteRow(params: ICellRendererParams) {
    console.log(params);
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
        .deleteCommodityStoreroom(params.data.commodityId)
        .subscribe({
          next: () => this.loadData(this.myForm.controls['storeroomId'].value),
          error: (err) => console.log('Error deleting record:', err),
        });
    });
  }

  loadData(id: number) {
    this.commodityStoreroomService
      .getCommodityStoreroomByStoreroomId(id)
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
        error: (err) => console.error('Error from API:', err),
      });
  }

  closePage() {
    this.location.back();
  }
}
