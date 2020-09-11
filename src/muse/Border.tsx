import React from "react";
import Dimens from "./Dimens";

export function border(
  d: Dimens,
  clazz: string,
  show: boolean = false,
  color: string = "blue"
) {
  let ifShow = false;
  if (show || ifShow) {
    return (
      <rect
        className={clazz + "__border"}
        transform={"translate(" + d.marginLeft + "," + d.marginTop + ")"}
        width={d.width}
        height={d.height}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
}

export function outerBorder(
  d: Dimens,
  clazz: string,
  show: boolean = false,
  color: string = "gray"
) {
  if (show) {
    return (
      <rect
        className={clazz + "__outer-border"}
        transform={"translate(0,0)"}
        width={d.width + d.marginLeft + d.marginRight}
        height={d.height + d.marginTop + d.marginBottom}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
}
