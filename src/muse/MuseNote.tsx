import React from "react";
import Dimens from "./Dimens";
import { OuterBorder } from "./Border";
import MuseConfig from "./MuseConfig";
import Codec from "./Codec";
import Fraction from "./Fraction";
import { INote } from "./repo/schema";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";

export class Note implements Codec {
  readonly config: MuseConfig;
  @observable noteGroup: {
    x: string;
    n: string;
    t: number;
  }[] = [];
  l: number = 0;
  p: number = 0;
  d: number = 0;
  dx: number = 0;
  @computed get time(): Fraction {
    let r = new Fraction("");
    r.u = 1;
    r.d *= Math.pow(2, this.l);
    r.d *= this.d;
    r.d *= Math.pow(2, this.p); //3/2 7/4 15/8
    r.u *= Math.pow(2, this.p + 1) - 1;
    return r.simplify();
  }
  notesY: number[] = [];
  pointsY: number[] = [];
  tailPointsX: number[] = [];
  @observable dimens: Dimens = new Dimens();
  @observable isSelect: boolean = false;
  constructor(o: any, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  settle() {
    let width =
      this.dx + this.config.noteWidth + this.p * this.config.tailPointGap;
    let ny = 0;
    let mb = 0;
    mb += this.l * this.config.pointGap;
    let py = 0;
    this.noteGroup.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx === 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            mb += x / 2;
            this.pointsY.push(-mb);
            mb += x / 2;
          }
        }
        if (idx !== 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = this.config.pointGap;
            py += x / 2;
            this.pointsY.push(py);
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
          this.pointsY.push(py);
          py += x / 2;
          ny += x;
        }
      }
    });
    for (let i = 0; i < this.p; ++i) {
      this.tailPointsX.push(
        this.dx + this.config.noteWidth + (i + 1 / 2) * this.config.tailPointGap
      );
    }
    this.dimens.width = width;
    this.dimens.height = ny;
    this.dimens.marginBottom = mb;
  }
  decode(o: any): void {
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
            this.noteGroup.push({ x, n, t });
            if (x !== "") {
              this.dx = this.config.sigFontSize / 2;
            }
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
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  code(): INote {
    let ns: string = "";
    this.noteGroup.forEach((it, idx) => {
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
      if (idx + 1 >= this.noteGroup.length) {
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

function noteGroup(note: Note, clazz: string) {
  return (
    <g className={clazz + "__group-note"}>
      {note.noteGroup.map((it, idx) => {
        return (
          <g
            className={clazz + "__note-one"}
            key={idx}
            width={note.dimens.width}
            height={note.notesY[idx]}
            transform={
              "translate(" +
              0 +
              "," +
              (note.dimens.height - note.notesY[idx]) +
              ")"
            }
          >
            <text
              fontFamily={note.config.noteFontFamily}
              fontSize={note.config.noteFontSize}
              transform={"translate(" + note.dx + "," + 0 + ")"}
            >
              {it.n}
            </text>
            <text
              fontFamily={note.config.noteFontFamily}
              fontSize={note.config.sigFontSize}
              transform={
                "translate(" +
                0 +
                "," +
                (note.config.sigFontSize - note.config.noteHeight) +
                ")"
              }
            >
              {castX(it.x)}
            </text>
          </g>
        );
      })}
    </g>
  );
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
            (note.dimens.height - it + note.config.pointGap / 2) +
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
            (note.dimens.height - note.config.noteHeight / 3) +
            ")"
          }
        />
      ))}
    </g>
  );
}

@observer
class MuseNote extends React.Component<{ note: Note }, {}> {
  render() {
    let note = this.props.note;
    let d = note.dimens;
    let clazz = "muse-note";
    return (
      <g
        className={clazz}
        transform={
          "translate(" + (d.x - d.marginLeft) + "," + (d.y - d.marginTop) + ")"
        }
        width={d.width + d.marginLeft + d.marginRight}
        height={d.height + d.marginTop + d.marginBottom}
        onClick={() => {
          this.props.note.isSelect = !this.props.note.isSelect;
        }}
      >
        <OuterBorder
          dimens={d}
          clazz={clazz}
          show={note.isSelect}
          color={"blue"}
        />
        {noteGroup(note, clazz)}
        {pointGroup(note, clazz)}
        {tailPoint(note, clazz)}
      </g>
    );
  }
}

export default MuseNote;
