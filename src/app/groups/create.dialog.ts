import {Component, Inject, Host} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { IGroup } from './igroup';
import { Subscription } from 'rxjs';
import { SocketService } from '../socket.service';
import { Event } from '../client-enums';
import { GroupService } from './groups.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'create-dialog',
    templateUrl: './create.dialog.html',
    styleUrls: ['./create.dialog.css']
  })
  export class CreateDialog {
    groupForm: FormGroup;
    formValid: boolean = false;
    activities = [
        { name: "Building", value: "Building"},
        { name: "Facility", value: "Facility"},
        { name: "Boss", value: "Boss(HQ)"},
        { name: "Boss Task", value: "Boss(Playground)"},
    ];
    cog_types = [
        { name: 'Sellbot', color: '#887e7f' },
        { name: 'Cashbot', color: '#94aaa2' },
        { name: 'Lawbot', color: '#78808a' },
        { name: 'Bossbot', color: '#837a73' },
        { name: 'Boardbot', color: '#3f4040' },
    ];

    tasks = [
        { name: 'Toontown Central', color: '#ccb68d' },
        { name: 'Barnacle Boatyard', color: '#5091a5' },
        { name: 'Ye Olde Toontowne', color: '#555555' }
    ]

    playgrounds = [
        { name: 'Toontown Central', color: '#ccb68d', streets: [ 'Punchline Place', 'Silly Street', 'Loopy Lane', 'Wacky Way' ] },
        { name: 'Barnacle Boatyard', color: '#5091a5', streets: ['Buccaneer Boulevard', 'Seaweed Street', 'Anchor Avenue', 'Lighthouse Lane' ] },
        { name: 'Ye Olde Toontowne', color: '#555555', streets: [ 'Noble Nook', 'Knight Knoll', 'Wizard Way' ] },
        { name: 'Daffodil Gardens', color: '#a99340', streets: [ 'Daisy Drive', 'Sunflower Street', 'Petunia Place', 'Tulip Terrace' ] },
        { name: 'Mezzo Melodyland', color: '#feaadc', streets: [ 'Alto Avenue', 'Baritone Boulevard', 'Soprano Street', 'Tenor Terrace' ] },
        { name: 'The Brrrgh', color: '#91e1e8', streets: [ 'Sleet Street', 'Walrus Way', 'Artic Avenue', 'Polar Place' ] },
        { name: 'Acorn Acres', color: '#45814d', streets: [ 'Legume Lane', 'Peanut Place', 'Acorn Avenue', 'Walnut Way' ] },
        { name: 'Drowsy Dreamland', color: '#3f366b', streets: [ 'Lullaby Lane', 'Twilight Terrace', 'Pajama Place' ] }
    ];

    facilities = [
        { name: 'Factory', color: '#887e7f', types: [ 'Short', 'Short/Sound', 'Side', 'Side/Sound', 'Long/Sound', 'Long', 'Any', 'Any/Sound' ] },
        { name: 'Mint', color: '#94aaa2', types: ['Coin', 'Coin/Sound', 'Dollar', 'Dollar/Sound', 'Bullion', 'Bullion/Sound', 'Any', 'Any/Sound' ] },
        { name: 'DA Office', color: '#78808a', types: [ 'A', 'A/Sound', 'B', 'B/Sound', 'C', 'C/Sound', 'D', 'D/Sound', 'Any', 'Any/Sound' ] },
        { name: 'Cog Golf', color: '#837a73', types: [ 'Front Three', 'Front Three/Sound', 'Middle Six', 'Middle Six/Sound', 'Back Nine', 'Back Nine/Sound', 'Any', 'Any/Sound' ] }
    ];

    bosses = [
        { name: 'V.P', color: '#887e7f' },
        { name: 'C.F.O', color: '#94aaa2' },
        { name: 'C.J', color: '#78808a' },
        { name: 'C.E.O', color: '#837a73' }
    ];

    districts = [
        'Bamboozle Bay',
        'Boulderbury',
        'Bugle Bay',
        'Comical Canyon',
        'Feather Field',
        'Foghorn Falls',
        'Geyser Gulch',
        'High-Dive Hills',
        'Hypno Harbor',
        'Jellybean Junction',
        'Jollywood',
        'Kazoo Kanyon',
        'Lazy Lagoon',
        'Marble Mountains',
        'Opera Oasis',
        'Piano Peaks',
        'Quicksand Quarry',
        'Rake River',
        'Selter Summit',
        'Splatville',
        'Whistle Woods'
    ];
    
    constructor(public dialogRef: MatDialogRef<any>, public groupService: GroupService, public fb: FormBuilder, public snackbar: MatSnackBar){
        window.addEventListener('resize', this.onResize);
        setTimeout(this.onResize,100);

        this.groupForm = this.fb.group({
            activity:['', Validators.required],
            size: [1, Validators.required],
            building_level: [1, Validators.required],
            cog_type: ['', Validators.required],
            street: ['', Validators.required],
            facility_type: ['', Validators.required],
            boss: ['', Validators.required],
            playground: ['Toontown Central', Validators.required],
            district: ['Bamboozle Bay', Validators.required]
        });

        this.groupForm.statusChanges.subscribe(//bypass value changed after check error
            (res) => {
                let instance = this;
                setTimeout(function(){
                    instance.formValid = instance.groupForm.valid;
                
                },0);
            }
        );

        this.groupForm.controls.activity.valueChanges.subscribe(
            (value: string) => {
                console.log(value);
                var required = [];
                var notrequired = [];
                switch(value)
                {
                    case 'Building':
                        required = [ 'building_level', 'cog_type', 'street'];
                        notrequired = [ 'facility_type', 'boss', 'playground'];
                    break;
                    case 'Facility':
                        required = [ 'facility_type', ];
                        notrequired = [ 'building_level', 'cog_type', 'street', 'boss', 'playground'];
                    break;
                    
                    case 'Boss(HQ)':
                        required = [ 'boss' ];
                        notrequired = [ 'building_level', 'facility_type', 'cog_type', 'street', 'playground'];
                    break;
                    
                    case 'Boss(Playground)':
                        required = [ 'playground'];
                        notrequired = [ 'building_level', 'facility_type', 'cog_type', 'street', 'boss'];
                    break;
                }

                for(var i = 0; i < required.length; i++)
                {
                    this.groupForm.controls[required[i]].setValidators([Validators.required]);
                }

                for(var i = 0; i < notrequired.length; i++)
                {
                    this.groupForm.controls[notrequired[i]].reset();//setValue(null);
                    this.groupForm.controls[notrequired[i]].setValidators([]);
                    this.groupForm.controls[notrequired[i]].updateValueAndValidity();
                    //this.groupForm.controls[notrequired[i]].setErrors(null);
                }
            }
        );
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

    createGroup(){
        if(this.groupForm.valid)
        {
            var group: IGroup = this.groupForm.value;
            this.groupService.createGroup(group).subscribe(
                res => {
                    this.snackbar.open(res.message, null, { duration: 1000});
                    this.dialogRef.close();
                },
                error => {
                    this.snackbar.open(error, null, { duration: 1000});
                }
            );
        }
        else
        {
            this.snackbar.open('Please fill in all fields', null, { duration: 1000});
        }
    }
  }