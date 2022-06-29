import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../shared/services/login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedLanguage = 'en';

  constructor(private translateService: TranslateService, private _loginService : LoginService, ){
    this.translateService.setDefaultLang(this.selectedLanguage);
    this.translateService.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    this.getLanguage()
  }

  getLanguage(){
    this._loginService.getlanguage(this._loginService.getToken()).subscribe(data =>{
      this.selectedLanguage = data.settings.keyUiLocale? data.settings.keyUiLocale:this.selectedLanguage ;
      this.translateService.setDefaultLang(this.selectedLanguage);
      this.translateService.use(this.selectedLanguage); 
  });
  }
}
