import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouseDetailComponent } from './warehouse/warehouse-detail/warehouse-detail.component';

export const routes: Routes = [
    {path: 'warehouse-list' , component: WarehouseComponent},
    {path: 'warehouse/detail', component: WarehouseDetailComponent}
];
