import { Note } from "./MuseNote";

interface T {
  isSelect: Boolean;
  setSelect: (s: boolean) => void;
  note: Note;
  setNote: (n: Note) => void;
}

class Selector {
  static instance: Selector;
  fun: ((show: boolean) => void) | undefined;
  l: T[] = [];
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      console.log(ev);
    });
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Selector();
    }
    return this.instance;
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
