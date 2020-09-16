import React from "react";
import MuseConfig from "./MuseConfig";
import Dimens from "./Dimens";
import MusePage, { Page } from "./MusePage";
import { Border } from "./Border";
import Codec from "./Codec";
import { INotation, IPage } from "./repo/schema";
import { observable } from "mobx";
import { useMuseRepo } from "./repo/muse-repo";
import { useObserver } from "mobx-react";

export class NotationInfo {
  @observable title: string = "";
  @observable subtitle: string = "";
  @observable author: string[] = [];
  @observable speed: string = "";
  @observable rhythmic: string = "";
  @observable C: string = "";
}

export class Notation implements Codec {
  readonly config: MuseConfig;
  @observable pages: Page[] = [];
  @observable info: NotationInfo = new NotationInfo();
  @observable dimens: Dimens = new Dimens();
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
      this.info.title = o.title;
    }
    if (o.subtitle !== undefined) {
      this.info.subtitle = o.subtitle;
    }
    if (o.author !== undefined) {
      this.info.author = o.author.toString().split("|");
    }
    if (o.speed !== undefined) {
      this.info.speed = o.speed;
    }
    if (o.rhythmic) {
      this.info.rhythmic = o.rhythmic;
    }
    if (o.C) {
      this.info.C = "1=" + o.C;
    }
  }
  code(): INotation {
    let pages: IPage[] = this.pages.map((it) => it.code());
    let author = this.info.author.reduce((p, c, idx) => {
      if (idx === this.info.author.length - 1) {
        return p + c;
      } else {
        return p + c + "|";
      }
    });
    return {
      title: this.info.title,
      subtitle: this.info.subtitle,
      author: author,
      rhythmic: this.info.rhythmic,
      speed: this.info.speed,
      C: this.info.C,
      pages,
    };
  }
}

const MuseNotationInfo: React.FC<{
  notation: Notation;
  clazz: string;
}> = (props) => {
  let config = props.notation.config;
  let info = props.notation.info;
  let clazz = props.clazz;
  let dimens = props.notation.dimens;
  let y = 0;
  y += config.pageMarginVertical;
  let title = (
    <text
      className={clazz + "__info-title"}
      fontFamily={config.textFontFamily}
      width={dimens.width}
      textAnchor={"middle"}
      fontSize={config.infoTitleFontSize}
      transform={
        "translate(" + (dimens.marginLeft + dimens.width / 2) + "," + y + ")"
      }
    >
      {info.title}
    </text>
  );
  y += config.infoTitleFontSize + config.infoGap;
  let subtitle = (
    <text
      className={clazz + "__info-subtitle"}
      fontFamily={config.textFontFamily}
      width={dimens.width}
      textAnchor={"middle"}
      fontSize={config.infoSubtitleFontSize}
      transform={
        "translate(" + (dimens.marginLeft + dimens.width / 2) + "," + y + ")"
      }
    >
      {info.subtitle}
    </text>
  );
  let y1 = y;
  let x = info.author.length;
  let author = (
    <g className={clazz + "__info-author"}>
      {info.author.map((it, idx) => {
        y1 += config.infoFontSize + config.infoGap;
        if (idx < x - 2) {
          y += config.infoFontSize + config.infoGap;
        }
        return (
          <text
            key={idx}
            fontFamily={config.textFontFamily}
            width={dimens.width}
            fontSize={config.infoFontSize}
            textAnchor={"end"}
            x={0}
            transform={
              "translate(" +
              (dimens.width - config.pageMarginHorizontal) +
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
    <g className={clazz + "__info-rythmic"} width={dimens.width}>
      <text
        fontFamily={config.textFontFamily}
        width={dimens.width}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y2 + ")"}
      >
        {info.speed}
      </text>
      <text
        fontFamily={config.textFontFamily}
        width={dimens.width}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y3 + ")"}
      >
        {info.C + " " + info.rhythmic}
      </text>
    </g>
  );
  return (
    <g className={clazz + "__info"} width={dimens.width}>
      {title}
      {subtitle}
      {author}
      {rythimic}
    </g>
  );
};

const MuseNotation: React.FC = () => {
  const repo = useMuseRepo();
  let notation = useObserver(() => {
    return repo.notation;
  });
  let margin = 10;
  let d = notation.dimens;
  let clazz = "muse-notation";
  return (
    <svg
      className="muse"
      width={notation.dimens.width + margin * 2}
      height={notation.dimens.height + margin * 2}
    >
      <g
        className={clazz}
        transform={"translate(" + margin + "," + margin + ")"}
        width={notation.dimens.width}
        height={notation.dimens.height}
      >
        <MuseNotationInfo notation={notation} clazz={clazz} />
        <Border dimens={d} clazz={clazz} />
        {notation.pages.map((it, idx) => (
          <MusePage key={idx} page={it} />
        ))}
      </g>
    </svg>
  );
};

export default MuseNotation;
