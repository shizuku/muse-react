import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { border, outerBorder } from "./Border";

export class Page {
  config: MuseConfig;
  lines: Line[] = [];
  dimens: Dimens = new Dimens();
  index: number = 0;
  constructor(json: string, config: MuseConfig) {
    this.config = config;
    let o = JSON.parse(json);
    if (o.lines !== undefined) {
      o.lines.forEach((it: any) => {
        this.lines.push(new Line(JSON.stringify(it), this.config));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
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
      {outerBorder(d, clazz)}
      {pageIndex(props.page.index, d, clazz, props.page.config)}
      {props.page.lines.map((it, idx) => (
        <MuseLine line={it} key={idx} />
      ))}
    </g>
  );
}

export default MusePage;
