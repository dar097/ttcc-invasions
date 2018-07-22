import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { IDistrict } from './invasions/idistrict';
 import { Event } from './client-enums';

import * as socketIo from 'socket.io-client';
import { IGroup } from './groups/igroup';

const SERVER_URL = 'http://localhost:5000';

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    public initSocket(): void {
        if(!this.socket)
            this.socket = socketIo(SERVER_URL);
    }

    public send(district: IDistrict): void {
        this.socket.emit('district', district);
    }

    /*public onDistrict(): Observable<IDistrict> {
        return new Observable<IDistrict>(observer => {
            this.socket.on('district', (data: IDistrict) => observer.next(data));
        });
    }*/

    public onGroup(): Observable<IGroup> {
        return new Observable<IGroup>(observer => {
            this.socket.on('group', (data: IGroup) => observer.next(data));
        });
    }

    public onNoMoreGroup(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('nomoregroup', (data: string) => observer.next(data));
        });
    }

    public onGroupPurge(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('purge', () => observer.next());
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public closeSocket(): void {
        if(this.socket)
        {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}