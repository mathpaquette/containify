import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div>REMOTE APP</div>
    <a
      *ngFor="let link of links"
      [routerLink]="link.url"
      [routerLinkActive]="'active'"
      [queryParams]="link.queryParams"
      >{{ link.name }}</a
    >

    <div class="route-info">
      <div>ROUTE INFORMATION</div>
      <div>URL: {{ router.url }}</div>
      <div>Query Params: {{ activatedRoute.queryParams | async | json }}</div>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .route-info {
        margin-top: 25px;
      }

      a {
        margin-right: 10px;
      }
      .active {
        color: limegreen;
      }
    `,
  ],
})
export class AppComponent {
  links = [
    {
      name: 'route 1',
      url: '/route1/route',
      queryParams: { query: 'query1' },
    },
    { name: 'route 2', url: '/route2' },
    { name: 'route 3', url: '/route3' },
  ];

  constructor(public activatedRoute: ActivatedRoute, public router: Router) {}
}
