
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { InvasionsService } from './invasions.service';
import { IDistrict } from './idistrict';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { Subscription } from '../../../node_modules/rxjs';

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
  invasionStart: Subscription;
  invasionChange: Subscription;
  invasionEnd: Subscription;
  onServerInfo: Subscription;
  serverInfo: ServerInfo = {
    population: 0,
    districts: 0,
    invasions: 0
  };
  timers: object = {};

  constructor(public invasionsService: InvasionsService, private pushNotifications: PushNotificationsService, public router: Router, public socketService: SocketService){
    pushNotifications.requestPermission();
    window.addEventListener('resize', this.onResize);


    this.refresh();
    // let instance = this;
    // this.refreshLoop = setInterval(function(){
    //   instance.refresh();
    // }, 25000);

    this.initConnection();
  }

  ngOnDestroy(): void {
    // if(this.refreshLoop)
    //   clearInterval(this.refreshLoop);
  }

  initConnection(){
    this.socketService.initSocket();
    
    if(!this.invasionStart)
    {
      this.invasionStart = this.socketService.onInvasionStart().subscribe(
        res => {
          // console.log('start');
          var existingDistrict = this.districts.findIndex(function(district: IDistrict, index: number){ return district.name == res.name;  });
          if(existingDistrict != -1)
          {
            this.districts[existingDistrict] = res;
          }
          else
          {
            this.notify(res);
            this.districts.push(res);
          }
          this.sortDistricts();
        }
      );

    }

    if(!this.invasionChange)
    {
      this.invasionChange = this.socketService.onInvasionChange().subscribe(
        res => {
          // console.log('change');

          var existingDistrict = this.districts.findIndex(function(district: IDistrict, index: number){ return district.name == res.name;  });
          if(existingDistrict != -1)
          {
            // this.districts[existingDistrict] = res;
            this.districts[existingDistrict].count_defeated = res.count_defeated;
            this.districts[existingDistrict].remaining_time = res.remaining_time;
            this.districts[existingDistrict].population = res.population
          }
          else
          {
            this.districts.push(res);
          }
          this.sortDistricts();
        }
      );

    }

    if(!this.invasionEnd)
    {
      this.invasionEnd = this.socketService.onInvasionEnd().subscribe(
        res => {
          // console.log('end');
          var existingDistrict = this.districts.findIndex(function(district: IDistrict, index: number){ return district.name == res;  });
          if(existingDistrict != -1)
          {
            this.districts.splice(existingDistrict, 1);
          }
          this.sortDistricts();
        }
      );
    }

    if(!this.onServerInfo)
    {
      this.onServerInfo = this.socketService.onServerInfo().subscribe(
        res => this.serverInfo = res
      );
    }

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

  notify(district: IDistrict){
    this.pushNotifications.create('Invasion Alert', {tag: 'hello', body: '\nAn Invasion has started in ' + district.name + '!\n(' + district.cogs_attacking + ')', icon: './assets/cogs/' + district.cogs_attacking + '.png'}).subscribe(
      res => {
          if (res.event.type === 'click') {
              res.notification.close();
          }
      });
  }

  sortDistricts(){
    this.districts = this.districts.sort(function(a,b) {
      if (a.remaining_time > b.remaining_time)
        return 1;
      if (a.remaining_time < b.remaining_time)
        return -1;
      return 0;
    });

    let instance = this;
    this.districts.map(function(district: IDistrict, index: number){
      if(district.cogs_attacking != 'None')
      {
        if(instance.timers[district.name])
          clearInterval(instance.timers[district.name])


        instance.timers[district.name] = setInterval(function(){
        if(district.remaining_time <= 0)
        {
          clearInterval(instance.timers[district.name]);
          instance.districts.splice(index, 1);
        }
        else
          --district.remaining_time;
        }, 1000);
      }
    });
  }
  
  refresh(){
    this.isLoading = false;
    let distCheck = this.invasionsService.getDistrictdata().subscribe(
      res=>{
        // console.log(res);
        if(!res)
          return; 

        this.districts = res;
        this.sortDistricts();
        distCheck.unsubscribe();
      },
      error => {
        // console.log('error retrieving district data');
        // console.log(error);
      }
    );

    let serverCheck = this.invasionsService.getServerInfo().subscribe(
      res=>{
        // console.log(res);
        this.serverInfo = res; 

        serverCheck.unsubscribe();
      },
      error => {
        // console.log('error retrieving district data');
        // console.log(error);
      }
    );
  }
}

export interface ServerInfo{
  population: number;
  districts: number;
  invasions: number;
}