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

  /*
  *Función que llama al endpoint al back para obtener todos los programas mapeados
  */
  getSelectProgram() : Observable<Programs>{
    let token = this._loginService.getToken();
    return this._http.get<Programs>(Connection.ENDPOINTBACK + 'DhisIntegration/getAllProgram/' + token);
  }

  /*
  *Función que llama al endpoint al back para ejecutar la importación
  */
  uploadFile(param: any) : Observable<any>{
    let url = this._http.post<any>(Connection.ENDPOINTBACK + 'DataImport', param);
    return url;
      
  }

  /*
  *Función que llama al endpoint al back para ejecutar la pre-validación
  */
  preuploadFile(param: any) : Observable<any>{
    console.log("Post: startDryRun")
    return this._http.post<any>(Connection.ENDPOINTBACK + 'DhisIntegration/startDryRun', param);
      
  }
  
  /*
  *Función que llama al endpoint al back para traer todo el historial relacionado a las importaciones
  */
  getHistoryUser(user: string, token: string) : Observable<History[]>{
  
    //console.log("URL: "+Connection.ENDPOINTBACK + 'history/user?user='+user+'&token='+token)
    return this._http.get<History[]>(Connection.ENDPOINTBACK + 'DataImport/history?user='+user+'&token='+token);
  }

}