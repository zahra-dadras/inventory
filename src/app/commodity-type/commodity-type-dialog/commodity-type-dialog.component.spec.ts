import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityTypeDialogComponent } from './commodity-type-dialog.component';

describe('CommodityTypeDialogComponent', () => {
  let component: CommodityTypeDialogComponent;
  let fixture: ComponentFixture<CommodityTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
