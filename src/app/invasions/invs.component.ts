
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { InvasionsService } from './invasions.service';
import { IDistrict } from './idistrict';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invs',
  templateUrl: './invs.component.html',
  styleUrls: ['./invs.component.css']
})
export class InvasionsComponent implements AfterViewInit, OnDestroy {
  hover: boolean = false;
  width: number = 0;
  districts: IDistrict[] = [];
  title = 'Invasions';
  lastRequestDown = false;
  population: number = 0;
  invasions: number = 0;
  districtInvasions = {};
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  refreshLoop: any;

  constructor(public invasionsService: InvasionsService, private pushNotifications: PushNotificationsService, public router: Router){
    pushNotifications.requestPermission();
    window.addEventListener('resize', this.onResize);


    this.refresh();
    let instance = this;
    this.refreshLoop = setInterval(function(){
      instance.refresh();
    }, 25000);

    //this.initConnection();
  }

  ngOnDestroy(): void {
    if(this.refreshLoop)
      clearInterval(this.refreshLoop);
  }

  /*initConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onDistrict().subscribe(
      district => {
        console.log(district);
      }
    );

    this.socketService.onEvent(Event.CONNECT).subscribe(
      () => {
        console.log('connected');
      }
    );
      
    this.socketService.onEvent(Event.DISCONNECT).subscribe(
      () => {
        console.log('disconnected');
      }
    );
  }*/
  
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

  notify(district: IDistrict){
    this.pushNotifications.create('Invasion Alert', {tag: 'hello', body: '\nAn Invasion has started in ' + district.name + '!\n(' + district.cogs_attacking + ')', icon: './assets/cogs/' + district.cogs_attacking + '.png'}).subscribe(
      res => {
          if (res.event.type === 'click') {
              res.notification.close();
          }
      });
  }

  refresh(){
    this.isLoading = true;
    let distCheck = this.invasionsService.getDistrictdata().subscribe(
      res=>{
        // console.log(res);
        if(!res)
          return; 

        if(res.length == 0)
        {
          this.lastRequestDown = true;
          console.log('servers are probably down.');
        } 
        else
        {
          if(this.lastRequestDown)
          {
            this.pushNotifications.create('Server Status Alert', {body: '\nDistricts are back online.\nServers could possibly also be accessible.', icon: './assets/logo_icon.png'}).subscribe(
              res => {
                  if (res.event.type === 'click') {
                      res.notification.close();
                  }
              });
          }
          this.lastRequestDown = false;
          var districts = res.sort(function(a,b) {
            if (a.population > b.population)
              return -1;
            if (a.population < b.population)
              return 1;
            return 0;
          });
          let instance = this;
          districts.map(function(district: IDistrict){
                                  
            if(!this.districtInvasions[district.name] || this.districtInvasions[district.name] != district.cogs_attacking)
            {
              if(district.cogs_attacking == 'None')
                delete this.districtInvasions[district.name];
              else
              {
                this.districtInvasions[district.name] = district.cogs_attacking;
                if(this.districts.length > 0)
                  this.notify(district);
              }
            }

            if(district.cogs_attacking != 'None')
            {
              var timer = setInterval(function(){
                if(district.remaining_time <= 0)
                {
                  clearInterval(timer);
                  district.invasion_online = false;
                  district.cogs_attacking = 'None';
                }
                else
                --district.remaining_time;
              }, 1000);
            }

            if(instance.districts[district.name] && district.last_update === instance.districts[district.name].last_update)
            {
              console.log('hello govna');
              district = instance.districts[district.name];
            }
          }, this);
          // console.log(this.districtInvasions);
          
          var population = 0;
          var invasions = 0;
          for(var i = 0; i < districts.length; i++)
          {
            population += districts[i].population;
            if(districts[i].invasion_online)
            invasions++;
          }
          
          this.population = population;
          this.invasions = invasions;
          this.districts = [];
          this.districts = districts;
          this.isLoading = false;
          if(this.isFirstLoad)
            this.isFirstLoad = false;

          distCheck.unsubscribe();
        }
      },
      error => {
        console.log('error retrieving district data');
        console.log(error);
      }
    );
  }
}