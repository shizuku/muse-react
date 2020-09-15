export interface INotation {
  title: string;
  subtitle: string;
  author: string;
  rhythmic: string;
  speed:string,
  C: string;
  pages: IPage[];
}

export interface IPage {
  lines: ILine[];
}

export interface ILine {
  tracks: ITrack[];
}

export interface ITrack {
  bars: IBar[];
}

export interface IBar {
  notes: INote[];
}

export interface INote {
  n: string;
}
