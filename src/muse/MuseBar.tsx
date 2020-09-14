import React, { useEffect, useState } from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseNote, { Note } from "./MuseNote";
import { border } from "./Border";
import Selector from "./Selector";
import Codec from "./Codec";

export class Bar implements Codec {
  config: MuseConfig;
  notes: Note[] = [];
  dimens: Dimens = new Dimens();
  unitNum: number = 0;
  notesX: number[] = [];
  baselineGroup: {
    y: number;
    s: number;
    e: number;
  }[] = [];
  constructor(o: any, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: any): void {
    if (o.notes !== undefined) {
      o.notes.forEach((it: any) => {
        this.notes.push(new Note(it, this.config));
      });
      this.generateBaseline();
      this.notesX.push(1);
      this.notes.forEach((note, idx) => {
        let x = 0;
        if (this.notes[idx + 1] === undefined) {
          x += 1;
        } else if (
          this.notes[idx + 1] !== undefined &&
          this.notes[idx + 1].l < note.l
        ) {
          x += Math.pow(2, -this.notes[idx + 1].l);
        } else {
          x += Math.pow(2, -note.l);
        }
        let q = 1;
        for (let i = 1; i <= note.p; ++i) {
          q += Math.pow(2, -i);
        }
        x *= q;
        this.notesX.push(x);
        this.unitNum += x;
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  code(): any {
    let o: any = {};
    o.notes = [];
    this.notes.forEach((it) => o.notes.push(it.code()));
    return o;
  }
  generateBaseline() {
    for (let i = 0; ; ++i) {
      let x = 0;
      let s = 0;
      let e = -1;
      this.notes.forEach((it, idx) => {
        if (it.l > i) {
          e = idx;
          x++;
        } else {
          if (s <= e) this.baselineGroup.push({ y: i, s: s, e: e });
          s = idx + 1;
          e = idx;
        }
      });
      if (s <= e) this.baselineGroup.push({ y: i, s: s, e: e });
      if (x === 0) {
        break;
      }
    }
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
      {bar.baselineGroup.map((it, idx) => (
        <line
          key={idx}
          x1={bar.notes[it.s].dimens.x}
          y1={bar.notes[it.s].dimens.height + (it.y + 1) * bar.config.pointGap}
          x2={bar.notes[it.e].dimens.x + bar.notes[it.e].dimens.width}
          y2={bar.notes[it.s].dimens.height + (it.y + 1) * bar.config.pointGap}
          stroke={"black"}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

function MuseBar(props: { cursor: number[]; selector: Selector }) {
  let [bar, setBar] = useState<Bar | null>(null);
  useEffect(() => {
    function handleState(state: { bar: Bar }) {
      setBar(state.bar);
    }
    props.selector.fetchBar(props.cursor, handleState);
    return () => props.selector.unFetchBar(props.cursor);
  });
  if (bar) {
    let d = bar.dimens;
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
        {baseLine(bar, clazz)}
        {bar.notes.map((it, idx) => (
          <MuseNote
            key={idx}
            cursor={[...props.cursor, idx]}
            selector={props.selector}
          />
        ))}
      </g>
    );
  } else {
    return <></>;
  }
}

export default MuseBar;
