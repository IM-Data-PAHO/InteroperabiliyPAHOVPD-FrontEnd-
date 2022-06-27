import { Byte } from "@angular/compiler/src/util";

export interface History{
  id: number;
  programsid: string;
  jsonSet: string;
  jsonResponse: string;
  state: boolean;
  userLogin: string;
  fecha: string;
  file: Byte[];
}