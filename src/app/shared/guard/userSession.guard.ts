import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { Observable } from 'rxjs';
import swal from'sweetalert2';

@Injectable()
export class userSession implements CanActivate {

    constructor(private _authService: LoginService, private router: Router) { }

    canActivate() {

        let token = this._authService.getToken()
        if (token == '') {
            swal.fire("No tiene sesión inciada");
            this.router.navigate(['']);
            return false;
        }

        return true;
    }
}