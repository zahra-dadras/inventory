import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AgGridModule } from 'ag-grid-angular';
import { AppEnum } from '../enum/app-enum.enum';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import moment from 'moment-jalaali';
import { Router } from '@angular/router';
import { StoreroomDocumentService } from '../services/storeroom-document.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreroomDocumentModel } from '../models/storeroom-document.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-storeroom-document',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AgGridModule,
  ],
  templateUrl: './storeroom-document.component.html',
  styleUrl: './storeroom-document.component.scss',
})
export class StoreroomDocumentComponent implements OnInit {
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
      headerName: this.appEnum.RECIEVER,
      field: 'reciever',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      headerName: this.appEnum.DELIVERER,
      field: 'deliverer',
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
      headerName: this.appEnum.STOREROOM_DOCUMENT_DATE,
      field: 'documentDate',
      valueFormatter: (params) =>
        moment(params.value).locale('fa').format('jYYYY/jMM/jDD'),
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
  ];

  gridApi!: any;

  defaultColDef: ColDef = {
    filter: true,
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.loadData();
  }
  rowData: StoreroomDocumentModel[] = [];

  gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    headerHeight: 40,
    getRowHeight: (params) => 40,
  };

  isBrowser = false;

  constructor(
    private router: Router,
    private storeroomDocumentService: StoreroomDocumentService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private toastrService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadData() {
    this.storeroomDocumentService.getStoreroomDocumentList().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.rowData = [...data];
          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }
          this.cdr.detectChanges(); // 👈 اجباراً رندر می‌کنه
        });
      },
      error: (err) => this.toastrService.error(err.error),
    });
  }

  protected addStoreroomDocument() {
    this.router.navigate(['/storeroom-document/detail']);
  }

  protected editRow(params: ICellRendererParams) {
    this.router.navigate(['/storeroom-document/edit', params.data.id]);
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

      this.storeroomDocumentService
        .deleteStoreroomDocument(params.data.id)
        .subscribe({
          next: () => {
            this.loadData();
            this.toastrService.success('سند انبار با موفقیت حذف شد');
          },
          error: (err) => this.toastrService.error(err.error),
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
