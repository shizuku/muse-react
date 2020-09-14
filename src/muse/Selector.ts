import { Note } from "./MuseNote";
import { Notation } from "./MuseNotation";

class Selector {
  data: Notation;
  constructor(data: Notation) {
    this.data = data;
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
  fetchNote(cursor: number[], handler: (state: { note: Note }) => void) {
    if (cursor.length === 5) {
      let note = this.data.pages[cursor[0]].lines[cursor[1]].tracks[cursor[2]]
        .bars[cursor[3]].notes[cursor[4]];
      handler({ note });
    } else {
      throw new Error("cursor size error");
    }
  }
  unFetchNote(cursor: number[], handler: (state: { note: Note }) => void) {}
}

export default Selector;
