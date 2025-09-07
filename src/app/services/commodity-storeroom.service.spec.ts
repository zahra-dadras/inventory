import { TestBed } from '@angular/core/testing';

import { CommodityStoreroomService } from './commodity-storeroom.service';

describe('CommodityStoreroomService', () => {
  let service: CommodityStoreroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommodityStoreroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
