import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-containify-route3',
  template: ` <p>route3 works!</p> `,
  styles: [],
})
export class Route3Component implements OnInit {
  ngOnInit(): void {
    console.log(`${Route3Component.name}: ngOnInit()`);
  }
}
