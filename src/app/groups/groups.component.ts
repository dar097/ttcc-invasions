import { GroupService } from './groups.service';

import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { IGroup } from './igroup';
import { SocketService } from '../socket.service';
import { Event } from '../client-enums';
import { Subscription } from '../../../node_modules/rxjs';
import { MatDialog } from '../../../node_modules/@angular/material';
import { GroupDialog } from './group.dialog';

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupComponent implements AfterViewInit, OnDestroy {
  hover: boolean = false;
  width: number = 0;
  groups: IGroup[] = [
    {
      _id: 'test',
      activity: 'Building',
      cog_type: 'Bossbot',
      building_level: 4,
      street: 'Punchline Place',
      district: 'Whistle Woods',
      host: {
        _id: 'toon1',
        name: 'Burnt',
        laff: 50,
        species: 'Cat'
      },
      toons: [
        {
          _id: 'toon0',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon2',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon3',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon4',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon5',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon6',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        },
        {
          _id: 'toon7',
          name: 'Burnt',
          laff: 50,
          species: 'Cat'
        }
      ],
      created: new Date()
    },
    {
      _id: 'test5',
      activity: 'Facility',
      facility_type: 'Mint-Dollar',
      district: 'Whistle Woods',
      host: {
        _id: 'toon1',
        name: 'Burnt',
        laff: 50,
        species: 'Cat'
      },
      toons: [],
      created: new Date()
    },
    {
      _id: 'test2',
      activity: 'Facility',
      facility_type: 'Factory-Short',
      district: 'Whistle Woods',
      host: {
        _id: 'toon2',
        name: 'Dynamite',
        laff: 52,
        species: 'Horse'
      },
      toons: [
        {
          _id: 'toon3',
          name: 'Hoix',
          laff: 25,
          species: 'Bear'
        }
      ],
      created: new Date()
    },
    {
      _id: 'test3',
      activity: 'Boss(HQ)',
      boss: 'V.P',
      district: 'Whistle Woods',
      host: {
        _id: 'toon4',
        name: 'Dynabite',
        laff: 52,
        species: 'Bat'
      },
      toons: [
        {
          _id: 'toon5',
          name: 'Hoixo',
          laff: 25,
          species: 'Bear'
        }
      ],
      created: new Date()
    },
    {
      _id: 'test4',
      activity: 'Boss(Playground)',
      playground: 'Toontown Central',
      district: 'Whistle Woods',
      host: {
        _id: 'toon4',
        name: 'Dynamite',
        laff: 52,
        species: 'Horse'
      },
      toons: [
        {
          _id: 'toon5',
          name: 'Hoix',
          laff: 25,
          species: 'Bear'
        }
      ],
      created: new Date()
    }
  ];
  title = 'Group Finder';
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  ioConnection: Subscription;
  
  constructor(public groupService: GroupService, private pushNotifications: PushNotificationsService, public router: Router, public socketService: SocketService, public dialog: MatDialog){
    pushNotifications.requestPermission();
    let instance = this;
    window.onresize = function(){
      instance.onResize(); 
    }

    instance.onResize();
    //this.refresh();
  }

  initConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onGroup().subscribe(
      group => {
        let group_index: number = this.groups.findIndex(function(queriedGroup, index) {
          return queriedGroup._id == group._id;
        });


        if(group_index != -1)
        {
          this.groups[group_index] = group;
        }
        else
          this.groups.push(group);

        this.reorderGroups();
      }
    );

    this.socketService.onNoMoreGroup().subscribe(
      group_id => {
        let group_index: number = this.groups.findIndex(function(group, index) {
          
          return group._id == group_id;
        });

        this.groups.splice(group_index, 1);
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
  }
  
  viewGroup(index: number){
    this.dialog.open(GroupDialog, {
      data: this.groups[index],
      panelClass: 'group-dialog',
      autoFocus: false
    })
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

  ngOnDestroy(): void {
    this.ioConnection = null;
    this.socketService.closeSocket();
  }

  getCogPlayground(facility: string){
    if(facility.includes('Factory') || facility.includes('V.P'))
      return 'Sellbot HQ';
    
    if(facility.includes('Mint') || facility.includes('C.F.O'))
      return 'Cashbot HQ';

    if(facility.includes('DA Office') || facility.includes('C.J'))
      return 'Lawbot HQ';

    return 'Bossbot HQ';
  }
  getPlayground(street: string){
    var playground = '';
    switch(street)
    {
      case 'Punchline Place': case 'Silly Street': case 'Loopy Lane': case 'Wacky Way':  
        playground = 'Toontown Central';
      break;
      case 'Buccaneer Boulevard': case 'Seaweed Street': case 'Anchor Avenue': case 'Lighthouse Lane':
        playground = 'Barnacle Boatyard';
      break;
      case 'Noble Nook': case 'Knight Knoll': case 'Wizard Way':
        playground = 'Ye Olde Toontowne';
      break;
      case 'Daisy Drive': case 'Sunflower Street': case 'Petunia Place': case 'Tulip Terrace':
        playground = 'Daffodil Gardens';
      break;
      case 'Alto Avenue': case 'Baritone Boulevard': case 'Soprano Street': case 'Teno Terrace':
        playground = 'Mezzo Melodyland';
      break;
      case 'Sleet Street': case 'Walrus Way': case 'Artic Avenue': case 'Polar Place':
        playground = 'The Brrrgh';
      break;
      case 'Legume Lane': case 'Peanut Place': case 'Acorn Avenue': case 'Walnut Way':
        playground = 'Acorn Acres';
      break;
      case 'Lullaby Lane': case 'Twilight Terrace': case 'Pajam Place':
        playground = 'Drowsy Dreamland';
      break;
    }
    return playground;
  }

  getBossTaskLocation(playground: string): string {
    var street = "";
    switch(playground)
    {
      case 'Toontown Central':
        street = 'Wacky Way';
      break;
      case 'Barnacle Boatyard':
        street = 'Anchor Avenue';
      break;
      case 'Ye Olde Toontowne':
        street = 'The Dungeon';
      break;
    }

    return street;
  }

  getImage(cogs_attacking){
    cogs_attacking = cogs_attacking === 'None' ? 'logo_icon' : cogs_attacking;
    return './assets/cogs/' + cogs_attacking + '.png';
  }

  getCogType(cogs_type: string){
    cogs_type = cogs_type.includes('HQ') ? cogs_type.slice(0, cogs_type.length-3) : cogs_type;
    return "url('./assets/" + cogs_type + ".png')";
  }

  getGradient(number){
    var percentageDone = Math.round(number * 100);
    return 'linear-gradient(90deg, #2cc218 ' + percentageDone + '%, gray '+ percentageDone + '%)';
  }

  reorderGroups(){
    var groups = this.groups.sort(function(a,b) {
      if (a.created > b.created)
        return -1;
      if (a.created < b.created)
        return 1;
      return 0;
    });
    
    this.groups = groups;
  }

  refresh(){
    this.isLoading = true;
    this.groupService.getGroups().subscribe(
      res=>{
        // console.log(res);
        if(!res)
          return; 

        this.groups = res;
        this.reorderGroups();

        this.isLoading = false;
        if(this.isFirstLoad)
          this.isFirstLoad = false;

        this.initConnection(); 
      },
      error => {
        console.log('error retrieving group data');
        console.log(error);
      }
    );
  }
}