import { TestBed } from '@angular/core/testing';

import { RemoteInitializerService } from './remote-initializer.service';

describe('RemoteInitializerService', () => {
  let service: RemoteInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
