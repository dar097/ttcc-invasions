import {Component, Inject, Host} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { GroupService } from './groups.service';

@Component({
    selector: 'toon-dialog',
    templateUrl: './toon.dialog.html',
    styleUrls: ['./toon.dialog.css']
  })
  export class ToonDialog {

    constructor(public dialogRef: MatDialogRef<any>, public groupService: GroupService) {
        window.onresize = this.onResize;
        setTimeout(this.onResize,100);
    }

    onResize(){
        var height = window.innerHeight - 50;
        var dialogPanel = document.getElementsByClassName('mat-dialog-container')[0];
        var dia = document.getElementById('dialog-toon');
        if(dia)
        {
            if(dialogPanel)
                dia.style.width = dialogPanel.clientWidth + 'px';
            dia.style.maxHeight = height + 'px';
        }
    }

    closeDia(){
        this.dialogRef.close();
    }

    getToonImage(species: string): string {

        return "url('./assets/species/" + species + ".png')";
    }
}