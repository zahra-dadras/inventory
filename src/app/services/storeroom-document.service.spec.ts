import { TestBed } from '@angular/core/testing';

import { StoreroomDocumentService } from './storeroom-document.service';

describe('StoreroomDocumentService', () => {
  let service: StoreroomDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreroomDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
