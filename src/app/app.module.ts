import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { userSession } from './shared/guard/userSession.guard';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function createTranslateLoader(htpp: HttpClient){
  return new TranslateHttpLoader(htpp, './assets/i18n/', '.json' );
}



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    FormsModule, 
    HttpClientModule, 
    SharedModule,  
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader:{
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
             }
    })
  ],
  providers: [
    CookieService,
    userSession,
   ],
  bootstrap: [AppComponent]

})
export class AppModule { }
