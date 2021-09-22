import { TestBed } from '@angular/core/testing';

import { RemoteInitializerService } from './remote-initializer.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RemoteInitializerService', () => {
  let service: RemoteInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    service = TestBed.inject(RemoteInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
