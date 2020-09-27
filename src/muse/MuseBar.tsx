import React from "react";
import MuseConfig from "./MuseConfig";
import MuseNote, { INote, Note } from "./MuseNote";
import { Border } from "./Border";
import Codec from "./Codec";
import { computed, observable } from "mobx";
import { observer, useObserver } from "mobx-react";
import Fraction from "./Fraction";
import { Track } from "./MuseTrack";
import { SelectionBar } from "./Selector";

interface Baseline {
  y: number;
  s: number;
  e: number;
}

export interface IBar {
  notes: INote[];
}

export class Bar implements Codec {
  readonly config: MuseConfig;
  readonly index: number;
  @observable track: Track;
  @observable notes: Note[] = [];
  @observable isSelect: boolean = false;
  @computed get width(): number {
    return this.track.barsWidth[this.index];
  }
  @computed get height(): number {
    let h = 0;
    this.notes.forEach((it) => {
      let u = it.height + it.marginBottom;
      h = u > h ? u : h;
    });
    return h;
  }
  @computed get x(): number {
    return this.track.barsX[this.index];
  }
  @computed get y(): number {
    return 0;
  }
  @computed get notesTime(): Fraction[] {
    return this.notes.map((it) => it.time);
  }
  @computed get notesTimeSum(): Fraction {
    return this.notesTime
      .reduce((a, b) => a.plus(b), new Fraction())
      .plus(new Fraction().init(1, 1));
  }
  @computed get notesWidth(): number[] {
    return this.notes.map((it) => it.width);
  }
  @computed get notesX(): number[] {
    let space = this.width - this.notesWidthSum;
    let unit = new Fraction().init(space, 1).divide(this.notesTimeSum);
    let x = unit.toNumber();
    return this.notesWidth.map((it, idx) => {
      let r = x;
      x += it + this.notesTime[idx].multiply(unit).toNumber();
      return r;
    });
  }
  @computed get preNotesMaxHeight(): number {
    return Math.max(...this.notes.map((it) => it.preHeight));
  }
  @computed get notesMaxHeight(): number {
    return this.track.notesMaxHeight;
  }
  @computed get preNotesMaxMarginBottom(): number {
    return Math.max(...this.notes.map((it) => it.preMarginBottom));
  }
  @computed get notesMaxMarginBottom(): number {
    return this.track.notesMaxMarginBottom;
  }
  @computed get baselineGroup(): Baseline[] {
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
    return r;
  }
  @computed get notesWidthSum(): number {
    let w = 0;
    this.notes.forEach((it) => (w += it.width));
    return w;
  }
  constructor(o: IBar, index: number, track: Track, config: MuseConfig) {
    this.index = index;
    this.track = track;
    this.config = config;
    this.decode(o);
  }
  selection: SelectionBar = {
    setSelect: (s: boolean) => {
      this.isSelect = s;
    },
    getThis: () => this,
  };
  decode(o: IBar): void {
    if (o.notes !== undefined) {
      o.notes.forEach((it: INote, idx) => {
        this.notes.push(new Note(it, this, idx));
      });
    }
  }
  code(): IBar {
    let notes: INote[] = this.notes.map((it) => it.code());
    return { notes };
  }
}

const BarLine: React.FC<{ w: number; h: number; clazz: string }> = (props: {
  w: number;
  h: number;
  clazz: string;
}) => {
  let [width, height] = useObserver(() => {
    return [props.w, props.h];
  });
  return (
    <line
      className={props.clazz + "__bar-line"}
      x1={width}
      y1={0}
      x2={width}
      y2={height}
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
  let [baselineGroup, notes] = useObserver(() => {
    return [bar.baselineGroup, bar.notes];
  });
  return (
    <g className={clazz + "__base-line"}>
      {baselineGroup.map((it, idx) => (
        <line
          key={idx}
          x1={notes[it.s].x}
          y1={notes[it.s].height + (it.y + 1) * bar.config.pointGap}
          x2={notes[it.e].x + bar.notes[it.e].width}
          y2={notes[it.s].height + (it.y + 1) * bar.config.pointGap}
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
    let notes = this.props.bar.notes;
    let clazz = "muse-bar";
    return (
      <g
        className={clazz}
        transform={
          "translate(" + this.props.bar.x + "," + this.props.bar.y + ")"
        }
        width={this.props.bar.width}
        height={this.props.bar.height}
      >
        <Border
          w={this.props.bar.width}
          h={this.props.bar.height}
          x={0}
          y={0}
          clazz={clazz}
          show={this.props.bar.config.showBorder}
        />
        <BarLine
          w={this.props.bar.width}
          h={this.props.bar.height}
          clazz={clazz}
        />
        {notes.map((it, idx) => (
          <MuseNote key={idx} note={it} />
        ))}
        <BaseLine bar={this.props.bar} clazz={clazz} />
      </g>
    );
  }
}

export default MuseBar;
