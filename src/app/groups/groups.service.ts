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

    editToon(toon: IToon): Observable<string> {
        toon._id = localStorage.getItem('toon');
        return this.http.post<string>(this.url + '/toon/edit', toon).pipe(catchError(this.handleError));
    }

    getToon(): Observable<IToon>{
        return this.http.get<IToon>(this.url + '/toon', { params: { toon: localStorage.getItem('toon') } }).pipe(catchError(this.handleError));
    }

    getGroups(): Observable<IGroup[]> {
        return this.http.get<IGroup[]>(this.url + '/groups').pipe(catchError(this.handleError));
    }

    createGroup(group: IGroup): Observable<any> {
        var groupObj = Object(group);
        for(var item in groupObj)
        {
            if(groupObj[item] == null)
            {
                // console.log(item)
                delete groupObj[item];
            }
        }
        if(groupObj.size == 1)
            delete groupObj.size;
        else
            groupObj.size--;

        groupObj.host = localStorage.getItem('toon')
        return this.http.post<any>(this.url + '/group/create', groupObj).pipe(catchError(this.handleError));
    }

    joinGroup(group: string): Observable<any> {
        return this.http.post<any>(this.url + '/group/join',{ toon: localStorage.getItem('toon'), group: group }).pipe(catchError(this.handleError));
    }

    leaveGroup(group: string): Observable<any> {
        return this.http.post<any>(this.url + '/group/leave',{ toon: localStorage.getItem('toon'), group: group }).pipe(catchError(this.handleError));
    }

    deleteGroup(group: string): Observable<any>{
        return this.http.post<any>(this.url + '/group/delete',{ adminpass: localStorage.getItem('toon'), group: group }).pipe(catchError(this.handleError));
    }
    

    private handleError(err: HttpErrorResponse) {
        return observableThrowError(err.error);
    }
}