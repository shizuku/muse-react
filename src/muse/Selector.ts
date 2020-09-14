import { Note } from "./MuseNote";
import { Notation } from "./MuseNotation";
import { Page } from "./MusePage";
import { Line } from "./MuseLine";
import { Track } from "./MuseTrack";
import { Bar } from "./MuseBar";

interface HandlerTree {
  handler: ((state: { notation: Notation }) => void) | null;
  pages: {
    handler: ((state: { page: Page }) => void) | null;
    lines: {
      handler: ((state: { line: Line }) => void) | null;
      tracks: {
        handler: ((state: { track: Track }) => void) | null;
        bars: {
          handler: ((state: { bar: Bar }) => void) | null;
          notes: {
            handler: ((state: { note: Note }) => void) | null;
          }[];
        }[];
      }[];
    }[];
  }[];
}

class Selector {
  data: Notation;
  tree: HandlerTree;
  constructor(data: Notation) {
    this.data = data;
    this.tree = { handler: null, pages: [] };
    this.data.pages.forEach((page, pageIdx) => {
      this.tree.pages.push({ handler: null, lines: [] });
      page.lines.forEach((line, lineIdx) => {
        this.tree.pages[pageIdx].lines.push({ handler: null, tracks: [] });
        line.tracks.forEach((track, trackIdx) => {
          this.tree.pages[pageIdx].lines[lineIdx].tracks.push({
            handler: null,
            bars: [],
          });
          track.bars.forEach((bar, barIdx) => {
            this.tree.pages[pageIdx].lines[lineIdx].tracks[trackIdx].bars.push({
              handler: null,
              notes: [],
            });
            bar.notes.forEach((note) => {
              this.tree.pages[pageIdx].lines[lineIdx].tracks[trackIdx].bars[
                barIdx
              ].notes.push({
                handler: null,
              });
            });
          });
        });
      });
    });
    // document.addEventListener("keydown", (ev) => {
    //   if (ev.key >= "0" && ev.key <= "9" && this.l.length === 1) {
    //     console.log(this.l[0].note);
    //     console.log(ev);
    //     let o = new Note(this.l[0].note, this.l[0].note.config);
    //     o.n = ev.key;
    //     o.settle();
    //     console.log(o);
    //     this.l[0].setNote(o);
    //   }
    // });
  }
  fetchNotation(handler: (state: { notation: Notation }) => void) {
    let notation = this.data;
    this.tree.handler = handler;
    handler({ notation });
  }
  unFetchNotation() {}
  fetchPage(cursor: number[], handler: (state: { page: Page }) => void) {
    if (cursor.length === 1) {
      let page = this.data.pages[cursor[0]];
      this.tree.pages[cursor[0]].handler = handler;
      handler({ page });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchPage(cursor: number[]) {
    if (cursor.length === 1) {
    } else {
      throw new Error("cursor size error");
    }
  }
  fetchLine(cursor: number[], handler: (state: { line: Line }) => void) {
    if (cursor.length === 2) {
      let line = this.data.pages[cursor[0]].lines[cursor[1]];
      this.tree.pages[cursor[0]].lines[cursor[1]].handler = handler;
      handler({ line });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchLine(cursor: number[]) {
    if (cursor.length === 2) {
    } else {
      throw new Error("cursor size error");
    }
  }
  fetchTrack(cursor: number[], handler: (state: { track: Track }) => void) {
    if (cursor.length === 3) {
      let track = this.data.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]];
      this.tree.pages[cursor[0]].lines[cursor[1]].tracks[
        cursor[2]
      ].handler = handler;
      handler({ track });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchTrack(cursor: number[]) {
    if (cursor.length === 3) {
    } else {
      throw new Error("cursor size error");
    }
  }
  fetchBar(cursor: number[], handler: (state: { bar: Bar }) => void) {
    if (cursor.length === 4) {
      let bar = this.data.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]]
        .bars[cursor[3]];
      this.tree.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]].bars[
        cursor[3]
      ].handler = handler;
      handler({ bar });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchBar(cursor: number[]) {
    if (cursor.length === 4) {
    } else {
      throw new Error("cursor size error");
    }
  }
  fetchNote(cursor: number[], handler: (state: { note: Note }) => void) {
    if (cursor.length === 5) {
      let note = this.data.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]]
        .bars[cursor[3]].notes[cursor[4]];
      this.tree.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]].bars[
        cursor[3]
      ].notes[cursor[4]].handler = handler;
      handler({ note });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchNote(cursor: number[]) {
    if (cursor.length === 5) {
    } else {
      throw new Error("cursor size error");
    }
  }
}

export default Selector;
