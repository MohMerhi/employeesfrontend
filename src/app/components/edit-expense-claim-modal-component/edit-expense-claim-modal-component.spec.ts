import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenseClaimModalComponent } from './edit-expense-claim-modal-component';

describe('EditExpenseClaimModalComponent', () => {
  let component: EditExpenseClaimModalComponent;
  let fixture: ComponentFixture<EditExpenseClaimModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpenseClaimModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpenseClaimModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
