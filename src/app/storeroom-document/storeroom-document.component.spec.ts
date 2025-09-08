import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreroomDocumentComponent } from './storeroom-document.component';

describe('StoreroomDocumentComponent', () => {
  let component: StoreroomDocumentComponent;
  let fixture: ComponentFixture<StoreroomDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreroomDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreroomDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
