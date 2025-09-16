import { TestBed } from '@angular/core/testing';

import { ExpenseClaimService } from './expense-claim-service';

describe('ExpenseClaimService', () => {
  let service: ExpenseClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
