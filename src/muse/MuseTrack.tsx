import React, { useEffect, useState } from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseBar, { Bar } from "./MuseBar";
import { border } from "./Border";
import Selector from "./Selector";
import Codec from "./Codec";

export class Track implements Codec {
  config: MuseConfig;
  bars: Bar[] = [];
  dimens: Dimens = new Dimens();
  constructor(o: any, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: any): void {
    if (o.bars !== undefined) {
      o.bars.forEach((it: any) => {
        this.bars.push(new Bar(it, this.config));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  code(): any {
    let o: any = {};
    o.bars = [];
    this.bars.forEach((it) => o.bars.push(it.code()));
    return o;
  }
}

function MuseTrack(props: { cursor: number[]; selector: Selector }) {
  let [track, setTrack] = useState<Track | null>(null);
  useEffect(() => {
    function handleState(state: { track: Track }) {
      setTrack(state.track);
    }
    props.selector.fetchTrack(props.cursor, handleState);
    return () => props.selector.unFetchTrack(props.cursor);
  });
  if (track) {
    let d = track.dimens;
    let clazz = "muse-track";
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
        {track.bars.map((it, idx) => (
          <MuseBar
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

export default MuseTrack;
