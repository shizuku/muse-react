import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MusePage, { Page } from "./MusePage";
import { border } from "./Border";
import Selector from "./Selector";
import Codec from "./Codec";

export class Notation implements Codec {
  config: MuseConfig;
  pages: Page[] = [];
  title: string = "";
  subtitle: string = "";
  author: string[] = [];
  speed: string = "";
  rhythmic: string = "";
  C: string = "";
  dimens: Dimens = new Dimens();
  constructor(json: string, config: MuseConfig) {
    this.config = config;
    let o: any = JSON.parse(json);
    this.decode(o);
  }
  decode(o: any): void {
    if (o.pages !== undefined) {
      o.pages.forEach((it: any) => {
        this.pages.push(new Page(it, this.config));
      });
    }
    if (o.dimens !== undefined) {
      this.dimens = o.dimens;
    }
    if (o.title !== undefined) {
      this.title = o.title;
    }
    if (o.subtitle !== undefined) {
      this.subtitle = o.subtitle;
    }
    if (o.author !== undefined) {
      this.author = o.author.toString().split("|");
    }
    if (o.speed !== undefined) {
      this.speed = o.speed;
    }
    if (o.rhythmic) {
      this.rhythmic = o.rhythmic;
    }
    if (o.C) {
      this.C = "1=" + o.C;
    }
  }
  code() {
    let o: any = {};
    o.pages = [];
    this.pages.forEach((it) => o.pages.push(it.code()));
    return o;
  }
}

function notationInfo(notation: Notation, clazz: string) {
  let config = notation.config;
  let y = 0;
  y += config.pageMarginVertical;
  let title = (
    <text
      className={clazz + "__info-title"}
      fontFamily={config.textFontFamily}
      width={notation.dimens.width}
      textAnchor={"middle"}
      fontSize={config.infoTitleFontSize}
      transform={
        "translate(" +
        (notation.dimens.marginLeft + notation.dimens.width / 2) +
        "," +
        y +
        ")"
      }
    >
      {notation.title}
    </text>
  );
  y += config.infoTitleFontSize + config.infoGap;
  let subtitle = (
    <text
      className={clazz + "__info-subtitle"}
      fontFamily={config.textFontFamily}
      width={notation.dimens.width}
      textAnchor={"middle"}
      fontSize={config.infoSubtitleFontSize}
      transform={
        "translate(" +
        (notation.dimens.marginLeft + notation.dimens.width / 2) +
        "," +
        y +
        ")"
      }
    >
      {notation.subtitle}
    </text>
  );
  let y1 = y;
  let x = notation.author.length;
  let author = (
    <g className={clazz + "__info-author"}>
      {notation.author.map((it, idx) => {
        y1 += config.infoFontSize + config.infoGap;
        if (idx < x - 2) {
          y += config.infoFontSize + config.infoGap;
        }
        return (
          <text
            key={idx}
            fontFamily={config.textFontFamily}
            width={notation.dimens.width}
            fontSize={config.infoFontSize}
            textAnchor={"end"}
            x={0}
            transform={
              "translate(" +
              (notation.dimens.width - config.pageMarginHorizontal) +
              "," +
              y1 +
              ")"
            }
          >
            {it}
          </text>
        );
      })}
    </g>
  );
  let y2 = y + (config.infoGap + config.infoSubtitleFontSize);
  let y3 = y2 + (config.infoGap + config.infoFontSize);
  let rythimic = (
    <g className={clazz + "__info-rythmic"} width={notation.dimens.width}>
      <text
        fontFamily={config.textFontFamily}
        width={notation.dimens.width}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y2 + ")"}
      >
        {notation.speed}
      </text>
      <text
        fontFamily={config.textFontFamily}
        width={notation.dimens.width}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y3 + ")"}
      >
        {notation.C + " " + notation.rhythmic}
      </text>
    </g>
  );
  return (
    <g className={clazz + "__info"} width={notation.dimens.width}>
      {title}
      {subtitle}
      {author}
      {rythimic}
    </g>
  );
}

function MuseNotation(props: { notation: Notation; selector: Selector }) {
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
        {notationInfo(props.notation, clazz)}
        {props.notation.pages.map((it, idx) => (
          <MusePage
            page={it}
            key={idx}
            cursor={[idx]}
            selector={props.selector}
          />
        ))}
      </g>
    </svg>
  );
}

export default MuseNotation;
