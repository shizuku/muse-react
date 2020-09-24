import React from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseBar, { Bar } from "./MuseBar";
import { Border } from "./Border";
import Codec from "./Codec";
import { IBar, ITrack } from "./repo/schema";
import { computed, observable } from "mobx";
import { useObserver } from "mobx-react";
import { Line } from "./MuseLine";
import Fraction from "./Fraction";

export class Track implements Codec {
  readonly config: MuseConfig;
  readonly index: number;
  readonly line: Line;
  @computed get barsTime(): Fraction[] {
    return this.bars.map((it) => it.time);
  }
  @computed get barsWidth(): number[] {
    let sum = this.barsTime.reduce((a, b) => a.plus(b), new Fraction());
    return this.barsTime.map((it) => it.divide(sum).toNumber() * this.width);
  }
  @observable bars: Bar[] = [];
  @computed get width(): number {
    return this.line.dimensValue.width;
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
  // @observable dimensValue: Dimens = new Dimens();
  // @computed get dimens() {
  //   let d = new Dimens();
  //   d.width = this.line.dimensValue.width;
  //   let h = 0;
  //   this.bars.forEach((it) => {
  //     h = it.dimens.height > h ? it.dimens.height : h;
  //   });
  //   d.height = h;
  //   d.x = 0;
  //   d.y = this.line.tracksY;
  //   this.line.tracksY += h + this.config.trackGap;
  //   this.dimens = d;
  //   return d;
  // }
  // set dimens(d: Dimens) {
  //   this.dimensValue.copyFrom(d);
  // }
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

const MuseTrack: React.FC<{ track: Track }> = ({ track }: { track: Track }) => {
  let [bars, width, height, x, y] = useObserver(() => {
    return [track.bars, track.width, track.height, track.x, track.y];
  });
  let clazz = "muse-track";
  return (
    <g
      className={clazz}
      transform={"translate(" + x + "," + y + ")"}
      width={width}
      height={height}
    >
      <Border dimens={d} clazz={clazz} />
      {bars.map((it, idx) => (
        <MuseBar key={idx} bar={it} />
      ))}
    </g>
  );
};

export default MuseTrack;
