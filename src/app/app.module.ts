import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatToolbarModule, MatChipsModule, MatCardModule, MatIconModule, MatTooltipModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MatDialogModule } from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HistoryComponent } from './invasions/hist.component';
import { InvasionsComponent } from './invasions/invs.component';
import { InvasionsService } from './invasions/invasions.service';
import { PushNotificationsModule } from 'ng-push';
import { SecondsToDatePipe } from './invasions/timetoseconds.pipe';
import { FormsModule } from '@angular/forms';
import { GroupComponent } from './groups/groups.component';
import { GroupService } from './groups/groups.service';
import { SocketService } from './socket.service';
import { GroupDialog } from './groups/group.dialog';
import { ToonDialog } from './groups/toon.dialog';

@NgModule({
  declarations: [
    AppComponent, InvasionsComponent, HistoryComponent, GroupComponent, SecondsToDatePipe, GroupDialog, ToonDialog
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule, FlexLayoutModule, PushNotificationsModule, FormsModule,
    MatToolbarModule, MatChipsModule, MatCardModule, MatIconModule, MatTooltipModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MatDialogModule,
    RouterModule.forRoot([
       {path: '', component: InvasionsComponent},
       {path: 'invasions', component: InvasionsComponent},
       {path: 'history', component: HistoryComponent},
       {path: 'groups', component: GroupComponent},
       {path: '**', redirectTo: '/'},      
    ], {onSameUrlNavigation: 'reload'})
  ],
  providers: [ InvasionsService, GroupService, SocketService ],
  bootstrap: [AppComponent],
  entryComponents: [ GroupDialog, ToonDialog ]
})
export class AppModule { }
