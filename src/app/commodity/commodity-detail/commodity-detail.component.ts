import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppEnum } from '../../enum/app-enum.enum';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommodityEditDialogComponent } from '../commodity-edit-dialog/commodity-edit-dialog.component';
import { CommodityListComponent } from '../commodity-list/commodity-list.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommodityTypeService } from '../../services/commodity-type.service';
import { MeasurementUnitService } from '../../services/measurement-unit.service';
import { CommodityTypeModel } from '../../models/commodity-type.model';
import { MeasurementUnitModel } from '../../models/measurement-unit.model';
import { CommodityService } from '../../services/commodity.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PersianDatepickerComponent } from '../../persian-datepicker/persian-datepicker.component';
import moment from 'moment-jalaali';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-commodity-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CommodityListComponent,
    MatDialogModule,
    MatDatepickerModule,
    PersianDatepickerComponent,
  ],
  templateUrl: './commodity-detail.component.html',
  styleUrl: './commodity-detail.component.scss',
})
export class CommodityDetailComponent {
  @ViewChild(CommodityListComponent) commodityList!: CommodityListComponent;
  protected appEnum = AppEnum;
  protected commodityTypeList: CommodityTypeModel[] = [];
  protected measurementUnitList: MeasurementUnitModel[] = [];
  protected mode: 'create' | 'edit' = 'create';
  protected showDatePicker = false;
 
  myForm: FormGroup;
  childData: any;


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
    private commodityTypeService: CommodityTypeService,
    private measurementUnitService: MeasurementUnitService,
    private commodityService: CommodityService,
    private toastService: ToastService
  ) {
    this.myForm = new FormGroup({
      commodityCode: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      commodityPersianTitle: new FormControl('', Validators.required),
      commodityEnglishTitle: new FormControl('', Validators.required),
      commodityTypeId: new FormControl('', Validators.required),
      measurementUnitId: new FormControl('', Validators.required),
      description: new FormControl(''),
      createDate: new FormControl(''),
      id: new FormControl(0),
    });
  }
  ngOnInit(): void {
    this.commodityTypeService.getCommodityTypes().subscribe({
      next: (res) => {
        this.commodityTypeList = res;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });

    this.measurementUnitService.getMeasurementUnits().subscribe({
      next: (res) => {
        this.measurementUnitList = res;
      },
      error: (err) => {
        this.toastService.error(err.error.message);
      },
    });

    if (this.route.snapshot.paramMap.has('id')) {
      this.mode = 'edit';
      this.commodityService
        .getCommodityById(Number(this.route.snapshot.paramMap.get('id')))
        .subscribe({
          next: (res) => {
            if (res.id) {
              const patchedData = {
                ...res,
                createDate: res.createDate
                  ? moment(res.createDate).locale('fa').format('jYYYY/jMM/jDD')
                  : null,
              };
              this.myForm.patchValue(patchedData);
              this.childData = { id: res.id };
              this.commodityList.loadData(res.id);
            }
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          },
        });
    } else {
      this.mode = 'create';

      this.commodityService.generateCodeCommodity().subscribe({
        next: (res) => {
          this.myForm.controls['commodityCode'].patchValue(res.commodityCode);
        },
        error: (err) => {
          this.toastService.error(err.error.message);
        },
      });
    }
  }

  onSubmit() {
    let form = this.myForm.controls;
    const payload = {
      commodityPersianTitle: form['commodityPersianTitle'].value,
      commodityEnglishTitle: form['commodityEnglishTitle'].value,
      commodityTypeId: Number(form['commodityTypeId'].value),
      measurementUnitId: Number(form['measurementUnitId'].value),
      createDate: form['createDate'].value,
      description: form['description'].value,
    };
    if (this.mode === 'create') {
      this.commodityService
        .createCommodity({
          ...payload,
          commodityCode: form['commodityCode'].value,
        })
        .subscribe({
          next: (res) => {
            this.mode = 'edit';
            this.myForm.controls['id'].patchValue(res);
            this.toastService.success('با موفقیت ایجاد شد');
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          },
        });
    } else {
      this.commodityService
        .updateCommodity(this.myForm.controls['id'].value, payload)
        .subscribe({
          next: () => {
            this.toastService.success('با موفقیت ویراش شد');
          },
          error: (err) => {
            this.toastService.error(err.error.message);
          },
        });
    }
  }

  openDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateSelected(date: string) {
    this.myForm.patchValue({ createDate: date });
    this.showDatePicker = false;
  }

  storeroomDialog(value: any) {
    const data = {
      rowData: value,
      commodityId: this.myForm.controls['id'].value,
      mode: value ? 'edit' : 'create',
    };
    const dialogRef = this.dialog.open(CommodityEditDialogComponent, {
      width: '450px',
      height: '250px',
      panelClass: 'custom-dialog-container',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const id = this.myForm.controls['id'].value;
      this.commodityList.loadData(id);
    });
  }

  closePage() {
    this.location.back();
  }
}
