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

export class Track implements Codec {
  readonly config: MuseConfig;
  readonly index: number;
  readonly line: Line;
  @observable bars: Bar[] = [];
  @observable dimensValue: Dimens = new Dimens();
  @computed get dimens() {
    this.dimensValue.width = this.line.dimens.width;
    this.dimensValue.x = 0;
    return this.dimensValue;
  }
  set dimens(d: Dimens) {
    this.dimensValue.copyFrom(d);
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

const MuseTrack: React.FC<{ track: Track }> = ({ track }: { track: Track }) => {
  let [bars, d] = useObserver(() => {
    return [track.bars, track.dimens];
  });
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
      <Border dimens={d} clazz={clazz} />
      {bars.map((it, idx) => (
        <MuseBar key={idx} bar={it} />
      ))}
    </g>
  );
};

export default MuseTrack;
