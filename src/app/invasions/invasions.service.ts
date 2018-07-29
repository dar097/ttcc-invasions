import { IDistrict } from './idistrict';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { filter, scan, catchError } from 'rxjs/operators';
import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IHistory } from './ihistory';
import { ServerInfo } from './invs.component';

@Injectable()
export class InvasionsService {
    private url: string = /*isDevMode() ? 'http://localhost:5000' :*/ 'https://fathomless-inlet-84992.herokuapp.com';
    
    constructor(private http: HttpClient) {

    }

    getDistrictdata(): Observable<IDistrict[]> {
        return this.http.get<IDistrict[]>(this.url + '/latest').pipe(catchError(this.handleError));
    }

    getHistorydata(): Observable<IHistory[]> {
        return this.http.get<IHistory[]>(this.url + '/history').pipe(catchError(this.handleError));
    }

    getServerInfo(): Observable<ServerInfo> {
        return this.http.get<ServerInfo>(this.url + '/serverinfo').pipe(catchError(this.handleError));
    }
    

    private handleError(err: HttpErrorResponse) {
        return observableThrowError(err.error);
    }
}