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

  displayedColumns: string[] = ['idRegistro', 'country','programId', 'usuario', 'namefile','acciones','namefile1','acciones1','jsonSet', 'fecha'];
  historyData! :  History[];
  dataSource = new MatTableDataSource(this.historyData);
  loading=false;
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
 /*
  *Función que llama al servicio  para ejecutar la pre-validación
  */
  getHistory(user:string, token:string){
    this.loading=true;
    this._uploaderService.getHistoryUser(user, token).subscribe(result =>{    
      this.historyData = result;
      this.dataSource= new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading=false;
      //console.log(this.historyData) 
    });
    
  }

  /*
  *Función para el filtrar la data de la tabla del historial
  */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /*
  *Función para descargar el primer archivo 
  */
  descargar(i: number){
    console.log("sedescargo " + this.historyData[i].namefile);
    this.downloadFile(this.historyData[i].file, this.historyData[i].namefile)
  }

  /*
  *Función para descargar el segundo archivo 
  */
  descargar1(i: number){
    console.log("sedescargo " + this.historyData[i].namefile1);
    this.downloadFile(this.historyData[i].file1, this.historyData[i].namefile1)
  }
  
  /*
  *Función para descargar 
  */
  downloadFile(base64String :any, fileName: string) {
    const source = `data:application/octet-stream;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }
 }