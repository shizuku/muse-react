export interface SelectionNote {
  setSelect: (i: boolean) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
  addSubNote: (n: string) => void;
}

export interface SelectionSubNote {
  setSelect: (i: boolean) => void;
  setNum: (n: string) => void;
  reducePoint: (h: number) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
}

class Selector {
  subnote: SelectionSubNote | null = null;
  note: SelectionNote | null = null;
  static instance = new Selector();
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      if (this.subnote !== null) {
        if ((ev.key >= "0" && ev.key <= "9") || ev.key === "-") {
          this.subnote.setNum(ev.key);
        } else if (ev.key === "r") {
          this.subnote.reducePoint(1);
        } else if (ev.key === "f") {
          this.subnote.reducePoint(-1);
        } else if (ev.key === "q") {
          this.subnote.reduceLine(-1);
        } else if (ev.key === "a") {
          this.subnote.reduceLine(1);
        } else if (ev.key === "s") {
          this.subnote.reduceTailPoint(-1);
        } else if (ev.key === "d") {
          this.subnote.reduceTailPoint(1);
        } else if (ev.key === "Enter") {
          this.subnote.setSelect(false);
          this.subnote = null;
          this.note?.setSelect(true);
        }
      } else if (this.note !== null) {
        if (ev.key === "q") {
          this.note.reduceLine(-1);
        } else if (ev.key === "a") {
          this.note.reduceLine(1);
        } else if (ev.key === "s") {
          this.note.reduceTailPoint(-1);
        } else if (ev.key === "d") {
          this.note.reduceTailPoint(1);
        } else if ((ev.key >= "0" && ev.key <= "9") || ev.key === "-") {
          this.note.addSubNote(ev.key);
        }
      }
    });
  }
  selectNote(s: SelectionNote) {
    this.note?.setSelect(false);
    this.note = s;
    if (this.subnote === null) this.note.setSelect(true);
  }
  selectSubNote(s: SelectionSubNote) {
    this.subnote?.setSelect(false);
    this.subnote = s;
    this.subnote.setSelect(true);
  }
}

export default Selector;
