import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containify-route1',
  template: ` <p>route1 works!</p> `,
  styles: [],
})
export class Route1Component implements OnInit {
  ngOnInit(): void {
    console.log(`${Route1Component.name}: ngOnInit()`);
  }
}
