import React from "react";
import Dimens from "./Dimens";
import MuseLine, { Line } from "./MuseLine";
import { border, outerBorder } from "./untils";

export class Page {
  lines: Line[] = [];
  dimens: Dimens = new Dimens();
  constructor(json: string) {
    let o = JSON.parse(json);
    if (o.lines !== undefined) {
      o.lines.forEach((it: any) => {
        this.lines.push(new Line(JSON.stringify(it)));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
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
      {props.page.lines.map((it) => (
        <MuseLine line={it} key={JSON.stringify(it)} />
      ))}
    </g>
  );
}

export default MusePage;
