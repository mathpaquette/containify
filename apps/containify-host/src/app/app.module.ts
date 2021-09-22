import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { ContainifyCoreModule } from '@ngx-containify/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { useHash: true }),
    ContainifyCoreModule.withConfig({ host: true }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
