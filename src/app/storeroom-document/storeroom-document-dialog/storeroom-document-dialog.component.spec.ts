import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreroomDocumentDialogComponent } from './storeroom-document-dialog.component';

describe('StoreroomDocumentDialogComponent', () => {
  let component: StoreroomDocumentDialogComponent;
  let fixture: ComponentFixture<StoreroomDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreroomDocumentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreroomDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
