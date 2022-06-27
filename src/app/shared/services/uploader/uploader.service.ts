import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Programs, selectPrograms } from '../../Models/selectPrograms'; 
import { Connection } from '../connection';
import {History } from '../../Models/history'
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  constructor(private _http : HttpClient, private _loginService : LoginService) { }

  getSelectProgram() : Observable<Programs>{
    let token = this._loginService.getToken();
    return this._http.get<Programs>(Connection.ENDPOINTBACK + 'DhisIntegration/getAllProgram/' + token);
  }


  uploadFile(param: any) : Observable<any>{
    return this._http.post<any>(Connection.ENDPOINTBACK + 'history', param);
      
  }

  getHistoryUser(user: string) : Observable<History[]>{
 
    return this._http.get<History[]>(Connection.ENDPOINTBACK + 'history/user?user='+user);
  }

}