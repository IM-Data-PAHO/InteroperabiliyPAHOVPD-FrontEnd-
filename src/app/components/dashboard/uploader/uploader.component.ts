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
  displayedColumnssumary: string[] = ['date','mandatory','compulsory','option', 'deletedEvents','totalrows'];
  ValidateDto! :  ValidateDto[];
  SumaryDto! : SumaryerrorDto[];
  element: any;
  elementFile: any;
  check0: any;
  check1: any;
  check2: any;
  separator : any;
  dataSource = new MatTableDataSource(this.ValidateDto);
  dataSourcesumary = new MatTableDataSource(this.SumaryDto);
  err: string = '';
  totalrows: number = 0;
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
    var separator = (this.check0?this.check0:false);
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
    formData.append( 'separator', this.separator );
    this._uploaderService.preuploadFile(formData).subscribe(result =>{
    //console.log("result: "+ JSON.stringify(result))
    let mensaje = '';
    // if (!result){
      this.loading=false;
      this.listresponse = result;
      this.ValidateDto = this.listresponse.response;
      this.SumaryDto = this.listresponse.sumary;
      var uno = this.listresponse.totalFile1;
      var dos = this.listresponse.totalFile2;
      console.log( JSON.stringify(this.listresponse.sumary));
      console.log( this.SumaryDto);
      this.dataSource= new MatTableDataSource(this.ValidateDto);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourcesumary= new MatTableDataSource(this.SumaryDto);
      this.dataSourcesumary.paginator = this.paginator;
      this.dataSourcesumary.sort = this.sort;

     if(this.dataSource.data.length == 0 && this.listresponse.state == '200')
      this.translate.get('The file was successfully processed').subscribe((res: string) => { swal.fire(res); });
     else
      this.err = this.listresponse.state == '200'?'':this.listresponse.state;
      this.translate.get('The file contains data errors '+ this.err.toString()).subscribe((res: string) => { swal.fire(res); });    

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
    var separator = (this.check0?this.check0:false);
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
    formData.append( 'separator', this.separator );
    this._uploaderService.uploadFile(formData).subscribe(result =>{
    //console.log("result: "+ JSON.stringify(result))
      let mensaje = '';
      if (!result){        
        this.loading=false;
        this.translate.get('The file was processed successfully, please keep an eye on your email to follow up on the import').subscribe((res: string) => {
          swal.fire({
            title: 'Success',
            text: res,
            timer: 9000
          });
        });
        this.clearUploadfile();
      }
      if(result){ 
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
        }

    },error=>{
      this.loading=false;
      let mensaje = '';
      for (let i in error )
        {
          mensaje = mensaje + error[i].errorMessage + '\n ' ; 
        }
      this.translate.get('The file contains data errors, please keep an eye on your email to follow up on the import').subscribe((res: string) => {
        swal.fire({
          title: 'Error',
          text: res,
          timer: 9000
        });
        this.clearUploadfile();
      });     
      
    
    })    
  }
  onFileSelected(e:any){
    if(e.target.id=="file")
      this.uploadFile = e.target.files;
    if (e.target.id =="file01")
      this.uploadFile01 = e.target.files;
  }
  onCheckFile(e:any){
    this.element = document.getElementById("DivLab");
    this.elementFile = document.getElementById("DivFile");
    this.check0= document.getElementById("rbCSVComa");
    this.check1 = document.getElementById("rbCSVPunto");
    this.check2 = document.getElementById("rbExcel");
    if (!this.check0.checked && this.check2.checked || !this.check1.checked && this.check2.checked) {
        this.elementFile.style.display='block';
        this.element.style.display='none';
        this.separator =null;        
    }
    else {
      this.element.style.display='block';
      this.elementFile.style.display='block';
      this.check0.checked?this.separator = ',':this.separator =';'; 
    } 

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

  onValidateFile(){
    //  var uploader = document.getElementById("file")?.nodeValue;
    var uploader = this.form.value.attachment;
    var uploader1 = this.form.value.attachment1;
     if(!uploader){
      this.loading=false;
      this.translate.get('You must upload a file').subscribe((res: string) => {
        swal.fire(res);
      });
     }

  }

 clearUploadfile(){
  setTimeout(()=> location.reload(), 9000)
 }
}