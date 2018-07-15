import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatToolbarModule, MatChipsModule, MatCardModule, MatIconModule, MatTooltipModule, MatDividerModule, MatButtonModule, MatProgressBarModule } from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { InvasionsComponent } from './invasions/invs.component';
import { InvasionsService } from './invasions/invasions.service';
import { PushNotificationsModule } from 'ng-push';
import { SecondsToDatePipe } from './invasions/timetoseconds.pipe';

@NgModule({
  declarations: [
    AppComponent, InvasionsComponent, SecondsToDatePipe
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, FlexLayoutModule, PushNotificationsModule, 
    MatToolbarModule, MatChipsModule, MatCardModule, MatIconModule, MatTooltipModule, MatDividerModule, MatButtonModule, MatProgressBarModule, 
    RouterModule.forRoot([
       {path: '', component: InvasionsComponent},
       {path: 'invasions', component: InvasionsComponent},
      // {path: 'properties', component: PropertiesComponent},
      // {path: 'properties/edit/:id', canActivate: [LoginGuardService], component: EditPropertyComponent},
      // {path: 'properties/add', canActivate: [LoginGuardService], component: AddPropertyComponent},
      // {path: 'properties/:id', component: PropertyComponent},
      // {path: 'sign-up', component: SignUpComponent},
      // {path: 'login', component: LoginComponent}
    ], {onSameUrlNavigation: 'reload'})
  ],
  providers: [ InvasionsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
