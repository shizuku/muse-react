import React from "react";
import Codec from "./Codec";
import Dimens from "./Dimens";
import MuseTrack, { Track } from "./MuseTrack";
import { border } from "./untils";

export class Line implements Codec {
  tracks: Track[] = [];
  dimens: Dimens = new Dimens();
  constructor(json: string) {
    this.parse(json);
  }
  parse(json: string): void {
    let o = JSON.parse(json);
    if (o.tracks !== undefined) {
      o.tracks.forEach((it: any) => {
        this.tracks.push(new Track(JSON.stringify(it)));
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

function lineHead(d: Dimens, clazz: string) {
  return (
    <g className={clazz + "__line-head"}>
      <line x1={0} y1={0} x2={0} y2={d.height} strokeWidth={1} stroke="black" />
    </g>
  );
}

function MuseLine(props: { line: Line }) {
  let d = props.line.dimens;
  let clazz = "muse-line";
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
      {lineHead(d, clazz)}
      {props.line.tracks.map((it) => (
        <MuseTrack track={it} key={JSON.stringify(it)} />
      ))}
    </g>
  );
}

export default MuseLine;
