import React from "react";
import Codec from "./Codec";
import Dimens from "./Dimens";
import { border } from "./untils";
import "./config";
import config from "./config";

export class Note implements Codec {
  n: string = "";
  noteGroup: {
    x: string;
    n: string;
    t: number;
  }[] = [];
  l: number = 0;
  p: number = 0;
  dx: number = 0;
  notesY: number[] = [];
  pointsY: number[] = [];
  tailPointsX: number[] = [];
  dimens: Dimens = new Dimens();
  constructor(json: string) {
    this.parse(json);
  }
  settle() {
    let width = this.dx + config.noteWidth + this.p * config.tailPointGap;
    let ny = 0;
    let mb = 0;
    mb += this.l * config.pointGap;
    let py = 0;
    this.noteGroup.forEach((it, idx) => {
      if (it.t < 0) {
        if (idx === 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = config.pointGap;
            mb += x / 2;
            this.pointsY.push(-mb);
            mb += x / 2;
          }
        }
        if (idx !== 0) {
          let i = -it.t;
          for (; i > 0; --i) {
            let x = config.pointGap;
            py += x / 2;
            this.pointsY.push(py);
            py += x / 2;
            ny += x;
          }
        }
      }
      this.notesY.push(ny);
      let h = config.noteHeight;
      ny += h;
      py += h;
      if (it.t > 0) {
        let i = it.t;
        for (; i > 0; --i) {
          let x = config.pointGap;
          py += x / 2;
          this.pointsY.push(py);
          py += x / 2;
          ny += x;
        }
      }
    });
    for (let i = 0; i < this.p; ++i) {
      this.tailPointsX.push(
        this.dx + config.noteWidth + (i + 1 / 2) * config.tailPointGap
      );
    }
    this.dimens.width = width;
    this.dimens.height = ny;
    this.dimens.marginBottom = mb;
  }
  generateGroup() {
    let g = this.n.split("|");
    g.forEach((it) => {
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
            this.dx = config.noteWidth;
          }
          break;
        }
      }
    });
  }
  parse(json: string): void {
    let o: any = JSON.parse(json);
    if (o.n !== undefined) {
      this.n = o.n;
      this.generateGroup();
      this.l = o.l;
      this.p = o.p;
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  stringify(): string {
    return JSON.stringify(this);
  }
}

function castX(x: string) {
  if (x === "S") {
    return "#";
  } else if (x === "F") {
    return "b";
  } else if (x === "DS") {
    return "x";
  } else if (x === "DF") {
    return "d";
  } else if (x === "N") {
    return "n";
  } else {
    return "";
  }
}

function noteGroup(note: Note, clazz: string) {
  return (
    <g className={clazz + "__group-note"}>
      {note.noteGroup.map((it, idx) => {
        return (
          <g
            className={clazz + "__note-one"}
            key={it.n + idx + it.x}
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
              fontFamily={config.noteFontFamily}
              fontSize={config.noteFontSize}
              transform={"translate(" + note.dx + "," + 0 + ")"}
            >
              {it.n}
            </text>
            <text
              fontFamily={config.noteFontFamily}
              fontSize={config.noteFontSize}
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
          r={config.pointRound}
          fill="black"
          transform={
            "translate(" +
            (note.dx + config.noteWidth / 2) +
            "," +
            (note.dimens.height - it + config.pointGap / 2) +
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
          r={config.pointRound}
          fill="black"
          transform={
            "translate(" +
            it +
            "," +
            (note.dimens.height - config.noteHeight / 3) +
            ")"
          }
        />
      ))}
    </g>
  );
}

function MuseNote(props: { note: Note }) {
  let d = props.note.dimens;
  let clazz = "muse-note";
  return (
    <g
      className={clazz}
      transform={
        "translate(" + (d.x - d.marginLeft) + "," + (d.y - d.marginTop) + ")"
      }
      width={d.width + d.marginLeft + d.marginRight}
      height={d.height + d.marginTop + d.marginBottom}
    >
      {border(d, clazz)}
      {noteGroup(props.note, clazz)}
      {pointGroup(props.note, clazz)}
      {tailPoint(props.note, clazz)}
    </g>
  );
}

export default MuseNote;
