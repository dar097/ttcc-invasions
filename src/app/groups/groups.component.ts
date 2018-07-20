import { GroupService } from './groups.service';

import { Component, AfterViewInit } from '@angular/core';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { IGroup } from './igroup';

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupComponent implements AfterViewInit {
  hover: boolean = false;
  width: number = 0;
  groups: IGroup[] = [];
  title = 'Group Finder';
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  
  constructor(public groupService: GroupService, private pushNotifications: PushNotificationsService, public router: Router){
    pushNotifications.requestPermission();
    let instance = this;
    window.onresize = function(){
      instance.onResize(); 
    }

    //this.refresh();
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
    return './assets/' + cogs_attacking + '.png';
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
    this.groupService.getGroups().subscribe(
      res=>{
        // console.log(res);
        if(!res)
          return; 

          var groups = res.sort(function(a,b) {
            if (a.created > b.created)
              return -1;
            if (a.created < b.created)
              return 1;
            return 0;
          });
          
          this.groups = groups;
          this.isLoading = false;
          if(this.isFirstLoad)
            this.isFirstLoad = false;
        
      },
      error => {
        console.log('error retrieving group data');
        console.log(error);
      }
    );
  }
}