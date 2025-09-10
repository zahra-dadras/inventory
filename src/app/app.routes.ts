import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouseDetailComponent } from './warehouse/warehouse-detail/warehouse-detail.component';
import { CommodityComponent } from './commodity/commodity.component';
import { CommodityDetailComponent } from './commodity/commodity-detail/commodity-detail.component';
import { CommodityTypeComponent } from './commodity-type/commodity-type.component';
import { MeasurementUnitComponent } from './measurement-unit/measurement-unit.component';
import { StoreroomDocumentComponent } from './storeroom-document/storeroom-document.component';
import { StoreroomDocumentDetailComponent } from './storeroom-document/storeroom-document-detail/storeroom-document-detail.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'warehouse-list',
    component: WarehouseComponent,
    canActivate: [authGuard],
  },
  {
    path: 'warehouse/detail',
    component: WarehouseDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'warehouse/edit/:id',
    component: WarehouseDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'commodity',
    component: CommodityComponent,
    canActivate: [authGuard],
  },
  {
    path: 'commodity/detail',
    component: CommodityDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'commodity/edit/:id',
    component: CommodityDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'commodity-type',
    component: CommodityTypeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'measurement-unit',
    component: MeasurementUnitComponent,
    canActivate: [authGuard],
  },
  {
    path: 'storeroom-document',
    component: StoreroomDocumentComponent,
    canActivate: [authGuard],
  },
  {
    path: 'storeroom-document/detail',
    component: StoreroomDocumentDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'storeroom-document/edit/:id',
    component: StoreroomDocumentDetailComponent,
    canActivate: [authGuard],
  },
];
