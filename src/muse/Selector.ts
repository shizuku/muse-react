import { Note } from "./MuseNote";
import { Notation } from "./MuseNotation";

interface T {
  isSelect: Boolean;
  setSelect: (s: boolean) => void;
  note: Note;
  setNote: (n: Note) => void;
}

interface NotationState {
  notation: Notation;
  setNotation: (n: Notation) => void;
}

class Selector {
  l: T[] = [];
  n: NotationState | undefined = undefined;
  constructor(g: NotationState) {
    this.n = g;
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
  select(g: T) {
    this.clear();
    this.l.push(g);
    g.setSelect(true);
  }
  clear() {
    this.l.forEach((it) => {
      it.setSelect(false);
    });
    this.l.length = 0;
  }
}

export default Selector;
