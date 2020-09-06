import React from "react";
import Dimens from "./Dimens";
 
export function border(d: Dimens, clazz: string) {
  let show = false;
  if (show) {
    return (
      <rect
        className={clazz + "__border"}
        transform={"translate(" + d.marginLeft + "," + d.marginTop + ")"}
        width={d.width}
        height={d.height}
        stroke="blue"
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
}

export function outerBorder(d: Dimens, clazz: string) {
  return (
    <rect
      className={clazz + "__outer-border"}
      transform={"translate(0,0)"}
      width={d.width + d.marginLeft + d.marginRight}
      height={d.height + d.marginTop + d.marginBottom}
      stroke="gray"
      strokeWidth="0.4"
      fill="none"
    />
  );
}
