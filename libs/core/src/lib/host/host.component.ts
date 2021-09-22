import { connectToChild } from 'penpal';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, concatMap, groupBy, map, mergeMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { ContainifyApp, HostEvent, RemoteApp } from './host.model';
import { fromPromise } from 'rxjs/internal-compatibility';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'containify-host',
  template: `
    <div *ngFor="let app of applications" [id]="app.appId" [hidden]="app.appId !== activeAppId">
      <iframe [src]="app.url"></iframe>
    </div>
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
    private cdRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    public sanitizer: DomSanitizer
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await this.initialize();
  }

  private async initialize(): Promise<void> {
    // fetch remote applications
    this.remoteApps = await this.http.get<RemoteApp[]>('assets/remote.apps.json').toPromise();

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
        mergeMap((group) => group.pipe(concatMap((x) => this.getOrCreateApplication(x))))
      )
      .subscribe(([event, app]) => {
        app.remoteApp.messageFromParent(event.remoteUrl);
        this.activeAppId = app.appId;
        this.cdRef.detectChanges();
      });
  }

  private getOrCreateApplication(event: HostEvent): Observable<[HostEvent, ContainifyApp]> {
    const app = this.applications.find((x) => x.appId === event.appId);
    if (app && app.remoteApp) {
      return of([event, app]);
    }

    if (app && !app.remoteApp) {
      console.log(`remote application: ${app.appId}  not connected`);
      return EMPTY;
    }

    const remoteApp = this.remoteApps.find((x) => x.id == event.appId);
    if (!remoteApp) throw new Error(`Remote app ${event.appId} not found`);

    const iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(remoteApp.url); // TODO: create reusable pipe
    const newApp: ContainifyApp = {
      ...event,
      remoteApp: undefined,
      url: iframeUrl,
    };

    this.applications.push(newApp);
    this.cdRef.detectChanges(); // force adding new container

    const iframe = this.elementRef.nativeElement.querySelector(`#${newApp.appId} > iframe`);
    const connection = connectToChild({
      iframe: iframe,
      methods: {
        handler: (url: string) => {
          console.log(url);
          this.router.navigateByUrl(`${event.baseAppUrl}${url}`);
        },
      },
      timeout: 30 * 1000,
    });

    return fromPromise(connection.promise).pipe(
      catchError((x) => {
        console.error(x);
        return EMPTY;
      }),
      map((x) => {
        newApp.remoteApp = x;
        return [event, newApp];
      })
    );
  }

  private getBaseAppUrl(): string {
    return `/${this.activatedRoute.snapshot.parent?.url.join('/')}`;
  }
}
