import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityEditDialogComponent } from './commodity-edit-dialog.component';

describe('CommodityEditDialogComponent', () => {
  let component: CommodityEditDialogComponent;
  let fixture: ComponentFixture<CommodityEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommodityEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
