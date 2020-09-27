import { Note } from "./MuseNote";

export interface SelectionNote {
  setSelect: (i: boolean) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
  addSubNote: (n: string) => void;
  removeSubNote: (index: number) => void;
  getThis: () => Note;
}

export interface SelectionSubNote {
  setSelect: (i: boolean) => void;
  setNum: (n: string) => void;
  reducePoint: (h: number) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
  getIndex: () => number;
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
        } else if (ev.key === "Backspace") {
          this.note?.removeSubNote(this.subnote.getIndex());
          this.note?.setSelect(true);
          this.subnote.setSelect(false);
          this.subnote = null;
        } else if (ev.key === "ArrowUp") {
          if (this.note) {
            let l = this.note.getThis().subNotes.length;
            if (l > this.subnote.getIndex() + 1) {
              this.subnote.setSelect(false);
              this.subnote = this.note.getThis().subNotes[
                this.subnote.getIndex() + 1
              ].selection;
              this.subnote.setSelect(true);
            }
          }
          ev.returnValue = false;
        } else if (ev.key === "ArrowDown") {
          if (this.note) {
            if (this.subnote.getIndex() > 0) {
              this.subnote.setSelect(false);
              this.subnote = this.note.getThis().subNotes[
                this.subnote.getIndex() - 1
              ].selection;
              this.subnote.setSelect(true);
            }
          }
          ev.returnValue = false;
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
        } else if (ev.key === " ") {
          this.note.addSubNote("0");
        } else if (ev.key === "ArrowUp") {
          this.subnote = this.note.getThis().subNotes[0].selection;
          this.subnote.setSelect(true);
          this.note.setSelect(false);
          ev.returnValue = false;
        } else if (ev.key === "ArrowDown") {
          let l = this.note.getThis().subNotes.length;
          this.subnote = this.note.getThis().subNotes[l - 1].selection;
          this.subnote.setSelect(true);
          this.note.setSelect(false);
          ev.returnValue = false;
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
    this.note?.setSelect(false);
    this.subnote = s;
    this.subnote.setSelect(true);
  }
}

export default Selector;
