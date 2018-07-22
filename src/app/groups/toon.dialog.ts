import {Component, Inject, Host, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { GroupService } from './groups.service';
import { FormGroup, FormBuilder, Validators, FormArray,FormControl } from '@angular/forms';
import { IToon } from './itoon';

@Component({
    selector: 'toon-dialog',
    templateUrl: './toon.dialog.html',
    styleUrls: ['./toon.dialog.css']
  })
  export class ToonDialog implements OnInit {
      toonForm: FormGroup;
      species: string[] = [
        'Alligator',
        'Bat',
        'Bear',
        'Beaver',
        'Cat',
        'Deer',
        'Dog',
        'Duck',
        'Fox',
        'Horse',
        'Monkey',
        'Mouse',
        'Pig',
        'Rabbit',
        'Raccoon'
      ];
      colorStyle: any = {};


    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: string, public groupService: GroupService, public fb: FormBuilder, public snackbar: MatSnackBar) {
        window.addEventListener('resize', this.onResize);
        setTimeout(this.onResize,100);
        this.dialogRef.disableClose = data == 'Create';

        this.toonForm = this.fb.group({
            name:['', Validators.required],
            laff: [15, Validators.required],
            species: ['', Validators.required],
            color: [{ value: 50, disabled: true}, Validators.required],
            saturation: [{ value: 100, disabled: true}]      
          });

        let speciesChange = this.toonForm.controls.species.valueChanges.subscribe(
            (val) => {
                if(val)
                {
                    this.toonForm.controls.color.enable();
                    this.toonForm.controls.saturation.enable();
                    speciesChange.unsubscribe();
                    speciesChange = null;
                }
            }
        );
    }

    ngOnInit(): void {
        if(this.data == 'Edit')
        {
            this.groupService.getToon().subscribe(
                result => {
                    this.toonForm.controls.name.setValue(result.name);
                    this.toonForm.controls.laff.setValue(result.laff);
                    this.toonForm.controls.species.setValue(result.species);
                    var colorVars = result.color.split('-');
                    this.toonForm.controls.color.setValue(colorVars[0]);
                    if(colorVars.length > 1)
                        this.toonForm.controls.saturation.setValue(colorVars[1]);

                    var toonimage = <HTMLImageElement>document.getElementById('toon-image');
                    if(toonimage)
                    {
                        setTimeout(function(){
                            toonimage.setAttribute('src', './assets/species/' + result.species + '.png');
                        }, 0);
                    }

                    this.colorStyle = {
                        filter: 'hue-rotate(' + this.toonForm.controls.color.value.toString() + 'deg) saturate(' + (this.toonForm.controls.saturation.value/100).toString() + ')',
                    }
                },
                err => {
                    this.snackbar.open(err, null, { duration: 1000 });
                    this.closeDia();
                }
            );
        }
        else
        {
            if(!localStorage.getItem('toon'))
                this.closeDia();
        }
    }

    setValue(control, value){
        this.toonForm.controls[control].setValue(value.value);
        this.colorStyle = {
            filter: 'hue-rotate(' + this.toonForm.controls.color.value.toString() + 'deg) saturate(' + (this.toonForm.controls.saturation.value/100).toString() + ')',
        }
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

    save(){
        if(this.toonForm.valid)
        {
            let newToon: IToon = this.toonForm.value;
            newToon.color = this.toonForm.controls.color.value + '-' + this.toonForm.controls.saturation.value;
            console.log(newToon); 
            
            if(this.data == 'Create')
            {
                this.groupService.createToon(newToon).subscribe(
                    result => {
                        localStorage.setItem('toon', result);
                        this.closeDia();
                    },
                    error => {
                        this.snackbar.open(error, null, { duration: 1000 });
                    }
                );
            }
            else if(this.data == 'Edit')
            {
                this.groupService.editToon(newToon).subscribe(
                    result => {
                        this.closeDia();
                    },
                    error => {
                        console.log(error);
                        this.snackbar.open(error, null, { duration: 1000 });
                    }
                );
            }
            else
            {
                this.closeDia();
            }
        }
        else
        {
            console.log(this.toonForm);
            this.snackbar.open('Please fill all required fields.', null, { duration: 1000 });
        }
    }
}