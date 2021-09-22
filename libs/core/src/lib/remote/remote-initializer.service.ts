/* eslint @typescript-eslint/ban-ts-comment: off */
// @ts-ignore
import { Postmate } from 'postmate/src/postmate';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
        this.host.emit('messageFromRemote', x.url);
      }
    });

    let parent: any;
    const handshake = new Postmate.Model({
      // Expose your model to the Parent. Property values may be functions, promises, or regular values
      // @ts-ignore
      height: () => document.height || document.body.offsetHeight,
      messageFromParent: (x: string) => {
        console.log(`[HOST -> REMOTE APP] navigate to: ${x}`);
        this.router.navigateByUrl(x);
      },
    });

    // When parent <-> child handshake is complete, events may be emitted to the parent
    handshake.then((parent: any) => {
      this.host = parent;
      parent.emit('some-event', 'Hello, World!');
    });
  }
}
