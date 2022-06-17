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