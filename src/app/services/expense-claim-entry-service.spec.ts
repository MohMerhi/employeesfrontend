import { TestBed } from '@angular/core/testing';

import { ExpenseClaimEntrySaervice } from './expense-claim-entry-service';

describe('ExpenseClaimEntrySaervice', () => {
  let service: ExpenseClaimEntrySaervice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseClaimEntrySaervice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
