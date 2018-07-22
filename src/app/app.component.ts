import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '../../node_modules/@angular/router';
import { filter } from '../../node_modules/rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Home';
  message: string = null;
  screenWidth: number = 0;
  active_route: string = '';
  
  constructor(public router: Router){
    let instance = this;
    window.addEventListener('resize', this.onResize);
    
    setTimeout(this.onResize,0);

    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
        this.active_route = event.urlAfterRedirects;
        setTimeout(this.onResize,0);
    });
  }
  
  onResize(): any {
    this.screenWidth = window.innerWidth;
    var invs =document.getElementById('r-invasions');
    var grps = document.getElementById('r-groups');
    if(this.screenWidth >= 325)
    {
      if(invs)
        invs.innerText = 'Invasions'
      if(grps)
        grps.innerText = 'Group Finder'
    }
    else
    {
      if(invs)
        invs.innerText = 'Invs'
      if(grps)
        grps.innerText = 'Groups'
    }
  }


  ngAfterViewInit(): void {
    const toolbar = document.getElementsByClassName('mat-toolbar') ? document.getElementsByClassName('mat-toolbar')[0] : null;
    var space = document.getElementById('toolbar-space');

    space.style.setProperty('height', String(toolbar.clientHeight) + 'px')
  }
  
}
