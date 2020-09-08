import React from "react";
import Dimens from "./Dimens";
import MusePage, { Page } from "./MusePage";
import { border } from "./untils";

export class Notation {
  pages: Page[] = [];
  dimens: Dimens = new Dimens();
  constructor(json: string) {
    let o = JSON.parse(json);
    if (o.pages !== undefined) {
      o.pages.forEach((it: any) => {
        this.pages.push(new Page(JSON.stringify(it)));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
  }
}

function MuseNotation(props: { notation: Notation }) {
  let margin = 10;
  let d = props.notation.dimens;
  let clazz = "muse-notation";
  return (
    <svg
      className="muse"
      width={props.notation.dimens.width + margin * 2}
      height={props.notation.dimens.height + margin * 2}
    >
      <g
        className={clazz}
        transform={"translate(" + margin + "," + margin + ")"}
        width={props.notation.dimens.width}
        height={props.notation.dimens.height}
      >
        {border(d, clazz)}
        {props.notation.pages.map((it) => (
          <MusePage page={it} key={JSON.stringify(it)} />
        ))}
      </g>
    </svg>
  );
}

export default MuseNotation;
