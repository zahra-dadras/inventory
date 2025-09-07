import { TestBed } from '@angular/core/testing';

import { CommodityTypeService } from './commodity-type.service';

describe('CommodityTypeService', () => {
  let service: CommodityTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommodityTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
