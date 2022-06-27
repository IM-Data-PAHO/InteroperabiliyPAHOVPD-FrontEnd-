import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matFormFieldAnimations } from '@angular/material/form-field';
import { from } from 'rxjs';
import { Programs, selectPrograms,Program, periodo } from 'src/app/shared/Models/selectPrograms';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { UploaderService } from 'src/app/shared/services/uploader/uploader.service';
import swal from'sweetalert2';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})

export class UploaderComponent implements OnInit {
  selectProgramsOptions!: Program[];
  selectPeriod!: periodo[];
  form: FormGroup;
  uploadFile!: Array<File>
  file!: File; 
  uploadFile01!: Array<File>
  file01!: File; 
  loading=false;


  constructor(private _uploaderService : UploaderService, private fb: FormBuilder, private _login : LoginService) {
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
    console.log(item)
  }
  loadSelectPrograms(){
    this._uploaderService.getSelectProgram().subscribe(data =>{
      let {programs} = data;
      this.selectProgramsOptions = programs;

    })
  }
  
  onUpload(){
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
    this._uploaderService.uploadFile(formData).subscribe(result =>{
    //console.log("result: "+ JSON.stringify(result))
      let mensaje = '';
      if (!result){
         mensaje = 'El archivo se proceso Exitosamente';
         this.loading=false;
         return swal.fire(mensaje);
      }
      for (let i in result )
        {
          mensaje = mensaje + result[i].errorMessage + '\n ' ; 
        }
        this.loading=false;
       return swal.fire('No se pudo procesar el archivo  por los siguientes motivos: \n'+ mensaje);
    },error=>{
      this.loading=false;
      return swal.fire('Ocurrio un error Intente de nuevo');
    })

  }
  onFileSelected(e:any){
    if(e.target.id=="file")
      this.uploadFile = e.target.files;
    if (e.target.id =="file01")
      this.uploadFile01 = e.target.files;
  }

}