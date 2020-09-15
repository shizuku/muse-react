import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { border, outerBorder } from "./Border";
import Codec from "./Codec";
import { ILine, IPage } from "./repo/schema";
import { observable } from "mobx";
import { useObserver } from "mobx-react";

export class Page implements Codec {
  readonly config: MuseConfig;
  @observable lines: Line[] = [];
  @observable dimens: Dimens = new Dimens();
  @observable index: number = 0;
  constructor(o: any, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: any): void {
    if (o.lines !== undefined) {
      o.lines.forEach((it: any) => {
        this.lines.push(new Line(it, this.config));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
  code(): IPage {
    let lines: ILine[] = this.lines.map((it) => it.code());
    return { lines };
  }
}

function pageIndex(idx: number, d: Dimens, clazz: string, config: MuseConfig) {
  return (
    <g
      className={clazz + "__page-index"}
      transform={
        "translate(" +
        (d.marginLeft + d.width / 2) +
        "," +
        (d.marginTop + d.height + d.marginBottom / 2) +
        ")"
      }
    >
      <text
        textAnchor={"middle"}
        fontFamily={config.textFontFamily}
        fontSize={config.pageIndexFontSize}
      >
        {idx.toString()}
      </text>
    </g>
  );
}

function MusePage(props: { page: Page }) {
  let page = useObserver(() => {
    return props.page;
  });

  let d = page.dimens;
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
      {border(d, clazz)}
      {outerBorder(d, clazz, true)}
      {pageIndex(page.index, d, clazz, page.config)}
      {page.lines.map((it, idx) => (
        <MuseLine
          key={idx}
          line={it}
        />
      ))}
    </g>
  );
}

export default MusePage;
