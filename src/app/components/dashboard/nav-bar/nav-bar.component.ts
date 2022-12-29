import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor( private _loginService : LoginService) { }

  ngOnInit(): void {
  }
 /*
  *Función que llama al servicio para cerrar la sesión 
  */
  logout(){
    this._loginService.logout();
  }

}
