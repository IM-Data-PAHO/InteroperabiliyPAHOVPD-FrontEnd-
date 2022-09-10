import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Connection } from '../connection';
import { CookieService } from "ngx-cookie-service";
import { Router } from '@angular/router';
import { LoginResponse } from '../../Models/LoginResponse';
import { login } from '../../Models/login';
import { userSettings } from '../../Models/userSettings';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http : HttpClient,private _cookieService: CookieService, private _router: Router) { }

  loginInterno() : Observable<any[]>{
    this._cookieService.deleteAll();
    return this._http.get<any[]>('./assets/data/usuarios.json');
  }
  /*
  *Función que llama al endpoint al back que hace el login
  */
  login(user: login): Observable<LoginResponse> {
    this._cookieService.deleteAll();
    var response =  this._http.post<LoginResponse>(Connection.ENDPOINTBACK + 'Login/getUser', user);
    return response; 
  }
  /*
  *Función que llama al endpoint al back que trae las configuraciones del usuario
  */
  getlanguage(token: string): Observable<userSettings> {
    var response = this._http.get<userSettings>(Connection.ENDPOINTBACK + 'Login/getUserSetting/' + token);
    return response;   
  } 

  /*
  *Función que asigna a las cookies el token, usuario y rol
  */
  setToken(token: string, user: string){
    this._cookieService.set("token", token);
    this._cookieService.set("usuario", user);
    this._cookieService.set("rol", user);
  }
/*
  *Función que obtiene el token
  */
  getToken(){
    return this._cookieService.get("token");
  }

  /*
  *Función que obtiene el usuario
  */
  getUsuario(){
    return this._cookieService.get("usuario");
  }

  /*
  *Función que obtiene el rol 
  */
  getRole(){
  return this._cookieService.get("rol");
  }
  
  /*
  *Función para cerrar la sesión del usuario
  */
  logout(){
    this._cookieService.deleteAll();
    this._router.navigateByUrl('login');
    
  }

}
