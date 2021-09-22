import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { connectToParent } from 'penpal';

@Injectable({
  providedIn: 'root',
})
export class RemoteInitializerService {
  private host: any;

  constructor(private router: Router) {}

  public init(): void {
    console.log('[REMOTE] initialize');

    // TODO: refactor in a message bus service
    this.router.events.subscribe((x) => {
      if (x instanceof NavigationEnd) {
        console.log(`[REMOTE APP] navigate event: ${x}`);
        if (!this.host) return;
        this.host.handler(x.url);
      }
    });

    const connection = connectToParent({
      methods: {
        messageFromParent: (url: string) => {
          console.log(`[HOST -> REMOTE APP] navigate to: ${url}`);
          this.router.navigateByUrl(url);
        },
      },
    });

    connection.promise.then((parent: any) => {
      console.log(parent);
      this.host = parent;
    });
  }
}
