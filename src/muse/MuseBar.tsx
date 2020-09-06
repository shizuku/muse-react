import React from "react";
import Codec from "./Codec";
import config from "./config";
import Dimens from "./Dimens";
import MuseNote, { Note } from "./MuseNote";
import { border } from "./untils";

export class Bar implements Codec {
  notes: Note[] = [];
  dimens: Dimens = new Dimens();
  baselineGroup: {
    y: number;
    s: number;
    e: number;
  }[] = [
    { y: 0, s: 1, e: 2 },
  ];
  constructor(json: string) {
    this.parse(json);
  }
  generateBaseline(){
    
  }
  parse(json: string): void {
    let o = JSON.parse(json);
    if (o.notes !== undefined) {
      o.notes.forEach((it: any) => {
        this.notes.push(new Note(JSON.stringify(it)));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  stringify(): string {
    return JSON.stringify(this);
  }
}

function barLine(d: Dimens, clazz: string) {
  return (
    <line
      className={clazz + "__bar-line"}
      x1={d.marginLeft + d.width + d.marginRight}
      y1={0}
      x2={d.marginLeft + d.width + d.marginRight}
      y2={d.height}
      strokeWidth={1}
      stroke="black"
    />
  );
}

function baseLine(bar: Bar, clazz: string) {
  return (
    <g className={clazz + "__base-line"}>
      {bar.baselineGroup.map((it) => (
        <line
          x1={bar.notes[it.s].dimens.x}
          y1={bar.notes[it.s].dimens.height + (it.y + 1) * config.pointGap}
          x2={bar.notes[it.e].dimens.x + bar.notes[it.e].dimens.width}
          y2={bar.notes[it.s].dimens.height + (it.y + 1) * config.pointGap}
          stroke={"black"}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

function MuseBar(props: { bar: Bar }) {
  let d = props.bar.dimens;
  let clazz = "muse-bar";
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
      {barLine(d, clazz)}
      {baseLine(props.bar, clazz)}
      {props.bar.notes.map((it) => (
        <MuseNote note={it} key={JSON.stringify(it)} />
      ))}
    </g>
  );
}

export default MuseBar;
