import { TestBed } from '@angular/core/testing';

import { LogicsService } from './logics.service';

describe('LogicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogicsService = TestBed.get(LogicsService);
    expect(service).toBeTruthy();
  });
});
