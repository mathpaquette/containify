/* eslint @typescript-eslint/ban-ts-comment: off */
// @ts-ignore
import { Postmate } from 'postmate/src/postmate'; // TODO: https://github.com/mathpaquette/ngx-containify/issues/2
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { groupBy, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ContainifyApp, HostEvent, RemoteApp } from './host.model';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'containify-host',
  template: `
    <div
      [id]="app.appId"
      [hidden]="app.appId !== activeAppId"
      *ngFor="let app of applications"
    ></div>
  `,
  styles: [
    `
      :host {
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostComponent implements AfterViewInit {
  applications: ContainifyApp[] = [];

  remoteApps: RemoteApp[] = [];
  activeAppId: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    // fetch remote applications
    this.remoteApps = await this.http
      .get<RemoteApp[]>('assets/remote.apps.json')
      .toPromise();

    this.activatedRoute.url
      .pipe(
        map<UrlSegment[], HostEvent>((x) => {
          const baseAppUrl = this.getBaseAppUrl();
          return {
            appId: this.activatedRoute.snapshot.params.appId,
            baseAppUrl: baseAppUrl,
            remoteUrl: this.router.url.slice(baseAppUrl.length),
            url: this.router.url,
          };
        }),
        groupBy((x) => x.appId),
        mergeMap((group) =>
          group.pipe(switchMap((x) => this.getOrCreateApplication(x)))
        )
      )

      .subscribe(([event, app]) => {
        app.remoteApp.call('messageFromParent', event.remoteUrl);
        this.activeAppId = app.appId;
        this.cdRef.detectChanges();
      });
  }

  private getOrCreateApplication(
    event: HostEvent
  ): Observable<[HostEvent, ContainifyApp]> {
    const app = this.applications.find((x) => x.appId === event.appId);
    if (app) {
      return of([event, app]);
    }

    const remoteApp = this.remoteApps.find((x) => x.id == event.appId);
    if (!remoteApp) throw new Error(`Remote app ${event.appId} not found`);

    const newApp: ContainifyApp = { ...event, remoteApp: undefined };
    this.applications.push(newApp);
    this.cdRef.detectChanges(); // force adding new container

    const handshake = new Postmate({
      container: document.getElementById(event.appId), // Element to inject frame into
      url: remoteApp.url, // Page to load, must have postmate.js. This will also be the origin used for communication.
      name: 'my-iframe-name', // Set Iframe name attribute. Useful to get `window.name` in the child.
      classListArray: ['my-class'], //Classes to add to the iframe via classList, useful for styling.
    });

    return fromPromise(handshake).pipe(
      map((x: any) => {
        x.on('messageFromRemote', (x: string) => {
          this.router.navigateByUrl(`${event.baseAppUrl}${x}`);
        });
        newApp.remoteApp = x;
        return [event, newApp];
      })
    );
  }

  private getBaseAppUrl(): string {
    return `/${this.activatedRoute.snapshot.parent?.url.join('/')}`;
  }
}
