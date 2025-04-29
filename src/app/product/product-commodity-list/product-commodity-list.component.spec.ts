import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCommodityListComponent } from './product-commodity-list.component';

describe('ProductCommodityListComponent', () => {
  let component: ProductCommodityListComponent;
  let fixture: ComponentFixture<ProductCommodityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCommodityListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCommodityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
