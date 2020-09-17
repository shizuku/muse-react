import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseNote, { Note } from "./MuseNote";
import { Border } from "./Border";
import Codec from "./Codec";
import { IBar, INote } from "./repo/schema";
import { comparer, computed, observable } from "mobx";
import { observer } from "mobx-react";

interface Baseline {
  y: number;
  s: number;
  e: number;
}

export class Bar implements Codec {
  readonly config: MuseConfig;
  @observable notes: Note[] = [];
  @observable dimens: Dimens = new Dimens();
  unitNum: number = 0;
  notesX: number[] = [];
  @computed({ equals: comparer.structural }) get baselineGroup(): Baseline[] {
    return this.generateBaselineGroup();
  }
  generateBaselineGroup() {
    let r: {
      y: number;
      s: number;
      e: number;
    }[] = [];
    for (let i = 0; ; ++i) {
      let x = 0;
      let s = 0;
      let e = -1;
      this.notes.forEach((it, idx) => {
        if (it.l > i) {
          e = idx;
          x++;
        } else {
          if (s <= e) r.push({ y: i, s: s, e: e });
          s = idx + 1;
          e = idx;
        }
      });
      if (s <= e) r.push({ y: i, s: s, e: e });
      if (x === 0) {
        break;
      }
    }
    console.log("xxxxxx");
    return r;
  }
  constructor(o: IBar, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: IBar): void {
    if (o.notes !== undefined) {
      o.notes.forEach((it: any) => {
        this.notes.push(new Note(it, this));
      });
      this.notesX.push(1);
      this.notes.forEach((note, idx) => {
        let x = 0;
        if (idx + 1 >= this.notes.length) {
          x += 1;
        } else if (
          this.notes[idx + 1] !== undefined &&
          this.notes[idx + 1].l < note.l
        ) {
          x += Math.pow(2, -this.notes[idx + 1].l);
        } else {
          x += Math.pow(2, -note.l);
        }
        let q = 1;
        for (let i = 1; i <= note.p; ++i) {
          q += Math.pow(2, -i);
        }
        x *= q;
        this.notesX.push(x);
        this.unitNum += x;
      });
    }
  }
  code(): IBar {
    let notes: INote[] = this.notes.map((it) => it.code());
    return { notes };
  }
}

const BarLine: React.FC<{ d: Dimens; clazz: string }> = ({
  d,
  clazz,
}: {
  d: Dimens;
  clazz: string;
}) => {
  return (
    <line
      className={clazz + "__bar-line"}
      x1={d.marginLeft + d.width + d.marginRight}
      y1={0}
      x2={d.marginLeft + d.width + d.marginRight}
      y2={d.height}
      strokeWidth={1}
      stroke="black"
    />
  );
};

const BaseLine: React.FC<{ bar: Bar; clazz: string }> = ({
  bar,
  clazz,
}: {
  bar: Bar;
  clazz: string;
}) => {
  return (
    <g className={clazz + "__base-line"}>
      {bar.baselineGroup.map((it, idx) => (
        <line
          key={idx}
          x1={bar.notes[it.s].dimens.x}
          y1={bar.notes[it.s].dimens.height + (it.y + 1) * bar.config.pointGap}
          x2={bar.notes[it.e].dimens.x + bar.notes[it.e].dimens.width}
          y2={bar.notes[it.s].dimens.height + (it.y + 1) * bar.config.pointGap}
          stroke={"black"}
          strokeWidth={1}
        />
      ))}
    </g>
  );
};

@observer
class MuseBar extends React.Component<{ bar: Bar }, {}> {
  render() {
    let d = this.props.bar.dimens;
    let notes = this.props.bar.notes;
    let clazz = "muse-bar";
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
        <BarLine d={d} clazz={clazz} />
        {notes.map((it, idx) => (
          <MuseNote key={idx} note={it} />
        ))}
        <BaseLine bar={this.props.bar} clazz={clazz} />
      </g>
    );
  }
}

export default MuseBar;
