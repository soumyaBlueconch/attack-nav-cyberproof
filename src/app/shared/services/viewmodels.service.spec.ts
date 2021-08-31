import { TestBed } from '@angular/core/testing';

import { ViewmodelsService } from './viewmodels.service';

describe('ViewmodelsService', () => {
  let service: ViewmodelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewmodelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
