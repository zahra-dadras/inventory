import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { AppEnum } from '../enum/app-enum.enum';
import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ColDef,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
} from 'ag-grid-community';
import { Router } from '@angular/router';
import { StoreroomService } from '../services/storeroom.service';
import { StoreroomModel } from '../models/storeroom.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import moment from 'moment-jalaali';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastService } from '../services/toast.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent {
  protected appEnum = AppEnum;
  protected rowData: StoreroomModel[] = [];

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
      headerName: this.appEnum.STOREROOM_MANAGER,
      field: 'storeroomChairman',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_TYPE,
      field: 'storeroomTypePersianTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_TITLE,
      field: 'storeroomTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.STOREROOM_ID,
      field: 'storeroomCode',
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
    getRowHeight: (params) => 40,
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
    private router: Router,
    private storeroomService: StoreroomService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private toastrService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadData();
    }
  }

  loadData() {
    this.storeroomService.getStoreroomList().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.rowData = data.map((item) => ({
            ...item,
            createDate: item.createDate
              ? moment(item.createDate).locale('fa').format('jYYYY/jMM/jDD')
              : ' ',
          }));
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
          this.cdr.detectChanges(); // 👈 اجباراً رندر می‌کنه
        });
      },
      error: (err) => this.toastrService.error(err.error),
    });
  }
  private editRow(params: ICellRendererParams) {
    console.log(params.data.id);
    this.router.navigate(['/warehouse/edit', params.data.id]);
  }

  private deleteRow(params: ICellRendererParams) {
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

      this.storeroomService.deleteStoreroom(params.data.id).subscribe({
        next: () => {
          this.loadData();
          this.toastrService.success('انبار با موفقیت حذف شد.');
        },
        error: (err) => this.toastrService.error(err.error),
      });
    });
  }

  protected addStoreroom(): void {
    this.router.navigate(['/warehouse/detail']);
  }
}
