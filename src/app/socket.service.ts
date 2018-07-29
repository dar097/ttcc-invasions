import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { IDistrict } from './invasions/idistrict';
 import { Event } from './client-enums';

import * as socketIo from 'socket.io-client';
import { IGroup } from './groups/igroup';
import { isDevMode } from '@angular/core';
import { ServerInfo } from './invasions/invs.component';

const SERVER_URL = /*isDevMode() ? 'http://localhost:5000' :*/ 'https://fathomless-inlet-84992.herokuapp.com';

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

    public onServerInfo(): Observable<ServerInfo> {
        return new Observable<ServerInfo>(observer => {
            this.socket.on('serverinfo', (data: ServerInfo) => observer.next(data));
        });
    }

    public onInvasionStart(): Observable<IDistrict> {
        return new Observable<IDistrict>(observer => {
            this.socket.on('invasionstart', (data: IDistrict) => observer.next(data));
        });
    }

    public onInvasionChange(): Observable<IDistrict> {
        return new Observable<IDistrict>(observer => {
            this.socket.on('invasionupdate', (data: IDistrict) => observer.next(data));
        });
    }
    public onInvasionEnd(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('invasionend', (data: string) => observer.next(data));
        });
    }

    public onGroup(): Observable<IGroup> {
        return new Observable<IGroup>(observer => {
            this.socket.on('group', (data: IGroup) => observer.next(data));
        });
    }

    public onCountChange(): Observable<number> {
        return new Observable<number>(observer => {
            this.socket.on('countchange', (data: number) => observer.next(data));
        });
    }

    public onNoMoreGroup(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('nomoregroup', (data: string) => observer.next(data));
        });
    }

    public serverMessage(): Observable<string> {
        return new Observable<string>(observer => {
            this.socket.on('sys-message', (data: string) => observer.next(data));
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