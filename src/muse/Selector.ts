interface SelectionNote {
  setSelect: (i: boolean) => void;
  setNum: (n: string) => void;
  reduceLine: (l: number) => void;
  reducePoint: (p: number) => void;
}

class Selector {
  list: SelectionNote[] = [];
  static instance = new Selector();
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      if (this.list.length === 1) {
        if ((ev.key >= "0" && ev.key <= "9") || ev.key === "-") {
          this.list[0].setNum(ev.key);
        } else if (ev.key === "q") {
          this.list[0].reduceLine(-1);
        } else if (ev.key === "a") {
          this.list[0].reduceLine(1);
        } else if (ev.key === "s") {
          this.list[0].reducePoint(-1);
        } else if (ev.key === "d") {
          this.list[0].reducePoint(1);
        }
      }
    });
  }
  selectNote(s: SelectionNote, clear: boolean) {
    if (clear) {
      this.clear();
    }
    this.list.push(s);
    s.setSelect(true);
  }
  clear() {
    this.list.forEach((it) => it.setSelect(false));
    this.list.length = 0;
  }
}

export default Selector;
