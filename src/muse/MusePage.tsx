import React from "react";
import MuseConfig from "./MuseConfig";
import MuseLine, { ILine, Line } from "./MuseLine";
import { Border, OuterBorder } from "./Border";
import Codec from "./Codec";
import { computed, observable } from "mobx";
import { Notation } from "./MuseNotation";
import { observer } from "mobx-react";
import { SelectionPage } from "./Selector";

export interface IPage {
  lines: ILine[];
}

export class Page implements Codec {
  readonly notation: Notation;
  readonly config: MuseConfig;
  readonly index: number;
  @observable lines: Line[] = [];
  @observable isSelect: boolean = false;
  @computed get width() {
    return this.config.pageWidth - this.config.pageMarginHorizontal * 2;
  }
  @computed get height() {
    return (
      this.config.pageWidth * this.config.pageE -
      this.config.pageMarginVertical * 2
    );
  }
  @computed get x() {
    return this.config.pageMarginHorizontal;
  }
  @computed get y() {
    return this.marginTop + this.index * this.height;
  }
  @computed get marginTop() {
    let mt = 0;
    if (this.index === 0) {
      mt += this.config.pageMarginVertical;
      let g = this.config.infoGap;
      mt += this.config.infoTitleFontSize + g;
      mt += this.config.infoSubtitleFontSize + g;
      if (this.notation.info.author.length > 2) {
        mt += this.notation.info.author.length * (this.config.infoFontSize + g);
      } else {
        mt += 2 * (this.config.infoFontSize + g);
      }
    } else {
      mt = this.config.pageMarginVertical;
    }
    return mt;
  }
  @computed get marginBottom() {
    return this.config.pageMarginVertical;
  }
  @computed get marginLeft() {
    return this.config.pageMarginHorizontal;
  }
  @computed get marginRight() {
    return this.config.pageMarginHorizontal;
  }
  @computed get linesHeight(): number[] {
    return this.lines.map((it) => it.height);
  }
  @computed get linesY() {
    let y = this.marginTop;
    let sum = this.linesHeight.reduce((a, b) => a + b, 0);
    let gap = (this.height - sum) / (this.lines.length - 1);
    return this.linesHeight.map((it) => {
      let r = y;
      y += it + gap;
      return r;
    });
  }
  constructor(o: IPage, index: number, notation: Notation, config: MuseConfig) {
    this.index = index;
    this.notation = notation;
    this.config = config;
    this.decode(o);
  }
  selection: SelectionPage = {
    setSelect: (s: boolean) => {
      this.isSelect = s;
    },
    getThis: () => this,
  };
  decode(o: IPage): void {
    if (o.lines !== undefined) {
      o.lines.forEach((it: ILine, idx) => {
        this.lines.push(new Line(it, idx, this, this.config));
      });
    }
  }
  code(): IPage {
    let lines: ILine[] = this.lines.map((it) => it.code());
    return { lines };
  }
}

interface PageIndexProps {
  index: number;
  x: number;
  y: number;
  clazz: string;
  config: MuseConfig;
}

const PageIndex: React.FC<PageIndexProps> = ({
  index,
  x,
  y,
  clazz,
  config,
}: PageIndexProps) => {
  return (
    <g
      className={clazz + "__page-index"}
      transform={"translate(" + x + "," + y + ")"}
    >
      <text
        textAnchor={"middle"}
        fontFamily={config.textFontFamily}
        fontSize={config.pageIndexFontSize}
      >
        {(index + 1).toString()}
      </text>
    </g>
  );
};

@observer
class MusePage extends React.Component<{ page: Page }> {
  render() {
    let clazz = "muse-page";
    return (
      <g
        className={clazz}
        transform={
          "translate(" +
          (this.props.page.x - this.props.page.marginLeft) +
          "," +
          (this.props.page.y - this.props.page.marginTop) +
          ")"
        }
        width={
          this.props.page.width +
          this.props.page.marginLeft +
          this.props.page.marginRight
        }
        height={
          this.props.page.height +
          this.props.page.marginTop +
          this.props.page.marginBottom
        }
      >
        <Border
          w={this.props.page.width}
          h={this.props.page.height}
          x={this.props.page.x}
          y={this.props.page.y}
          clazz={clazz}
          show={this.props.page.isSelect}
        />
        <OuterBorder
          w={
            this.props.page.width +
            this.props.page.marginLeft +
            this.props.page.marginLeft
          }
          h={
            this.props.page.height +
            this.props.page.marginTop +
            this.props.page.marginBottom
          }
          clazz={clazz}
          show={true}
        />
        <PageIndex
          index={this.props.page.index}
          x={this.props.page.marginLeft + this.props.page.width / 2}
          y={
            this.props.page.marginTop +
            this.props.page.height +
            this.props.page.marginBottom / 2
          }
          clazz={clazz}
          config={this.props.page.config}
        />
        {this.props.page.lines.map((it, idx) => (
          <MuseLine key={idx} line={it} />
        ))}
      </g>
    );
  }
}

export default MusePage;
