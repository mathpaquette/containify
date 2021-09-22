import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containify-route2',
  template: ` <p>route2 works!</p> `,
  styles: [],
})
export class Route2Component implements OnInit {
  ngOnInit(): void {
    console.log(`${Route2Component.name}: ngOnInit()`);
  }
}
