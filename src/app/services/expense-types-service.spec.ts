import { TestBed } from '@angular/core/testing';

import { ExpenseTypesService } from './expense-types-service';

describe('ExpenseTypesService', () => {
  let service: ExpenseTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
