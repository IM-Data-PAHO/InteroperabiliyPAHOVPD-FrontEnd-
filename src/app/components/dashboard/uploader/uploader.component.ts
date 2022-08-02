import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Program, periodo, Responsepreload, ValidateDto, SumaryerrorDto } from 'src/app/shared/Models/selectPrograms';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';
import { TranslateService } from '@ngx-translate/core';
import swal from'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})

export class UploaderComponent implements OnInit {
  listresponse!: Responsepreload;
  selectProgramsOptions!: Program[];
  selectPeriod!: periodo[];
  form: FormGroup;
  uploadFile!: Array<File>
  file!: File; 
  uploadFile01!: Array<File>
  file01!: File; 
  loading=false;
  displayedColumns: string[] = ['indexpreload','id','detail','ln', 'cl', 'ms','errortype' ,'value'];
  displayedColumnssumary: string[] = ['date','mandatory','compulsory','option'];
  ValidateDto! :  ValidateDto[];
  SumaryDto! : SumaryerrorDto[];
  dataSource = new MatTableDataSource(this.ValidateDto);
  dataSourcesumary = new MatTableDataSource(this.SumaryDto);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private _uploaderService : UploaderService, private fb: FormBuilder, private _login : LoginService, public translate: TranslateService) {
      this.form = this.fb.group({
      program: ['', Validators.required],
      attachment: ['', Validators.required],
      startdate:['', Validators.required],
      enddate:['', Validators.required],
    })
   }

  ngOnInit(): void {
    this.loadSelectPrograms();
    this.loadSelectPeriod();
  }

  loadSelectPeriod(){
    const max = new Date().getFullYear()
    const min = max - 9
    const years:periodo[] = []
    for (let i = max; i >= min; i--) {
      const p: periodo = { id: i, };
      years.push(p)
      }
    this.selectPeriod = years;
  }
  selectdate(item: any){
    // if(new Date().getFullYear() == item)
    //    console.log(item+' : '+item)
    // else   
    //    console.log(item+' : '+(item+1))
    //    console.log(this.form.value.startdate)
    this.onValidationDate();
    // console.log(item)
  }
  loadSelectPrograms(){
    this._uploaderService.getSelectProgram().subscribe(data =>{
      let {programs} = data;
      this.selectProgramsOptions = programs;

    })
  }
  onPreupload(){
    this.loading=true;
    const file: File = this.uploadFile[0];
   // const file01: File = this.uploadFile01[0];
    let formData = new FormData();
    formData.append('Programsid', this.form.value.program);
    formData.append( 'CsvFile', file, file.name);
    // formData.append( 'CsvFile01', file01, file01.name);
    formData.append( 'UserLogin',  this._login.getUsuario() );
    formData.append( 'startdate', this.form.value.startdate);
    formData.append( 'enddate', this.form.value.enddate);
    formData.append( 'token', this._login.getToken() );
    this._uploaderService.preuploadFile(formData).subscribe(result =>{
    //console.log("result: "+ JSON.stringify(result))
    let mensaje = '';
    // if (!result){
      this.loading=false;
      this.listresponse = result;
      this.ValidateDto = this.listresponse.response;
      this.SumaryDto = this.listresponse.sumary;
      console.log( JSON.stringify(this.listresponse.sumary));
      console.log( this.SumaryDto);
      this.dataSource= new MatTableDataSource(this.ValidateDto);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourcesumary= new MatTableDataSource(this.SumaryDto);
      this.dataSourcesumary.paginator = this.paginator;
      this.dataSourcesumary.sort = this.sort;


     if(this.dataSource.data.length == 0)
      this.translate.get('The file was successfully processed').subscribe((res: string) => { swal.fire(res); });
     else
       this.translate.get('The file contains data errors').subscribe((res: string) => { swal.fire(res); });
    // }

    },error=>{
      this.loading=false;
      this.translate.get('An error occurred Please try again').subscribe((res: string) => {
        swal.fire(res);
      });
      // return swal.fire('Ocurrio un error Intente de nuevo');
    })

  }

  onUpload(){
    this.loading=true;
    const file: File = this.uploadFile[0];
    let formData = new FormData();
    formData.append('Programsid', this.form.value.program);
    formData.append( 'CsvFile', file, file.name);
    if(this.uploadFile01){
      const file01: File = this.uploadFile01[0];
      formData.append( 'CsvFile01', file01, file01.name);
    }    
    formData.append( 'UserLogin',  this._login.getUsuario() );
    formData.append( 'startdate', this.form.value.startdate);
    formData.append( 'enddate', this.form.value.enddate);
    formData.append( 'token', this._login.getToken() );
    this._uploaderService.uploadFile(formData).subscribe(result =>{
    //console.log("result: "+ JSON.stringify(result))
      let mensaje = '';
      if (!result){
        //  mensaje = 'El archivo se proceso Exitosamente';
        //  this.loading=false;
        //  return swal.fire(mensaje);
        this.loading=false;
        this.translate.get('The file was successfully processed').subscribe((res: string) => {
          swal.fire({
            title: 'Success',
            text: res,
            timer: 9000
          });
        });
        this.clearUploadfile();
      }
      for (let i in result )
        {
          mensaje = mensaje + result[i].errorMessage + '\n ' ; 
        }
        this.loading=false;
        this.translate.get('The file could not be processed for the following reasons' + mensaje).subscribe((res: string) => {
          swal.fire({
            title: 'Warning',
            text: res,
            timer: 9000
          });
        });
        this.clearUploadfile();
        
      //  return swal.fire('No se pudo procesar el archivo  por los siguientes motivos: \n'+ mensaje);
    },error=>{
      this.loading=false;
      this.translate.get('An error occurred Please try again').subscribe((res: string) => {
        swal.fire({
          title: 'Error',
          text: res,
          timer: 9000
        });
        this.clearUploadfile();
      });     
      
      // return swal.fire('Ocurrio un error Intente de nuevo');
    })
    // this.clearUploadfile();
  }
  onFileSelected(e:any){
    if(e.target.id=="file")
      this.uploadFile = e.target.files;
    if (e.target.id =="file01")
      this.uploadFile01 = e.target.files;
  }

  onValidationDate(){
    if(this.form.value.enddate){
      if(this.form.value.enddate<this.form.value.startdate){
        this.loading=false;
        this.translate.get('End date cannot be greater than start date').subscribe((res: string) => {
          swal.fire(res);
        });
      }
    }
  }
  
 clearUploadfile(){
  location.reload(); 
 }
}