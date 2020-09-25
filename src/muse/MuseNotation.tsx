import React from "react";
import MuseConfig from "./MuseConfig";
import MusePage, { IPage, Page } from "./MusePage";
import { Border } from "./Border";
import Codec from "./Codec";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";

export class NotationInfo {
  @observable title: string = "";
  @observable subtitle: string = "";
  @observable author: string[] = [];
  @observable speed: string = "";
  @observable rhythmic: string = "";
  @observable C: string = "";
}

export interface INotation {
  title: string;
  subtitle: string;
  author: string;
  rhythmic: string;
  speed:string,
  C: string;
  pages: IPage[];
}

export class Notation implements Codec {
  readonly config: MuseConfig;
  @observable pages: Page[] = [];
  @observable info: NotationInfo = new NotationInfo();
  @computed get height() {
    let h = 0;
    this.pages.forEach(
      (it) => (h += it.height + it.marginTop + it.marginBottom)
    );
    return h;
  }
  @computed get width() {
    return this.config.pageWidth;
  }
  constructor(o: INotation, config: MuseConfig) {
    this.config = config;
    this.decode(o);
  }
  decode(o: INotation): void {
    if (o.pages !== undefined) {
      o.pages.forEach((it: IPage, idx) => {
        this.pages.push(new Page(it, idx, this, this.config));
      });
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
      this.info.C = o.C;
    }
  }
  code(): INotation {
    let pages: IPage[] = this.pages.map((it) => it.code());
    let author: string = "";
    this.info.author.forEach((it, idx) => {
      if (idx === this.info.author.length - 1) {
        author += it;
      } else {
        author += it + "|";
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

interface MuseNotationInfoProps {
  info: NotationInfo;
  config: MuseConfig;
  clazz: string;
}

const MuseNotationInfo: React.FC<MuseNotationInfoProps> = ({
  info,
  config,
  clazz,
}: MuseNotationInfoProps) => {
  let y = 0;
  y += config.pageMarginVertical;
  let title = (
    <text
      className={clazz + "__info-title"}
      fontFamily={config.textFontFamily}
      width={config.pageWidth}
      textAnchor={"middle"}
      fontSize={config.infoTitleFontSize}
      transform={
        "translate(" +
        (config.pageMarginHorizontal + config.pageWidth / 2) +
        "," +
        y +
        ")"
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
      width={config.pageWidth}
      textAnchor={"middle"}
      fontSize={config.infoSubtitleFontSize}
      transform={
        "translate(" +
        (config.pageMarginHorizontal + config.pageWidth / 2) +
        "," +
        y +
        ")"
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
            width={config.pageWidth}
            fontSize={config.infoFontSize}
            textAnchor={"end"}
            x={0}
            transform={
              "translate(" +
              (config.pageWidth - config.pageMarginHorizontal) +
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
    <g className={clazz + "__info-rythmic"} width={config.pageWidth}>
      <text
        fontFamily={config.textFontFamily}
        width={config.pageWidth}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y2 + ")"}
      >
        {info.speed}
      </text>
      <text
        fontFamily={config.textFontFamily}
        width={config.pageWidth}
        fontSize={config.infoFontSize}
        transform={"translate(" + config.pageMarginHorizontal + "," + y3 + ")"}
      >
        {`1=${info.C} ${info.rhythmic}`}
      </text>
    </g>
  );
  return (
    <g className={clazz + "__info"} width={config.pageWidth}>
      {title}
      {subtitle}
      {author}
      {rythimic}
    </g>
  );
};

@observer
class MuseNotation extends React.Component<{ notation: Notation }, {}> {
  render() {
    let margin = 10;
    let clazz = "muse-notation";
    return (
      <svg
        className="muse"
        width={this.props.notation.width + margin * 2}
        height={this.props.notation.height + margin * 2}
      >
        <g
          className={clazz}
          transform={"translate(" + margin + "," + margin + ")"}
          width={this.props.notation.width}
          height={this.props.notation.height}
        >
          <MuseNotationInfo
            info={this.props.notation.info}
            config={this.props.notation.config}
            clazz={clazz}
          />
          <Border
            w={this.props.notation.width}
            h={this.props.notation.height}
            x={0}
            y={0}
            clazz={clazz}
          />
          {this.props.notation.pages.map((it, idx) => (
            <MusePage key={idx} page={it} />
          ))}
        </g>
      </svg>
    );
  }
}

export default MuseNotation;
