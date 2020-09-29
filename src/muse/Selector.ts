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
  addSubNote: (index: number) => void;
  removeSubNote: (index: number) => void;
}

export interface SelectionBar {
  setSelect: (i: boolean) => void;
  getThis: () => Bar;
  addNote: (index: number) => void;
  removeNote: (index: number) => void;
}

export interface SelectionTrack {
  setSelect: (s: boolean) => void;
  getThis: () => Track;
  addBar: (index: number) => void;
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
      if (!this.keySubNote(ev)) {
        if (!this.keyNote(ev)) {
          if (!this.keyBar(ev)) {
            if (!this.keyTrack(ev)) {
              if (!this.keyLine(ev)) {
                if (!this.keyPage(ev)) {
                  if (this.keyNotation(ev)) ev.returnValue = false;
                } else ev.returnValue = false;
              } else ev.returnValue = false;
            } else ev.returnValue = false;
          } else ev.returnValue = false;
        } else ev.returnValue = false;
      } else ev.returnValue = false;
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
  keySubNote(ev: KeyboardEvent): boolean {
    if (this.subnote !== null) {
      switch (ev.key) {
        case "Escape":
          this.subnote.setSelect(false);
          this.subnote = null;
          this.note?.setSelect(true);
          return true;
        case "Backspace":
          if (this.note) {
            let idx = this.subnote.getThis().index;
            this.note.removeSubNote(this.subnote.getThis().index);
            if (this.note.getThis().subNotes.length === 0) {
              this.note.setSelect(true);
              this.subnote.setSelect(false);
              this.subnote = null;
            } else {
              if (idx === 0) {
                this.subnote = this.note.getThis().subNotes[0];
                this.subnote.setSelect(true);
              } else {
                this.subnote = this.note.getThis().subNotes[idx - 1];
                this.subnote.setSelect(true);
              }
            }
          }
          return true;
        case " ":
          return true;
        case "z":
          if (this.note) {
            this.note?.addSubNote(0);
            this.selectSubNote(this.note?.getThis().subNotes[0]);
          }
          return true;
        case "x":
          if (this.note) {
            let idx = this.subnote.getThis().index;
            this.note?.addSubNote(idx + 1);
            this.selectSubNote(this.note?.getThis().subNotes[idx + 1]);
          }
          return true;
        case "c":
          if (this.note) {
            this.note?.addSubNote(this.note.getThis().subNotes.length);
            this.selectSubNote(
              this.note?.getThis().subNotes[
                this.note.getThis().subNotes.length - 1
              ]
            );
          }
          return true;
        case "ArrowUp":
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
          return true;
        case "ArrowDown":
          if (this.note) {
            if (this.subnote.getThis().index > 0) {
              this.subnote.setSelect(false);
              this.subnote = this.note.getThis().subNotes[
                this.subnote.getThis().index - 1
              ];
              this.subnote.setSelect(true);
            }
          }
          return true;
        case "ArrowLeft":
          return true;
        case "ArrowRight":
          return true;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "-":
          this.subnote.setNum(ev.key);
          return true;
        case "r":
          this.subnote.reducePoint(1);
          return true;
        case "f":
          this.subnote.reducePoint(-1);
          return true;
        case "q":
          this.subnote.reduceLine(-1);
          return true;
        case "a":
          this.subnote.reduceLine(1);
          return true;
        case "s":
          this.subnote.reduceTailPoint(-1);
          return true;
        case "d":
          this.subnote.reduceTailPoint(1);
          return true;
        default:
          return false;
      }
    } else return false;
  }
  keyNote(ev: KeyboardEvent): boolean {
    if (this.note) {
      switch (ev.key) {
        case "Enter":
          if (this.note.getThis().subNotes.length <= 0) {
            this.note.addSubNote(this.note.getThis().subNotes.length);
          }
          this.subnote = this.note.getThis().subNotes[0];
          this.subnote.setSelect(true);
          this.note.setSelect(false);
          return true;
        case "Escape":
          this.note.setSelect(false);
          this.note = null;
          this.bar?.setSelect(true);
          return true;
        case " ":
          this.note.addSubNote(this.note.getThis().subNotes.length);
          return true;
        case "z":
          if (this.bar) {
            this.bar?.addNote(0);
            this.selectNote(this.bar?.getThis().notes[0]);
          }
          return true;
        case "x":
          if (this.bar) {
            let idx = this.note.getThis().index;
            this.bar?.addNote(idx + 1);
            this.selectNote(this.bar?.getThis().notes[idx + 1]);
          }
          return true;
        case "c":
          if (this.bar) {
            this.bar?.addNote(this.bar.getThis().notes.length);
            this.selectNote(
              this.bar?.getThis().notes[this.bar.getThis().notes.length - 1]
            );
          }
          return true;
        case "Backspace":
          if (this.bar) {
            let idx = this.note.getThis().index;
            this.bar.removeNote(this.note.getThis().index);
            if (this.bar.getThis().notes.length === 0) {
              this.bar.setSelect(true);
              this.note.setSelect(false);
              this.note = null;
            } else {
              if (idx === 0) {
                this.note = this.bar.getThis().notes[0];
                this.note.setSelect(true);
              } else {
                this.note = this.bar.getThis().notes[idx - 1];
                this.note.setSelect(true);
              }
            }
          }
          return true;
        case "ArrowLeft":
          if (this.bar) {
            if (this.note.getThis().index > 0) {
              this.note.setSelect(false);
              this.note = this.bar.getThis().notes[
                this.note.getThis().index - 1
              ];
              this.note.setSelect(true);
              return true;
            } else if (this.track) {
              if (this.bar.getThis().index > 0) {
                this.bar.setSelect(false);
                this.bar = this.track.getThis().bars[
                  this.bar.getThis().index - 1
                ];
                this.note.setSelect(false);
                this.note = this.bar.getThis().notes[
                  this.bar.getThis().notes.length - 1
                ];
                this.note.setSelect(true);
                return true;
              } else return false;
            } else return false;
          } else return false;
        case "ArrowRight":
          if (this.bar !== null) {
            let l = this.bar.getThis().notes.length;
            if (this.note.getThis().index < l - 1) {
              this.note.setSelect(false);
              this.note = this.bar.getThis().notes[
                this.note.getThis().index + 1
              ];
              this.note.setSelect(true);
              return true;
            } else if (this.track) {
              if (
                this.bar.getThis().index <
                this.track?.getThis().bars.length - 1
              ) {
                this.bar.setSelect(false);
                this.bar = this.track.getThis().bars[
                  this.bar.getThis().index + 1
                ];
                this.note.setSelect(false);
                this.note = this.bar.getThis().notes[0];
                this.note.setSelect(true);
                return true;
              } else return false;
            } else return false;
          } else return false;
        case "ArrowUp":
          return true;
        case "ArrowDown":
          return true;
        case "q":
          this.note.reduceLine(-1);
          return true;
        case "a":
          this.note.reduceLine(1);
          return true;
        case "s":
          this.note.reduceTailPoint(-1);
          return true;
        case "d":
          this.note.reduceTailPoint(1);
          return true;
        default:
          return false;
      }
    } else return false;
  }
  keyBar(ev: KeyboardEvent): boolean {
    if (this.bar !== null) {
      switch (ev.key) {
        case "Enter":
          if (this.bar.getThis().notes.length <= 0) {
            this.bar.addNote(this.bar.getThis().notes.length);
          }
          this.note = this.bar.getThis().notes[0];
          this.note.setSelect(true);
          this.bar.setSelect(false);
          return true;
        case "Escape":
          this.bar.setSelect(false);
          this.bar = null;
          this.track?.setSelect(true);
          return true;
        case " ":
          this.bar.addNote(this.bar.getThis().notes.length);
          return true;
        case "z":
          if (this.track) {
            this.track.addBar(0);
            this.selectBar(this.track.getThis().bars[0]);
          }
          return true;
        case "x":
          if (this.track) {
            let idx = this.bar.getThis().index;
            this.track.addBar(idx + 1);
            this.selectBar(this.track.getThis().bars[idx + 1]);
          }
          return true;
        case "c":
          if (this.track) {
            this.track.addBar(this.track.getThis().bars.length);
            this.selectBar(
              this.track.getThis().bars[this.track.getThis().bars.length - 1]
            );
          }
          return true;
        case "Backspace":
          if (this.track) {
            let idx = this.bar.getThis().index;
            this.track.removeBar(this.bar.getThis().index);
            if (this.track.getThis().bars.length === 0) {
              this.track.setSelect(true);
              this.bar.setSelect(false);
              this.bar = null;
            } else {
              if (idx === 0) {
                this.bar = this.track.getThis().bars[0];
                this.bar.setSelect(true);
              } else {
                this.bar = this.track.getThis().bars[idx - 1];
                this.bar.setSelect(true);
              }
            }
          }
          return true;
        case "ArrowLeft":
          if (this.track) {
            if (this.bar.getThis().index > 0) {
              this.bar.setSelect(false);
              this.bar = this.track.getThis().bars[
                this.bar.getThis().index - 1
              ];
              this.bar.setSelect(true);
              return true;
            } else return true;
          } else return false;
        case "ArrowRight":
          if (this.track !== null) {
            let l = this.track.getThis().bars.length;
            if (this.bar.getThis().index < l - 1) {
              this.bar.setSelect(false);
              this.bar = this.track.getThis().bars[
                this.bar.getThis().index + 1
              ];
              this.bar.setSelect(true);
              return true;
            } else return true;
          } else return false;
        case "ArrowUp":
          if (this.track && this.line) {
            if (this.track.getThis().index > 0) {
              this.track = this.line.getThis().tracks[
                this.track.getThis().index - 1
              ];
              this.bar.setSelect(false);
              this.bar = this.track.getThis().bars[this.bar.getThis().index];
              this.bar.setSelect(true);
              return true;
            } else return true;
          } else return false;
        case "ArrowDown":
          if (this.track && this.line) {
            let l = this.line.getThis().tracks.length;
            if (this.track.getThis().index < l - 1) {
              this.track = this.line.getThis().tracks[
                this.track.getThis().index + 1
              ];
              this.bar.setSelect(false);
              this.bar = this.track.getThis().bars[this.bar.getThis().index];
              this.bar.setSelect(true);
              return true;
            } else return true;
          } else return false;
        default:
          return false;
      }
    } else return false;
  }
  keyTrack(ev: KeyboardEvent): boolean {
    if (this.track !== null) {
      switch (ev.key) {
        case "Enter":
          if (this.track.getThis().bars.length <= 0) {
            this.track.addBar(this.track.getThis().bars.length);
          }
          this.bar = this.track.getThis().bars[0];
          this.bar.setSelect(true);
          this.track.setSelect(false);
          return true;
        case "Escape":
          this.track.setSelect(false);
          this.track = null;
          this.line?.setSelect(true);
          return true;
        case " ":
          this.track.addBar(this.track.getThis().bars.length);
          ev.returnValue = false;
          return true;
        case "Backspace":
          if (this.line) {
            let idx = this.track.getThis().index;
            this.line.removeTrack(this.track.getThis().index);
            if (this.line.getThis().tracks.length === 0) {
              this.line.setSelect(true);
              this.track.setSelect(false);
              this.track = null;
            } else {
              if (idx === 0) {
                this.track = this.line.getThis().tracks[0];
                this.track.setSelect(true);
              } else {
                this.track = this.line.getThis().tracks[idx - 1];
                this.track.setSelect(true);
              }
            }
          }
          return true;
        case "ArrowUp":
          if (this.line) {
            if (this.track.getThis().index > 0) {
              this.track.setSelect(false);
              this.track = this.line.getThis().tracks[
                this.track.getThis().index - 1
              ];
              this.track.setSelect(true);
              return true;
            } else if (this.page) {
              if (this.line.getThis().index > 0) {
                this.line.setSelect(false);
                this.line = this.page.getThis().lines[
                  this.line.getThis().index - 1
                ];
                this.track.setSelect(false);
                this.track = this.line.getThis().tracks[
                  this.line.getThis().tracks.length - 1
                ];
                this.track.setSelect(true);
                return true;
              } else if (this.notation) {
                if (this.page.getThis().index > 0) {
                  this.page = this.notation.getThis().pages[
                    this.page.getThis().index - 1
                  ];
                  this.line = this.page.getThis().lines[
                    this.page.getThis().lines.length - 1
                  ];
                  this.track.setSelect(false);
                  this.track = this.line.getThis().tracks[
                    this.line.getThis().tracks.length - 1
                  ];
                  this.track.setSelect(true);
                  return true;
                } else return false;
              } else return false;
            } else return false;
          } else return false;
        case "ArrowDown":
          if (this.line !== null) {
            let l = this.line.getThis().tracks.length;
            if (this.track.getThis().index < l - 1) {
              this.track.setSelect(false);
              this.track = this.line.getThis().tracks[
                this.track.getThis().index + 1
              ];
              this.track.setSelect(true);
              return true;
            } else if (this.page) {
              if (
                this.line.getThis().index <
                this.page.getThis().lines.length - 1
              ) {
                this.line.setSelect(false);
                this.line = this.page.getThis().lines[
                  this.line.getThis().index + 1
                ];
                this.track.setSelect(false);
                this.track = this.line.getThis().tracks[0];
                this.track.setSelect(true);
                return true;
              } else if (this.notation) {
                if (
                  this.page.getThis().index <
                  this.notation.getThis().pages.length - 1
                ) {
                  this.page = this.notation.getThis().pages[
                    this.page.getThis().index + 1
                  ];
                  this.line = this.page.getThis().lines[0];
                  this.track.setSelect(false);
                  this.track = this.line.getThis().tracks[0];
                  this.track.setSelect(true);
                  return true;
                } else return false;
              } else return false;
            } else return false;
          } else return false;
        default:
          return false;
      }
    } else return false;
  }
  keyLine(ev: KeyboardEvent): boolean {
    if (this.line !== null) {
      switch (ev.key) {
        case "Enter":
          if (this.line.getThis().tracks.length <= 0) {
            this.line.getThis().addTrack();
          }
          this.track = this.line.getThis().tracks[0];
          this.track.setSelect(true);
          this.line.setSelect(false);
          return true;
        case "Escape":
          this.line.setSelect(false);
          this.line = null;
          this.page?.setSelect(true);
          return true;
        case " ":
          this.line.addTrack();
          return true;
        case "Backspace":
          if (this.page) {
            let idx = this.line.getThis().index;
            this.page.removeLine(this.line.getThis().index);
            if (this.page.getThis().lines.length === 0) {
              this.page.setSelect(true);
              this.line.setSelect(false);
              this.line = null;
            } else {
              if (idx === 0) {
                this.line = this.page.getThis().lines[0];
                this.line.setSelect(true);
              } else {
                this.line = this.page.getThis().lines[idx - 1];
                this.line.setSelect(true);
              }
            }
          }
          return true;
        case "ArrowUp":
          if (this.page) {
            if (this.line.getThis().index > 0) {
              this.line.setSelect(false);
              this.line = this.page.getThis().lines[
                this.line.getThis().index - 1
              ];
              this.line.setSelect(true);
              return true;
            } else if (this.notation) {
              if (this.page.getThis().index > 0) {
                this.page = this.notation.getThis().pages[
                  this.page.getThis().index - 1
                ];
                this.line.setSelect(false);
                this.line = this.page.getThis().lines[
                  this.page.getThis().lines.length - 1
                ];
                this.line.setSelect(true);
                return true;
              } else return false;
            } else return false;
          } else return false;
        case "ArrowDown":
          if (this.page !== null) {
            let l = this.page.getThis().lines.length;
            if (this.line.getThis().index < l - 1) {
              this.line.setSelect(false);
              this.line = this.page.getThis().lines[
                this.line.getThis().index + 1
              ];
              this.line.setSelect(true);
              return true;
            } else if (this.notation) {
              if (
                this.page.getThis().index <
                this.notation.getThis().pages.length - 1
              ) {
                this.page = this.notation.getThis().pages[
                  this.page.getThis().index + 1
                ];
                this.line.setSelect(false);
                this.line = this.page.getThis().lines[0];
                this.line.setSelect(true);
                return true;
              } else return false;
            } else return false;
          } else return false;
        default:
          return false;
      }
    } else return false;
  }
  keyPage(ev: KeyboardEvent): boolean {
    if (this.page !== null) {
      switch (ev.key) {
        case "Enter":
          if (this.page.getThis().lines.length <= 0) {
            this.page.getThis().addLine();
          }
          this.line = this.page.getThis().lines[0];
          this.line.setSelect(true);
          this.page.setSelect(false);
          return true;
        case "Escape":
          this.page.setSelect(false);
          this.page = null;
          this.notation?.setSelect(true);
          return true;
        case " ":
          this.page.addLine();
          return true;
        case "Backspace":
          if (this.notation) {
            let idx = this.page.getThis().index;
            this.notation?.reomvePage(this.page.getThis().index);
            if (this.notation.getThis().pages.length === 0) {
              this.notation.setSelect(true);
              this.page.setSelect(false);
              this.page = null;
            } else {
              if (idx === 0) {
                this.page = this.notation.getThis().pages[0];
                this.page.setSelect(true);
              } else {
                this.page = this.notation.getThis().pages[idx - 1];
                this.page.setSelect(true);
              }
            }
          }
          return true;
        case "ArrowUp":
          if (this.notation) {
            if (this.page.getThis().index > 0) {
              this.page.setSelect(false);
              this.page = this.notation.getThis().pages[
                this.page.getThis().index - 1
              ];
              this.page.setSelect(true);
              return true;
            } else return true;
          } else return false;
        case "ArrowDown":
          if (this.notation !== null) {
            let l = this.notation.getThis().pages.length;
            if (this.page.getThis().index < l - 1) {
              this.page.setSelect(false);
              this.page = this.notation.getThis().pages[
                this.page.getThis().index + 1
              ];
              this.page.setSelect(true);
              return true;
            } else return true;
          } else return false;
        default:
          return false;
      }
    } else return false;
  }
  keyNotation(ev: KeyboardEvent): boolean {
    if (this.notation !== null) {
      switch (ev.key) {
        case "Enter":
          if (this.notation.getThis().pages.length <= 0) {
            this.notation.getThis().addPage();
          }
          this.page = this.notation.getThis().pages[0];
          this.page.setSelect(true);
          this.notation.setSelect(false);
          return true;
        case " ":
          this.notation.addPage();
          ev.returnValue = false;
          return true;
        default:
          return false;
      }
    } else return false;
  }
}

export default Selector;
