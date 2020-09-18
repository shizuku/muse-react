import React from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseTrack, { Track } from "./MuseTrack";
import { Border } from "./Border";
import Codec from "./Codec";
import { ILine, ITrack } from "./repo/schema";
import { computed, observable } from "mobx";
import { useObserver } from "mobx-react";
import { Page } from "./MusePage";

export class Line implements Codec {
  readonly page: Page;
  readonly index: number;
  readonly config: MuseConfig;
  @observable tracks: Track[] = [];
  @observable dimensValue: Dimens = new Dimens();
  @computed get dimens() {
    this.dimensValue.width = this.page.dimens.width;
    this.dimensValue.x = this.page.dimens.x;
    return this.dimensValue;
  }
  set dimens(d: Dimens) {
    this.dimensValue.copyFrom(d);
  }
  constructor(o: ILine, index: number, page: Page, config: MuseConfig) {
    this.page = page;
    this.index = index;
    this.config = config;
    this.decode(o);
  }
  decode(o: ILine): void {
    if (o.tracks !== undefined) {
      o.tracks.forEach((it: ITrack, idx) => {
        this.tracks.push(new Track(it, idx, this, this.config));
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
