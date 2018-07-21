import {throwError as observableThrowError,  Observable } from 'rxjs';
import { filter, scan, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IGroup } from './igroup';
import { IToon } from './itoon';

@Injectable()
export class GroupService {
    private url: string = 'https://fathomless-inlet-84992.herokuapp.com';
    private dev_url: string = 'http://localhost:5000';
    
    constructor(private http: HttpClient) {

    }

    createToon(toon: IToon): Observable<string> {
        return this.http.post<string>(this.url + '/toon/create', toon).pipe(catchError(this.handleError));
    }

    getGroups(): Observable<IGroup[]> {
        return this.http.get<IGroup[]>(this.url + '/groups').pipe(catchError(this.handleError));
    }

    joinGroup(group: string): Observable<string> {
        return this.http.post<string>(this.url + '/group/join',{ toon: '', group: group }).pipe(catchError(this.handleError));
    }

    leaveGroup(group: string): Observable<string> {
        return this.http.post<string>(this.url + '/group/leave',{ toon: '', group: group }).pipe(catchError(this.handleError));
    }
    

    private handleError(err: HttpErrorResponse) {
        return observableThrowError(err.error);
    }
}