import React from "react";
import Dimens from "./Dimens";
import { border } from "./Border";
import MuseConfig from "./MuseConfig";

export class Note {
  config: MuseConfig;
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
  constructor(json: string, config: MuseConfig) {
    this.config = config;
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
  settle() {
    let width = this.dx + this.config.noteWidth + this.p * this.config.tailPointGap;
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
            this.dx = this.config.sigFontSize / 2;
          }
          break;
        }
      }
    });
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
