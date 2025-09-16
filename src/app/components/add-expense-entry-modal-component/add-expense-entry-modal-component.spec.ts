import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseEntryModalComponent } from './add-expense-entry-modal-component';

describe('AddExpenseEntryModalComponent', () => {
  let component: AddExpenseEntryModalComponent;
  let fixture: ComponentFixture<AddExpenseEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseEntryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenseEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
