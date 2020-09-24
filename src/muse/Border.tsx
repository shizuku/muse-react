import React from "react";

interface BorderProps {
  width: number;
  height: number;
  x: number;
  y: number;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const Border: React.FC<BorderProps> = ({
  width,
  height,
  x,
  y,
  clazz,
  show = false,
  color = "blue",
}: BorderProps) => {
  let ifShow = true;
  if (show || ifShow) {
    return (
      <rect
        className={clazz + "__border"}
        transform={
          "translate(" + x + "," + y + ")"
        }
        width={width}
        height={height}
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
  width: number;
  height: number;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const OuterBorder: React.FC<OuterBorderProps> = ({
  width,
  height,
  clazz,
  show = false,
  color = "gray",
}: OuterBorderProps) => {
  if (show) {
    return (
      <rect
        className={clazz + "__outer-border"}
        transform={"translate(0,0)"}
        width={width}
        height={height}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
};
