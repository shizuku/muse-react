import React from "react";
import MuseConfig from "./MuseConfig";
import MuseTrack, { ITrack, Track } from "./MuseTrack";
import { Border } from "./Border";
import Codec from "./Codec";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Page } from "./MusePage";

export interface ILine {
  tracks: ITrack[];
}

export class Line implements Codec {
  readonly page: Page;
  readonly index: number;
  readonly config: MuseConfig;
  @observable tracks: Track[] = [];
  @computed get width() {
    return this.page.width;
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
    return this.page.x;
  }
  @computed get y() {
    return this.page.linesY[this.index];
  }
  @computed get tracksY(): number[] {
    let y = 0;
    return this.tracks.map((it) => {
      let r = y;
      y += it.height + this.config.trackGap;
      return r;
    });
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

@observer
class MuseLine extends React.Component<{ line: Line }> {
  render() {
    let clazz = "muse-line";
    return (
      <g
        className={clazz}
        transform={
          "translate(" + this.props.line.x + "," + this.props.line.y + ")"
        }
        width={this.props.line.width}
        height={this.props.line.height}
      >
        <Border
          w={this.props.line.width}
          h={this.props.line.height}
          x={0}
          y={0}
          clazz={clazz}
          show={this.props.line.config.showBorder}
        />
        <LineHead height={this.props.line.height} clazz={clazz} />
        {this.props.line.tracks.map((it, idx) => (
          <MuseTrack key={idx} track={it} />
        ))}
      </g>
    );
  }
}

export default MuseLine;
