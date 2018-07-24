import { GroupService } from './groups.service';

import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { PushNotificationsService } from 'ng-push';
import { Router } from '@angular/router';
import { IGroup } from './igroup';
import { SocketService } from '../socket.service';
import { Event } from '../client-enums';
import { Subscription } from '../../../node_modules/rxjs';
import { MatDialog, MatDialogRef } from '../../../node_modules/@angular/material';
import { GroupDialog } from './group.dialog';
import { ToonDialog } from './toon.dialog';
import { CreateDialog } from './create.dialog';

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupComponent implements AfterViewInit, OnDestroy {
  hover: boolean = false;
  width: number = 0;
  groups: IGroup[] = [];
  title = 'Group Finder';
  isLoading: boolean = false;
  isFirstLoad: boolean = true;
  ioConnection: Subscription;
  groupDialog: MatDialogRef<any, any>;
  toonDialog: MatDialogRef<any, any>;
  createDialog: MatDialogRef<any, any>;
  hasToon: boolean = false;
  toonInGroup: boolean = false;
  toonCount = 0;
  admin: boolean = false;
  
  constructor(public groupService: GroupService, private pushNotifications: PushNotificationsService, public router: Router, public socketService: SocketService, public dialog: MatDialog){
    pushNotifications.requestPermission();
    let instance = this;
    window.onresize = function(){
      instance.onResize(); 
    }

    instance.onResize();
    this.refresh();

    this.hasToon = localStorage.getItem('toon') != null;
    this.admin = localStorage.getItem('adminpass') == 'systemadminbypass';

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

        if(group_index != -1)
          this.groups.splice(group_index, 1);
      }
    );

    this.socketService.onCountChange().subscribe(count => this.toonCount = count);

    this.socketService.onGroupPurge().subscribe(
      () => {
        this.refresh();
      }
    );

    // this.socketService.onEvent(Event.CONNECT).subscribe(
    //   () => {
    //     //console.log('connected');
    //   }
    // );
      
    // this.socketService.onEvent(Event.DISCONNECT).subscribe(
    //   () => {
    //     //console.log('disconnected');
    //   }
    // );
  }
  
  createGroup(){
    this.createDialog = this.dialog.open(CreateDialog, {
      panelClass: 'create-dialog',
      autoFocus: false
    });
  }

  popToon(data){
    // console.log(data);
    if(data != 'Create' && data != 'Edit')
      return;

    this.toonDialog = this.dialog.open(ToonDialog, {
      panelClass: 'toon-dialog',
      data: data,
      autoFocus: false
    });

    this.toonDialog.afterClosed().subscribe(
      () => {
        this.hasToon = localStorage.getItem('toon') != null;
      }
    );
  }

  viewGroup(index: number){
    if(localStorage.getItem('toon'))
    {
      this.groupDialog = this.dialog.open(GroupDialog, {
        data: this.groups[index],
        panelClass: 'group-dialog',
        autoFocus: false
      });
      this.groupDialog.afterClosed().subscribe(
        (result: string) => {
          if(result)
          {
            if(result == 'notoon')
            {
              this.popToon('Create');
            }
            if(result == 'left')
            {
              this.toonInGroup = false;
            }
          }
        }
      );
    }
    else
    {
      this.popToon('Create');
    }
  }

  deleteGroup(index: number){
    this.groupService.deleteGroup(this.groups[index]._id).subscribe();
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
      // console.log(a);
      // console.log(b);
      if (a.created > b.created)
        return -1;
      if (a.created < b.created)
        return 1;
      return 0;
    });
    
    this.toonInGroup = false;
    var localToon = localStorage.getItem('toon');
    if(groups.length > 0 && localToon)
    {
      if(groups.find(group => group.host._id == localToon) || groups.find(group => group.toons.find(toon => toon._id == localToon) != null))
      {
        this.toonInGroup = true;
      }
    }

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
        console.log('Error retrieving group data');
        console.log(error);
      }
    );
  }
}