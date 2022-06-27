import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HistoryComponent } from './history/history.component';
import { UploaderComponent } from './uploader/uploader.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children:[
    {path:'', component:UploaderComponent},
    {path:'upload', component:UploaderComponent},
    {path:'history', component:HistoryComponent}

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }