export interface selectPrograms{
    id: string,
    displayName: string
}

export interface Programs {
    datasets: any[];
    programs: Program[];
}

export interface Program {
    status:           string;
    programid:        string;
    programname:      string;
    attributemapping: Attributemapping[];
}
export interface periodo {
    id: number;
  }

export interface Attributemapping {
    id:     string;
    name:   string;
    column: string;
}

export interface Responsepreload{
    uploads: number;
    deleted: number;
    response: ValidateDto[];
    state: string;
    sumary: SumaryerrorDto[];
    totalFile1:number;
    totalFile2:number;
  }
  export interface SumaryerrorDto{
    date: number;
    mandatoty: number;
    compulsory: number;
    option: number;
    totalrows : number;
  }


  export interface ValidateDto{
    indexpreload: number;
    id: string;
    detail: string;
    ln: number;
    cl: number;
    ms: string;
    errortype: string;
    value: string;
  }