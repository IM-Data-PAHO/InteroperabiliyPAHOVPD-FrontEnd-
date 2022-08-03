import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { History } from 'src/app/shared/Models/history';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  displayedColumns: string[] = ['idRegistro', 'programId', 'usuario', 'estado','jsonSet', 'fecha', 'acciones'];
  historyData! :  History[];
  dataSource = new MatTableDataSource(this.historyData);
  constructor(private _uploaderService : UploaderService, private _login : LoginService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const usuario= this._login.getUsuario();  
    const tokenuser= this._login.getToken();
    this.getHistory(usuario, tokenuser);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getHistory(user:string, token:string){
    
    this._uploaderService.getHistoryUser(user, token).subscribe(result =>{    
      this.historyData = result;
      this.dataSource= new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //console.log(JSON.parse(this.historyData[1].jsonSet))
 
    });
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  descargar(i: number){
    console.log("sedescargo " + this.historyData[i].file);
    this.downloadFile(this.historyData[i].file, this.historyData[i].programsid)
  }
  
  downloadFile(base64String :any, fileName: string) {
    const source = `data:application/octet-stream;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.csv`
    link.click();
  }
 }