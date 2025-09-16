import { TestBed } from '@angular/core/testing';

import { LeavingService } from './leaving-service';

describe('LeavingService', () => {
  let service: LeavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
