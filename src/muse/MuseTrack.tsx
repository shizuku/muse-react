import React from "react";
import MuseConfig from "./MuseConfig";
import MuseBar, { Bar, IBar } from "./MuseBar";
import { Border } from "./Border";
import Codec from "./Codec";
import { computed, observable } from "mobx";
import { Line } from "./MuseLine";
import Fraction from "./Fraction";
import { observer } from "mobx-react";

export interface ITrack {
  bars: IBar[];
}

export class Track implements Codec {
  readonly config: MuseConfig;
  readonly index: number;
  readonly line: Line;
  @observable bars: Bar[] = [];
  @computed get width(): number {
    return this.line.width;
  }
  @computed get height(): number {
    let h = 0;
    this.bars.forEach((it) => {
      h = it.height > h ? it.height : h;
    });
    return h;
  }
  @computed get x(): number {
    return 0;
  }
  @computed get y(): number {
    let y = this.line.tracksY;
    this.line.tracksY += this.height + this.config.trackGap;
    return y;
  }
  @computed get barsTime(): Fraction[] {
    return this.bars.map((it) => it.time);
  }
  @computed get barsWidth(): number[] {
    let sum = this.barsTime.reduce((a, b) => a.plus(b), new Fraction());
    return this.barsTime.map((it) => it.divide(sum).toNumber() * this.width);
  }
  @computed get barsX(): number[] {
    let x = 0;
    return this.barsWidth.map((it) => {
      let r = x;
      x += it;
      return r;
    });
  }
  @computed get notesMaxHeight(): number {
    return Math.max(...this.bars.map((it) => it.preNotesMaxHeight));
  }
  @computed get notesMaxMarginBottom(): number {
    return Math.max(...this.bars.map((it) => it.preNotesMaxMarginBottom));
  }
  constructor(o: ITrack, index: number, line: Line, config: MuseConfig) {
    this.index = index;
    this.line = line;
    this.config = config;
    this.decode(o);
  }
  decode(o: ITrack): void {
    if (o.bars !== undefined) {
      o.bars.forEach((it: any, idx) => {
        this.bars.push(new Bar(it, idx, this, this.config));
      });
    }
  }
  code(): ITrack {
    let bars: IBar[] = this.bars.map((it) => it.code());
    return { bars };
  }
}

@observer
class MuseTrack extends React.Component<{ track: Track }> {
  render() {
    let clazz = "muse-track";
    return (
      <g
        className={clazz}
        transform={
          "translate(" + this.props.track.x + "," + this.props.track.y + ")"
        }
        width={this.props.track.width}
        height={this.props.track.height}
      >
        <Border
          w={this.props.track.width}
          h={this.props.track.height}
          x={0}
          y={0}
          clazz={clazz}
          show={this.props.track.config.showBorder}
        />
        {this.props.track.bars.map((it, idx) => (
          <MuseBar key={idx} bar={it} />
        ))}
      </g>
    );
  }
}

export default MuseTrack;
