import React from "react";
import Dimens from "./Dimens";

interface BorderProps {
  dimens: Dimens;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const Border: React.FC<BorderProps> = ({
  dimens,
  clazz,
  show = false,
  color = "blue",
}: BorderProps) => {
  let ifShow = false;
  if (show || ifShow) {
    return (
      <rect
        className={clazz + "__border"}
        transform={
          "translate(" + dimens.marginLeft + "," + dimens.marginTop + ")"
        }
        width={dimens.width}
        height={dimens.height}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
};

interface OuterBorderProps {
  dimens: Dimens;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const OuterBorder: React.FC<OuterBorderProps> = ({
  dimens,
  clazz,
  show = false,
  color = "gray",
}: OuterBorderProps) => {
  if (show) {
    return (
      <rect
        className={clazz + "__outer-border"}
        transform={"translate(0,0)"}
        width={dimens.width + dimens.marginLeft + dimens.marginRight}
        height={dimens.height + dimens.marginTop + dimens.marginBottom}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
};
