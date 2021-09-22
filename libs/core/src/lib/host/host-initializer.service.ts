import { Injectable } from '@angular/core';
import { HostComponent } from './host.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HostInitializerService {
  constructor(private router: Router) {}

  public init(): void {
    console.log('[HOST] initialize');

    this.router.config.push({
      path: 'apps/:appId',
      children: [{ path: '**', component: HostComponent }],
    });
  }
}
