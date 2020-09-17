import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { Border, OuterBorder } from "./Border";
import Codec from "./Codec";
import { ILine, IPage } from "./repo/schema";
import { observable } from "mobx";
import { useObserver } from "mobx-react";

export class Page implements Codec {
  readonly config: MuseConfig;
  @observable lines: Line[] = [];
  @observable dimens: Dimens = new Dimens();
  @observable index: number = 0;
  constructor(o: IPage, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: IPage): void {
    if (o.lines !== undefined) {
      o.lines.forEach((it: any) => {
        this.lines.push(new Line(it, this.config));
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
        {index.toString()}
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
