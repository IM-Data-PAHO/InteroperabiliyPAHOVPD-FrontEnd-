import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { UploaderComponent } from './uploader/uploader.component';
import { HistoryComponent } from './history/history.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(htpp: HttpClient){
  return new TranslateHttpLoader(htpp, './assets/i18n/', '.json' );
}



@NgModule({
  declarations: [
    DashboardComponent,
    UploaderComponent,
    HistoryComponent, 
    NavBarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader:{
              provide: TranslateLoader,
              useFactory: createTranslateLoader,
              deps: [HttpClient]
             }
    })
  ]
})
export class DashboardModule { }
