import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Home';

  ngAfterViewInit(): void {
    const toolbar = document.getElementsByClassName('mat-toolbar') ? document.getElementsByClassName('mat-toolbar')[0] : null;
    var space = document.getElementById('toolbar-space');

    space.style.setProperty('height', String(toolbar.clientHeight) + 'px')
  }
  
}
