import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { Border, OuterBorder } from "./Border";
import Codec from "./Codec";
import { ILine, IPage } from "./repo/schema";
import { computed, observable } from "mobx";
import { useObserver } from "mobx-react";
import { Notation } from "./MuseNotation";

export class Page implements Codec {
  readonly notation: Notation;
  readonly config: MuseConfig;
  readonly index: number;
  @observable lines: Line[] = [];
  linesHeight: number[] = [];
  linesY: number = 0;
  @observable dimensValue: Dimens = new Dimens();
  @computed get dimens() {
    let d = new Dimens();
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
    d.width = this.config.pageWidth - this.config.pageMarginHorizontal * 2;
    d.height =
      this.config.pageWidth * this.config.pageE -
      this.config.pageMarginVertical * 2;
    d.marginBottom = this.config.pageMarginVertical;
    d.marginTop = mt;
    d.marginLeft = this.config.pageMarginHorizontal;
    d.marginRight = this.config.pageMarginHorizontal;
    d.x = this.config.pageMarginHorizontal;
    d.y = mt + this.index * this.dimensValue.height;
    this.dimens = d;
    this.linesY = mt;
    console.log("page dimens");
    return d;
  }
  set dimens(d: Dimens) {
    this.dimensValue.copyFrom(d);
  }
  constructor(o: IPage, index: number, notation: Notation, config: MuseConfig) {
    this.index = index;
    this.notation = notation;
    this.config = config;
    this.decode(o);
    let gap =
      (this.dimensValue.height - this.linesHeight.reduce((r, c, ) => r + c)) /
      this.lines.length;
    let y = 0;
    this.lines.forEach((it, idx) => {
      it.dimensValue.y = y;
      y += this.linesHeight[idx] + gap;
    });
  }
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
  dimens: Dimens;
  clazz: string;
  config: MuseConfig;
}

const PageIndex: React.FC<PageIndexProps> = ({
  index,
  dimens,
  clazz,
  config,
}: PageIndexProps) => {
  return (
    <g
      className={clazz + "__page-index"}
      transform={
        "translate(" +
        (dimens.marginLeft + dimens.width / 2) +
        "," +
        (dimens.marginTop + dimens.height + dimens.marginBottom / 2) +
        ")"
      }
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

const MusePage: React.FC<{ page: Page }> = ({ page }: { page: Page }) => {
  let [lines, d, index] = useObserver(() => {
    return [page.lines, page.dimens, page.index];
  });
  let clazz = "muse-page";
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
      <OuterBorder dimens={d} clazz={clazz} show={true} />
      <PageIndex index={index} dimens={d} clazz={clazz} config={page.config} />
      {lines.map((it, idx) => (
        <MuseLine key={idx} line={it} />
      ))}
    </g>
  );
};

export default MusePage;