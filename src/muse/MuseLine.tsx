import React, { useEffect, useState } from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseTrack, { Track } from "./MuseTrack";
import { border } from "./Border";
import Selector from "./Selector";
import Codec from "./Codec";

export class Line implements Codec {
  config: MuseConfig;
  tracks: Track[] = [];
  dimens: Dimens = new Dimens();
  constructor(o: any, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: any): void {
    if (o.tracks !== undefined) {
      o.tracks.forEach((it: any) => {
        this.tracks.push(new Track(it, this.config));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  code() {
    let o: any = {};
    o.tracks = [];
    this.tracks.forEach((it) => o.tracks.push(it.code()));
    return o;
  }
}

function lineHead(d: Dimens, clazz: string) {
  return (
    <g className={clazz + "__line-head"}>
      <line x1={0} y1={0} x2={0} y2={d.height} strokeWidth={1} stroke="black" />
    </g>
  );
}

function MuseLine(props: { cursor: number[]; selector: Selector }) {
  let [line, setLine] = useState<Line | null>(null);
  useEffect(() => {
    function handleState(state: { line: Line }) {
      setLine(state.line);
    }
    props.selector.fetchLine(props.cursor, handleState);
    return () => props.selector.unFetchLine(props.cursor);
  });
  if (line) {
    let d = line.dimens;
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
        {line.tracks.map((it, idx) => (
          <MuseTrack
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

export default MuseLine;
