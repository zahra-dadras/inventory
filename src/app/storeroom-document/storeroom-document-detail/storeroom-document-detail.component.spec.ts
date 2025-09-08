import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreroomDocumentDetailComponent } from './storeroom-document-detail.component';

describe('StoreroomDocumentDetailComponent', () => {
  let component: StoreroomDocumentDetailComponent;
  let fixture: ComponentFixture<StoreroomDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreroomDocumentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreroomDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
