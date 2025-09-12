import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../../enum/app-enum.enum';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommodityStoreroomService } from '../../services/commodity-storeroom.service';
import { CommodityEditDialogComponent } from '../commodity-edit-dialog/commodity-edit-dialog.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-commodity-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule,
  ],
  templateUrl: './commodity-list.component.html',
  styleUrl: './commodity-list.component.scss',
})
export class CommodityListComponent {
  @Output() editStoreroom = new EventEmitter<any>();

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
        deleteButton.addEventListener('click', () => this.deleteRoww(params));

        container.appendChild(editButton);
        container.appendChild(deleteButton);

        return container;
      },
    },
    {
      headerName: this.appEnum.STOREROOM_TYPE,
      field: 'storeroomPersianTitle',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
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
      headerName: this.appEnum.STOREROOM_ID,
      field: 'storeroomCode',
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
  ];
  isBrowser = false;
  rowData: any[] = [];
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
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private commodityStoreroomService: CommodityStoreroomService,
    private toastService: ToastService
  ) {}

  protected addCommodityBank() {
    this.editStoreroom.emit(null);
  }

  protected editRow(params: ICellRendererParams) {
    this.editStoreroom.emit(params.data);
  }

  protected deleteRoww(params: ICellRendererParams) {
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
          next: () => {
            this.loadData(params.data.commodityId);
            this.toastService.success('با موفقیت حذف شد');
          },
          error: (err) => this.toastService.error(err.error),
        });
    });
  }

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  loadData(id: number) {
    this.commodityStoreroomService
      .getCommodityStoreroomByCommodityId(id)
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
        error: (err) => this.toastService.error(err.error),
      });
  }
  // ngOnChanges() {
  //   if (this.storeroomDialogData) {
  //     console.log('داده اومد:', this.storeroomDialogData);
  //   }
  // }

  @Input() set storeroomDialogData(value: { id: number }) {
    if (value) {
      this.loadData(Number(value.id));
    }
  }
  // @Input() storeroomDialogData: any;
}
