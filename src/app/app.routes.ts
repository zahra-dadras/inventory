import { Routes } from '@angular/router';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { WarehouseDetailComponent } from './warehouse/warehouse-detail/warehouse-detail.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';

export const routes: Routes = [
    {path: 'warehouse-list' , component: WarehouseComponent},
    {path: 'warehouse/detail', component: WarehouseDetailComponent},
    {path: 'product' , component: ProductComponent},
    {path: 'product/detail', component: ProductDetailComponent},
];
