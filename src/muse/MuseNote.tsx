import React from "react";
import { Border, OuterBorder } from "./Border";
import MuseConfig from "./MuseConfig";
import Codec from "./Codec";
import Fraction from "./Fraction";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import Selector, { SelectionNote, SelectionSubNote } from "./Selector";
import { Bar } from "./MuseBar";

export interface INote {
  n: string;
}

class SubNote {
  @observable x: string = "";
  @observable n: string = "";
  @observable t: number = 0;
  @observable isSelect = false;
  selection: SelectionSubNote = {
    kind: "subnote",
    level: 0,
    setSelect: (s: boolean) => {
      this.isSelect = s;
    },
    setNum: (n: string) => {
      this.n = n;
    },
    reducePoint: (h: number) => {
      this.t += h;
    },
  };
  constructor({ x, n, t }: { x: string; n: string; t: number }) {
    this.x = x;
    this.n = n;
    this.t = t;
  }
}

export class Note implements Codec {
  readonly config: MuseConfig;
  @observable index: number;
  @observable bar: Bar;
  @observable subNotes: SubNote[] = [];
  @observable l: number = 0;
  @observable p: number = 0;
  @observable d: number = 0;
  @computed get dx(): number {
    let dxx = false;
    this.subNotes.forEach((it) => {
      if (it.x !== "") {
        dxx = true;
      }
    });
    return dxx ? this.config.sigFontSize / 2 : 0;
  }
  @computed get time(): Fraction {
    let r = new Fraction();
    r.u = 1;
    r.d *= Math.pow(2, this.l);
    r.d *= this.d;
    r.d *= Math.pow(2, this.p); //3/2 7/4 15/8
    r.u *= Math.pow(2, this.p + 1) - 1;
    return r.simplify();
  }
  @computed get notesY(): number[] {
    let r: number[] = [];
    let ny = 0;
    this.subNotes.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx !== 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            ny += x;
          }
        }
      }
      r.push(ny);
      let h = this.config.noteHeight;
      ny += h;
      if (it.t > 0) {
        let i = it.t;
        for (; i > 0; --i) {
          let x = this.config.pointGap;
          ny += x;
        }
      }
    });
    return r;
  }
  @computed get pointsY(): number[] {
    let r: number[] = [];
    let py = 0;
    let ny = 0;
    let mb = 0;
    mb += this.l * this.config.pointGap;
    this.subNotes.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx === 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            mb += x / 2;
            r.push(-mb);
            mb += x / 2;
          }
        }
        if (idx !== 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            py += x / 2;
            r.push(py);
            py += x / 2;
            ny += x;
          }
        }
      }
      this.notesY.push(ny);
      let h = this.config.noteHeight;
      ny += h;
      py += h;
      if (it.t > 0) {
        let i = it.t;
        for (; i > 0; --i) {
          let x = this.config.pointGap;
          py += x / 2;
          r.push(py);
          py += x / 2;
          ny += x;
        }
      }
    });
    return r;
  }
  @computed get tailPointsX(): number[] {
    let r: number[] = [];
    for (let i = 0; i < this.p; ++i) {
      r.push(
        this.dx + this.config.noteWidth + (i + 1 / 2) * this.config.tailPointGap
      );
    }
    return r;
  }
  @computed get width(): number {
    return this.dx + this.config.noteWidth + this.p * this.config.tailPointGap;
  }
  @computed get preHeight(): number {
    let h = 0;
    this.subNotes.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx !== 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            h += x;
          }
        }
      }
      h += this.config.noteHeight;
      if (it.t > 0) {
        let i = it.t;
        for (; i > 0; --i) {
          let x = this.config.pointGap;
          h += x;
        }
      }
    });
    return h;
  }
  @computed get height(): number {
    return this.bar.notesMaxHeight;
  }
  @computed get x(): number {
    return this.bar.notesX[this.index];
  }
  @computed get preMarginBottom(): number {
    let mb = 0;
    mb += this.l * this.config.pointGap;
    this.subNotes.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx === 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            mb += x;
          }
        }
      }
    });
    return mb;
  }
  @computed get marginBottom(): number {
    return this.bar.notesMaxMarginBottom;
  }
  @observable isSelect: boolean = false;
  constructor(o: INote, bar: Bar, idx: number) {
    this.config = bar.config;
    this.bar = bar;
    this.index = idx;
    this.decode(o);
  }
  selection: SelectionNote = {
    kind: "note",
    level: 1,
    setSelect: (s: boolean) => {
      this.isSelect = s;
    },

    reduceLine: (l: number) => {
      this.l += l;
      if (this.l < 0) {
        this.l = 0;
      }
    },
    reduceTailPoint: (p: number) => {
      this.p += p;
      if (this.p < 0) {
        this.p = 0;
      }
    },
  };
  decode(o: INote): void {
    if (o.n !== undefined) {
      let n: string = o.n;
      let pos = n.search("@");
      let ns = "";
      let ts = "";
      if (pos === -1) {
        ns = n;
        ts = "0|0";
      } else {
        ns = n.substr(0, pos);
        ts = n.substr(pos + 1);
      }
      let ng = ns.split("|");
      ng.forEach((it) => {
        for (let i = 0; i < it.length; ++i) {
          if (
            (it.charCodeAt(i) <= 57 && it.charCodeAt(i) >= 48) ||
            it.charCodeAt(i) === 45
          ) {
            let x = it.substr(0, i);
            let n = it.charAt(i);
            let t = it.substr(i + 1).length;
            if (t !== 0 && it.charAt(i + 1) === "-") {
              t = -t;
            }
            this.subNotes.push(new SubNote({ x, n, t }));
            break;
          }
        }
      });
      let tg = ts.split("|");
      if (tg.length === 3) {
        this.l = parseInt(tg[0]);
        this.p = parseInt(tg[1]);
        this.d = parseInt(tg[2]);
      } else if (tg.length === 2) {
        this.l = parseInt(tg[0]);
        this.p = parseInt(tg[1]);
        this.d = 1;
      } else if (tg.length === 1) {
        this.l = parseInt(tg[0]);
        this.p = 0;
        this.d = 1;
      } else {
        this.l = 0;
        this.p = 0;
        this.d = 1;
      }
    }
  }
  code(): INote {
    let ns: string = "";
    this.subNotes.forEach((it, idx) => {
      let t = "";
      if (it.t > 0) {
        for (let i = 0; i < it.t; ++i) {
          t += "+";
        }
      } else {
        for (let i = 0; i < -it.t; ++i) {
          t += "-";
        }
      }
      if (idx + 1 >= this.subNotes.length) {
        ns += `${it.x}${it.n}${t}`;
      } else {
        ns += `${it.x}${it.n}${t}|`;
      }
    });
    let n = `${ns}@${this.l}|${this.p}`;
    return { n };
  }
}

function castX(x: string) {
  let m: Record<string, string> = {
    S: "#",
    F: "b",
    DS: "x",
    DF: "d",
    N: "n",
  };
  return m[x] || "";
}

function pointGroup(note: Note, clazz: string) {
  return (
    <g className={clazz + "__group-point"}>
      {note.pointsY.map((it, idx) => (
        <circle
          key={idx}
          r={note.config.pointRound}
          fill="black"
          transform={
            "translate(" +
            (note.dx + note.config.noteWidth / 2) +
            "," +
            (note.height - it + note.config.pointGap / 2) +
            ")"
          }
        />
      ))}
    </g>
  );
}

function tailPoint(note: Note, clazz: string) {
  return (
    <g className={clazz + "__tail-point"}>
      {note.tailPointsX.map((it, idx) => (
        <circle
          key={idx}
          r={note.config.pointRound}
          fill="black"
          transform={
            "translate(" +
            it +
            "," +
            (note.height - note.config.noteHeight / 3) +
            ")"
          }
        />
      ))}
    </g>
  );
}

interface MuseSubNoteProps {
  dx: number;
  y: number;
  w: number;
  h: number;
  config: MuseConfig;
  subNote: SubNote;
}
@observer
class MuseSubNote extends React.Component<MuseSubNoteProps, {}> {
  render() {
    return (
      <g
        className={"muse-note__subnote"}
        transform={"translate(" + this.props.dx + "," + this.props.y + ")"}
        width={this.props.w}
        height={this.props.h}
        onClick={() => {
          console.log("subnote");
          Selector.instance.select(this.props.subNote.selection, true);
          console.log(this.props.subNote.isSelect);
        }}
      >
        <text
          fontFamily={this.props.config.noteFontFamily}
          fontSize={this.props.config.noteFontSize}
          transform={"translate(" + this.props.dx + "," + 0 + ")"}
        >
          {this.props.subNote.n}
        </text>
        <text
          fontFamily={this.props.config.noteFontFamily}
          fontSize={this.props.config.sigFontSize}
          transform={
            "translate(" +
            0 +
            "," +
            (this.props.config.sigFontSize - this.props.config.noteHeight) +
            ")"
          }
        >
          {castX(this.props.subNote.x)}
        </text>
        <Border
          x={0}
          y={0}
          w={24}
          h={24}
          clazz={"muse-note__subnote"}
          show={this.props.subNote.isSelect}
        />
      </g>
    );
  }
}

@observer
class MuseNote extends React.Component<{ note: Note }, {}> {
  render() {
    let clazz = "muse-note";
    return (
      <g
        className={clazz}
        transform={"translate(" + this.props.note.x + "," + 0 + ")"}
        width={this.props.note.width}
        height={this.props.note.height}
        onClick={() => {
          console.log("note");
          Selector.instance.select(this.props.note.selection, true);
        }}
      >
        <OuterBorder
          w={this.props.note.width}
          h={this.props.note.height + this.props.note.marginBottom}
          clazz={clazz}
          show={this.props.note.isSelect}
          color={"blue"}
        />
        {this.props.note.subNotes.map((it, idx) => (
          <MuseSubNote
            key={idx}
            dx={this.props.note.dx}
            y={this.props.note.height - this.props.note.notesY[idx]}
            w={this.props.note.width}
            h={22}
            config={this.props.note.config}
            subNote={it}
          />
        ))}
        {pointGroup(this.props.note, clazz)}
        {tailPoint(this.props.note, clazz)}
      </g>
    );
  }
}

export default MuseNote;
