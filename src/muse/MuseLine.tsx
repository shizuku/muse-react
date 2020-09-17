import React from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseTrack, { Track } from "./MuseTrack";
import { Border } from "./Border";
import Codec from "./Codec";
import { ILine, ITrack } from "./repo/schema";
import { observable } from "mobx";
import { useObserver } from "mobx-react";

export class Line implements Codec {
  readonly config: MuseConfig;
  @observable tracks: Track[] = [];
  @observable dimens: Dimens = new Dimens();
  constructor(o: ILine, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: ILine): void {
    if (o.tracks !== undefined) {
      o.tracks.forEach((it: any) => {
        this.tracks.push(new Track(it, this.config));
      });
    }
  }
  code(): ILine {
    let tracks: ITrack[] = this.tracks.map((it) => it.code());
    return { tracks };
  }
}

const LineHead: React.FC<{ dimens: Dimens; clazz: string }> = ({
  dimens,
  clazz,
}: {
  dimens: Dimens;
  clazz: string;
}) => {
  return (
    <g className={clazz + "__line-head"}>
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={dimens.height}
        strokeWidth={1}
        stroke="black"
      />
    </g>
  );
};

const MuseLine: React.FC<{ line: Line }> = ({ line }: { line: Line }) => {
  let [tracks, d] = useObserver(() => {
    return [line.tracks, line.dimens];
  });
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
      <Border dimens={d} clazz={clazz} />
      <LineHead dimens={d} clazz={clazz} />
      {tracks.map((it, idx) => (
        <MuseTrack key={idx} track={it} />
      ))}
    </g>
  );
};

export default MuseLine;
