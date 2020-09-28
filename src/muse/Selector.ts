import { Bar } from "./MuseBar";
import { Line } from "./MuseLine";
import { Notation } from "./MuseNotation";
import { Note, SubNote } from "./MuseNote";
import { Page } from "./MusePage";
import { Track } from "./MuseTrack";

export interface SelectionSubNote {
  setSelect: (i: boolean) => void;
  getThis: () => SubNote;
  setNum: (n: string) => void;
  reducePoint: (h: number) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
}

export interface SelectionNote {
  setSelect: (i: boolean) => void;
  getThis: () => Note;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
  addSubNote: () => void;
  removeSubNote: (index: number) => void;
}

export interface SelectionBar {
  setSelect: (i: boolean) => void;
  getThis: () => Bar;
  addNote: () => void;
  removeNote: (index: number) => void;
}

export interface SelectionTrack {
  setSelect: (s: boolean) => void;
  getThis: () => Track;
  addBar: () => void;
  removeBar: (index: number) => void;
}

export interface SelectionLine {
  setSelect: (s: boolean) => void;
  getThis: () => Line;
  addTrack: () => void;
  removeTrack: (index: number) => void;
}

export interface SelectionPage {
  setSelect: (s: boolean) => void;
  getThis: () => Page;
  addLine: () => void;
  removeLine: (index: number) => void;
}

export interface SelectionNotation {
  setSelect: (s: boolean) => void;
  getThis: () => Notation;
  addPage: () => void;
  reomvePage: (index: number) => void;
}

class Selector {
  subnote: SelectionSubNote | null = null;
  note: SelectionNote | null = null;
  bar: SelectionBar | null = null;
  track: SelectionTrack | null = null;
  line: SelectionLine | null = null;
  page: SelectionPage | null = null;
  notation: SelectionNotation | null = null;
  static instance = new Selector();
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      if (this.subnote !== null) {
        if (ev.key === "Enter") {
          this.subnote.setSelect(false);
          this.subnote = null;
          this.note?.setSelect(true);
        } else if (ev.key === "Backspace") {
          this.note?.removeSubNote(this.subnote.getThis().index);
          this.note?.setSelect(true);
          this.subnote.setSelect(false);
          this.subnote = null;
        } else if (ev.key === "ArrowUp") {
          if (this.note) {
            let l = this.note.getThis().subNotes.length;
            if (l > this.subnote.getThis().index + 1) {
              this.subnote.setSelect(false);
              this.subnote = this.note.getThis().subNotes[
                this.subnote.getThis().index + 1
              ];
              this.subnote.setSelect(true);
            }
          }
          ev.returnValue = false;
        } else if (ev.key === "ArrowDown") {
          if (this.note) {
            if (this.subnote.getThis().index > 0) {
              this.subnote.setSelect(false);
              this.subnote = this.note.getThis().subNotes[
                this.subnote.getThis().index - 1
              ];
              this.subnote.setSelect(true);
            }
          }
          ev.returnValue = false;
        } else if ((ev.key >= "0" && ev.key <= "9") || ev.key === "-") {
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
        }
      } else if (this.note !== null) {
        if (ev.key === "Enter") {
          this.note.setSelect(false);
          this.note = null;
          this.bar?.setSelect(true);
        } else if (ev.key === " ") {
          this.note.addSubNote();
          ev.returnValue = false;
        } else if (ev.key === "Backspace") {
          this.bar?.removeNote(this.note.getThis().index);
          this.bar?.setSelect(true);
          this.note.setSelect(false);
          this.note = null;
        } else if (ev.key === "ArrowUp") {
          this.subnote = this.note.getThis().subNotes[0];
          this.subnote.setSelect(true);
          this.note.setSelect(false);
          ev.returnValue = false;
        } else if (ev.key === "ArrowDown") {
          let l = this.note.getThis().subNotes.length;
          this.subnote = this.note.getThis().subNotes[l - 1];
          this.subnote.setSelect(true);
          this.note.setSelect(false);
          ev.returnValue = false;
        } else if (ev.key === "q") {
          this.note.reduceLine(-1);
        } else if (ev.key === "a") {
          this.note.reduceLine(1);
        } else if (ev.key === "s") {
          this.note.reduceTailPoint(-1);
        } else if (ev.key === "d") {
          this.note.reduceTailPoint(1);
        }
      } else if (this.bar !== null) {
        if (ev.key === "Enter") {
          this.bar.setSelect(false);
          this.bar = null;
          this.track?.setSelect(true);
        } else if (ev.key === " ") {
          this.bar.addNote();
          ev.returnValue = false;
        } else if (ev.key === "Backspace") {
          this.track?.removeBar(this.bar.getThis().index);
          this.track?.setSelect(true);
          this.bar.setSelect(false);
          this.bar = null;
          ev.returnValue = false;
        }
      } else if (this.track !== null) {
        if (ev.key === "Enter") {
          this.track.setSelect(false);
          this.track = null;
          this.line?.setSelect(true);
        } else if (ev.key === " ") {
          this.track.addBar();
          ev.returnValue = false;
        } else if (ev.key === "Backspace") {
          this.line?.removeTrack(this.track.getThis().index);
          this.line?.setSelect(true);
          this.track.setSelect(false);
          this.track = null;
          ev.returnValue = false;
        }
      } else if (this.line !== null) {
        if (ev.key === "Enter") {
          this.line.setSelect(false);
          this.line = null;
          this.page?.setSelect(true);
        } else if (ev.key === " ") {
          this.line.addTrack();
          ev.returnValue = false;
        } else if (ev.key === "Backspace") {
          this.page?.removeLine(this.line.getThis().index);
          this.page?.setSelect(true);
          this.line.setSelect(false);
          this.line = null;
          ev.returnValue = false;
        }
      } else if (this.page !== null) {
        if (ev.key === "Enter") {
          this.page.setSelect(false);
          this.page = null;
          this.notation?.setSelect(true);
        } else if (ev.key === " ") {
          this.page.addLine();
          ev.returnValue = false;
        } else if (ev.key === "Backspace") {
          this.notation?.reomvePage(this.page.getThis().index);
          this.notation?.setSelect(true);
          this.page.setSelect(false);
          this.page = null;
          ev.returnValue = false;
        }
      } else if (this.notation !== null) {
        if (ev.key === " ") {
          this.notation.addPage();
          ev.returnValue = false;
        }
      }
    });
  }
  selectSubNote(s: SelectionSubNote) {
    this.subnote?.setSelect(false);
    this.subnote = s;
    this.subnote.setSelect(true);
    this.selectNote(s.getThis().note);
  }
  selectNote(s: SelectionNote) {
    this.note?.setSelect(false);
    this.note = s;
    if (this.subnote === null) this.note.setSelect(true);
    this.selectBar(s.getThis().bar);
  }
  selectBar(s: SelectionBar) {
    this.bar?.setSelect(false);
    this.bar = s;
    if (this.note === null) this.bar.setSelect(true);
    this.selectTrack(s.getThis().track);
  }
  selectTrack(s: SelectionTrack) {
    this.track?.setSelect(false);
    this.track = s;
    if (this.bar === null) this.track.setSelect(true);
    this.selectLine(s.getThis().line);
  }
  selectLine(s: SelectionLine) {
    this.line?.setSelect(false);
    this.line = s;
    if (this.track === null) this.line.setSelect(true);
    this.selectPage(s.getThis().page);
  }
  selectPage(s: SelectionPage) {
    this.page?.setSelect(false);
    this.page = s;
    if (this.line === null) this.page.setSelect(true);
    this.selectNotation(s.getThis().notation);
  }
  selectNotation(s: SelectionNotation) {
    this.notation?.setSelect(false);
    this.notation = s;
    if (this.page === null) this.notation.setSelect(true);
  }
}

export default Selector;
