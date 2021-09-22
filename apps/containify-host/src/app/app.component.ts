import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      <a
        *ngFor="let link of links"
        [routerLink]="link.url"
        [routerLinkActive]="'active'"
        [queryParams]="link.queryParams"
        >{{ link.name }}</a
      >
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .header {
        height: 50px;
        background-color: gray;
      }
      a {
        margin-right: 10px;
      }
      .active {
        color: limegreen;
      }
      :host {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class AppComponent {
  links = [
    {
      name: '[app1] route1',
      url: '/apps/remote-app1/route1/route',
      queryParams: { query: 'query1' },
    },
    { name: '[app1] route2', url: '/apps/remote-app1/route2' },
    {
      name: '[app2] route1',
      url: '/apps/remote-app2/route1/route',
      queryParams: { query: 'query1' },
    },
    { name: '[app2] route3', url: '/apps/remote-app2/route3' },
  ];
}
