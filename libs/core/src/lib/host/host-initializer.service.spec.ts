import { TestBed } from '@angular/core/testing';

import { HostInitializerService } from './host-initializer.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HostInitializerService', () => {
  let service: HostInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(HostInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
