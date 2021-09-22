import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

/* eslint @typescript-eslint/ban-ts-comment: off */
// @ts-ignore
import { Postmate } from 'postmate/src/postmate';
import { Route1Component } from './route1/route1.component';
import { Route2Component } from './route2/route2.component';
import { Route3Component } from './route3/route3.component';
import { ContainifyCoreModule } from '@ngx-containify/core';

@NgModule({
  declarations: [
    AppComponent,
    Route1Component,
    Route2Component,
    Route3Component,
  ],
  imports: [
    BrowserModule,
    ContainifyCoreModule,
    RouterModule.forRoot(
      [
        {
          path: 'route1',
          children: [{ path: '**', component: Route1Component }],
        },
        { path: 'route2', component: Route2Component },
        { path: 'route3', component: Route3Component },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
