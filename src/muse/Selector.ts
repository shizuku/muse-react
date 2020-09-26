export interface SelectionNote {
  kind: "note";
  level: 1;
  setSelect: (i: boolean) => void;
  reduceLine: (l: number) => void;
  reduceTailPoint: (p: number) => void;
}

export interface SelectionSubNote {
  kind: "subnote";
  level: 0;
  setSelect: (i: boolean) => void;
  setNum: (n: string) => void;
  reducePoint: (h: number) => void;
}

class Selector {
  s: SelectionNote | SelectionSubNote | null = null;
  static instance = new Selector();
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      if (this.s !== null) {
        if (this.s.kind === "note") {
          if (ev.key === "q") {
            this.s.reduceLine(-1);
          } else if (ev.key === "a") {
            this.s.reduceLine(1);
          } else if (ev.key === "s") {
            this.s.reduceTailPoint(-1);
          } else if (ev.key === "d") {
            this.s.reduceTailPoint(1);
          }
        } else if (this.s.kind === "subnote") {
          if ((ev.key >= "0" && ev.key <= "9") || ev.key === "-") {
            this.s.setNum(ev.key);
          } else if (ev.key === "r") {
            this.s.reducePoint(1);
          } else if (ev.key === "f") {
            this.s.reducePoint(-1);
          }
        }
      }
    });
  }
  select(s: SelectionNote | SelectionSubNote, clear: boolean) {
    if (this.s !== null) {
      if (s.level <= this.s.level) {
        if (clear) {
          this.clear();
        }
        this.s = s;
        s.setSelect(true);
      }
    } else {
      if (clear) {
        this.clear();
      }
      this.s = s;
      s.setSelect(true);
    }
  }
  clear() {
    this.s?.setSelect(false);
  }
}

export default Selector;
