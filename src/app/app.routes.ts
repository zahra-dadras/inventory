import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouseDetailComponent } from './warehouse/warehouse-detail/warehouse-detail.component';
import { CommodityComponent } from './commodity/commodity.component';
import { CommodityDetailComponent } from './commodity/commodity-detail/commodity-detail.component';
import { CommodityTypeComponent } from './commodity-type/commodity-type.component';
import { MeasurementUnitComponent } from './measurement-unit/measurement-unit.component';

export const routes: Routes = [
  { path: 'warehouse-list', component: WarehouseComponent },
  { path: 'warehouse/detail', component: WarehouseDetailComponent },
  { path: 'warehouse/edit/:id', component: WarehouseDetailComponent },
  { path: 'commodity', component: CommodityComponent },
  { path: 'commodity/detail', component: CommodityDetailComponent },
  { path: 'commodity/edit/:id', component: CommodityDetailComponent },
  { path: 'commodity-type', component: CommodityTypeComponent },
  { path: 'measurement-unit', component: MeasurementUnitComponent },
];
