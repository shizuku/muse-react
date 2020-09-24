import React from "react";
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
  tracksY: number = 0;
  @observable tracks: Track[] = [];
  @computed get width() {
    return this.page.dimensValue.width;
  }
  @computed get height() {
    let h = 0;
    this.tracks.forEach((it) => {
      h += it.height + this.config.trackGap;
    });
    h -= this.config.trackGap;
    return h;
  }
  @computed get x() {
    return this.page.dimens.x;
  }
  @computed get y() {
    let y = this.page.linesY;
    this.page.linesY += this.height + this.config.lineGap;
    this.page.linesHeight.push(this.height);
    return y;
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

const LineHead: React.FC<{ height: number; clazz: string }> = ({
  height,
  clazz,
}: {
  height: number;
  clazz: string;
}) => {
  return (
    <g className={clazz + "__line-head"}>
      <line x1={0} y1={0} x2={0} y2={height} strokeWidth={1} stroke="black" />
    </g>
  );
};

const MuseLine: React.FC<{ line: Line }> = ({ line }: { line: Line }) => {
  let [tracks, width, height, x, y] = useObserver(() => {
    return [line.tracks, line.width, line.height, line.index, line.y];
  });
  let clazz = "muse-line";
  return (
    <g
      className={clazz}
      transform={"translate(" + x + "," + y + ")"}
      width={width}
      height={height}
    >
      <Border width={width} height={height} x={x} y={y} clazz={clazz} />
      <LineHead height={height} clazz={clazz} />
      {tracks.map((it, idx) => (
        <MuseTrack key={idx} track={it} />
      ))}
    </g>
  );
};

export default MuseLine;
