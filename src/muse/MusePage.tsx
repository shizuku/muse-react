import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { border, outerBorder } from "./Border";
import Selector from "./Selector";
import Codec from "./Codec";

export class Page implements Codec {
  config: MuseConfig;
  lines: Line[] = [];
  dimens: Dimens = new Dimens();
  index: number = 0;
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
  code() {
    let o: any = {};
    o.lines = [];
    this.lines.forEach((it) => o.lines.push(it.code()));
    return o;
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

function MusePage(props: { page: Page; cursor: number[]; selector: Selector }) {
  let d = props.page.dimens;
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
      {pageIndex(props.page.index, d, clazz, props.page.config)}
      {props.page.lines.map((it, idx) => (
        <MuseLine
          line={it}
          key={idx}
          cursor={[...props.cursor, idx]}
          selector={props.selector}
        />
      ))}
    </g>
  );
}

export default MusePage;
