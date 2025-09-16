import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExpenseEntryModalComponent } from './delete-expense-entry-modal-component';

describe('DeleteExpenseEntryModalComponent', () => {
  let component: DeleteExpenseEntryModalComponent;
  let fixture: ComponentFixture<DeleteExpenseEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteExpenseEntryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteExpenseEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
