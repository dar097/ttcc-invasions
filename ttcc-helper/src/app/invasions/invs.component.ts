
import { Component, AfterViewInit } from '@angular/core';
import { InvasionsService } from './invasions.service';
import { IDistrict } from './idistrict';
import { PushNotificationsService } from '../../../node_modules/ng-push';
import { Router } from '../../../node_modules/@angular/router';
import { timer } from '../../../node_modules/rxjs';
import { take, map } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-invs',
  templateUrl: './invs.component.html',
  styleUrls: ['./invs.component.css']
})
export class InvasionsComponent implements AfterViewInit {
  width: number = 0;
  districts: IDistrict[] = [];
  title = 'Invasions';
  lastRequestDown = false;
  population: number = 0;
  invasions: number = 0;
  districtInvasions = {};
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  
  constructor(public invasionsService: InvasionsService, private pushNotifications: PushNotificationsService, public router: Router){
    pushNotifications.requestPermission();
    let instance = this;
    window.onresize = function(){
      instance.onResize(); 
    }

    this.refresh();
    setInterval(function(){
      instance.refresh();
    }, 25000);
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
    return '../../../assets/' + cogs_attacking + '.png';
  }

  getCogType(cogs_type){
    return "url('../../assets/" + cogs_type + ".png')";
  }

  getGradient(number){
    var percentageDone = Math.round(number * 100);
    return 'linear-gradient(90deg, #2cc218 ' + percentageDone + '%, gray '+ percentageDone + '%)';
  }

  notify(district: IDistrict){
    this.pushNotifications.create('Invasion Alert', {body: '\nAn Invasion has started in ' + district.name + '!\n', icon: '../../../assets/' + district.cogs_attacking + '.png'}).subscribe(
      res => {
          if (res.event.type === 'click') {
              res.notification.close();
          }
      });
  }

  refresh(){
    this.isLoading = true;
    this.invasionsService.getDistrictdata().subscribe(
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
            this.pushNotifications.create('Server Status Alert', {body: '\nDistricts are back online.\nServers could possibly also be accessible.', icon: '../../../assets/logo_icon.png'}).subscribe(
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
        }
      },
      error => {
        console.log('error retrieving district data');
        console.log(error);
      }
    );
  }
}