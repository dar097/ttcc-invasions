import {Component, Inject, Host} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { IGroup } from './igroup';

@Component({
    selector: 'group-dialog',
    templateUrl: './group.dialog.html',
    styleUrls: ['./group.dialog.css']
  })
  export class GroupDialog {
      sortedToons: any[] = [];
      inThisGroup: boolean = false;
    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: IGroup) {
        this.sortToons();
        window.onresize = this.onResize;
        setTimeout(this.onResize,100);
    }

    onResize(){
        var height = window.innerHeight - 50;
        var dialogPanel = document.getElementsByClassName('mat-dialog-container')[0];
        var dia = document.getElementById('dialog-group');
        if(dia)
        {
            if(dialogPanel)
                dia.style.width = dialogPanel.clientWidth + 'px';
            dia.style.maxHeight = height + 'px';
        }
    }
    
    makeArray(count): number[]{
        return Array(count).fill(1);
    }

    closeDia(){
        this.dialogRef.close();
    }

    getBossTaskLocation(): string {
        var street = "";
        switch(this.data.playground)
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

    group() {
        let toon = localStorage.getItem('toon');
        if(toon)
        {
            //join or leave depending on isInGroup   
        }
        else
        {
            //create a toon
        }
    }

    sortToons(){
        this.sortedToons = [{ toon: this.data.host, count: 1}];
        //CHECK IF USER IS IN GROUP
        for(var toon in this.data.toons)
        {
            var currentToon = this.data.toons[toon];
            let toon_index: number = this.sortedToons.findIndex(function(sortedToon, index) {
                return sortedToon.toon._id == currentToon._id;
            });

            if(toon_index == -1)
            {
                this.sortedToons.push({ toon: currentToon, count: 1 });
            }
            else
            {
                this.sortedToons[toon_index].count++;
            }
        }
    }

    getToonImage(species: string): string {

        return "url('./assets/species/" + species + ".png')";
    }

    getPlaygroundFromStreet(street: string): string{
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

    getPlaygroundFromCog(cog: string){
        if(cog.includes('Factory') || cog.includes('V.P'))
          return 'Sellbot HQ';
        
        if(cog.includes('Mint') || cog.includes('C.F.O'))
          return 'Cashbot HQ';
    
        if(cog.includes('DA Office') || cog.includes('C.J'))
          return 'Lawbot HQ';
        
        if(cog.includes('Cog Golf') || cog.includes('C.E.O'))
          return 'Bossbot HQ';

        return '';
      }

    getTypeImage(cogs_type: string): string{
        cogs_type = cogs_type.includes('HQ') ? cogs_type.slice(0, cogs_type.length-3) : cogs_type;
        return "./assets/" + cogs_type + ".png";
    }

    getPlaygroundImage(playground: string): string{
        return "url('./assets/playgrounds/" + playground + ".png')";
    }

    getActivityImage(): string{
        var image = './assets/';
        switch(this.data.activity)
        {
            case 'Building':
                image += 'places/' + this.data.building_level + '-Building.png';
            break;
            case 'Facility':
                image += 'places/' + this.data.facility_type.split('-')[0] + '.png';
            break;
            case 'Boss(HQ)':
                image += 'cogs/' + this.data.boss.split('.').join('') + '.png';
            break;
            case 'Boss(Playground)':
                image += 'places/' + this.data.playground + '-boss.png';
            break;
        }

        return "url('" + image + "')";
    }

    getRightImage(): string{
        switch(this.data.activity)
        {
            case 'Building':
                return this.getPlaygroundImage(this.getPlaygroundFromStreet(this.data.street));
            case 'Facility':
                return this.getPlaygroundImage(this.getPlaygroundFromCog(this.data.facility_type));
            case 'Boss(HQ)':
                return this.getPlaygroundImage(this.getPlaygroundFromCog(this.data.boss));
            case 'Boss(Playground)':
                return this.getPlaygroundImage(this.data.playground);
            default:
                return '';
        }
    }
}