import { TestBed } from '@angular/core/testing';

import { StoreroomService } from './storeroom.service';

describe('StoreroomService', () => {
  let service: StoreroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
