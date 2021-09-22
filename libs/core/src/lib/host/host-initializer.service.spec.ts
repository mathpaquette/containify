import { TestBed } from '@angular/core/testing';

import { HostInitializerService } from './host-initializer.service';

describe('HostInitializerService', () => {
  let service: HostInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
