import React from "react";
import Dimens from "./Dimens";
import MuseConfig from "./MuseConfig";
import MuseBar, { Bar } from "./MuseBar";
import { Border } from "./Border";
import Codec from "./Codec";
import { IBar, ITrack } from "./repo/schema";
import { observable } from "mobx";
import { useObserver } from "mobx-react";

export class Track implements Codec {
  readonly config: MuseConfig;
  @observable bars: Bar[] = [];
  @observable dimens: Dimens = new Dimens();
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
