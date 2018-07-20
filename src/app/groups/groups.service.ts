import {throwError as observableThrowError,  Observable } from 'rxjs';
import { filter, scan, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IGroup } from './igroup';

@Injectable()
export class GroupService {
    private url: string = 'https://fathomless-inlet-84992.herokuapp.com';
    
    constructor(private http: HttpClient) {

    }

    getGroups(): Observable<IGroup[]> {
        return this.http.get<IGroup[]>(this.url + '/groups').pipe(catchError(this.handleError));
    }
    

    private handleError(err: HttpErrorResponse) {
        return observableThrowError(err.error);
    }
}