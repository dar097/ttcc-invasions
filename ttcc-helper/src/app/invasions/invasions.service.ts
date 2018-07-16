import { IDistrict } from './idistrict';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { filter, scan, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class InvasionsService {
    private url: string = 'https://fathomless-inlet-84992.herokuapp.com';
    
    constructor(private http: HttpClient) {

    }

    getDistrictdata(): Observable<IDistrict[]> {
        return this.http.get<IDistrict[]>(this.url + '/latest').pipe(catchError(this.handleError));
    }
    

    private handleError(err: HttpErrorResponse) {
        return observableThrowError(err.error);
    }
}