import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityComponent } from './commodity.component';

describe('CommodityComponent', () => {
  let component: CommodityComponent;
  let fixture: ComponentFixture<CommodityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
