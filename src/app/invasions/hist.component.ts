
import { Component, AfterViewInit } from '@angular/core';
import { InvasionsService } from './invasions.service';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { IHistory } from './ihistory';

@Component({
  selector: 'app-hist',
  templateUrl: './hist.component.html',
  styleUrls: ['./hist.component.css']
})
export class HistoryComponent implements AfterViewInit {
  hover: boolean = false;
  width: number = 0;
  histories: IHistory[] = [];
  title = 'History';
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  
  constructor(public invasionsService: InvasionsService, private pushNotifications: PushNotificationsService, public router: Router){
    pushNotifications.requestPermission();
    window.addEventListener('resize', this.onResize);

    this.refresh();
    // setInterval(function(){
    //   instance.refresh();
    // }, 25000);
  }
  
  onResize(){
    this.width = window.innerWidth;
    var width: string = "250px";
    
    if(window.innerWidth < 305)
      width = String(window.innerWidth - 55) + 'px'


    let cards = document.getElementsByClassName('invasion-card');
    for(var i = 0; i < cards.length; i++)
    {
      var card = (<HTMLElement>cards[i]);
      card.style.setProperty('width', width);
    }
  }

  ngAfterViewInit(): void {
    this.onResize();
  }

  getImage(cogs_attacking){
    cogs_attacking = cogs_attacking === 'None' ? 'logo_icon' : cogs_attacking;
    return './assets/cogs/' + cogs_attacking + '.png';
  }

  getCogType(cogs_type){
    return "url('./assets/" + cogs_type + ".png')";
  }

  getGradient(number){
    var percentageDone = Math.round(number * 100);
    return 'linear-gradient(90deg, #2cc218 ' + percentageDone + '%, gray '+ percentageDone + '%)';
  }

  refresh(){
    this.isLoading = true;
    if(!this.invasionsService)
      return;
    this.invasionsService.getHistorydata().subscribe(
      res=>{
        // console.log(res);
        if(!res)
          return; 

          var histories = res.sort(function(a,b) {
            if (a.started > b.started)
              return -1;
            if (a.started < b.started)
              return 1;
            return 0;
          });
          
          this.histories = histories;
          this.isLoading = false;
          if(this.isFirstLoad)
            this.isFirstLoad = false;
        
      },
      error => {
        console.log('error retrieving district data');
        console.log(error);
      }
    );
  }
}