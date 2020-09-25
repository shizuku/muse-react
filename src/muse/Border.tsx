import React from "react";

interface BorderProps {
  w: number;
  h: number;
  x: number;
  y: number;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const Border: React.FC<BorderProps> = ({
  w,
  h,
  x,
  y,
  clazz,
  show = false,
  color = "blue",
}: BorderProps) => {
  if (show) {
    return (
      <rect
        className={clazz + "__border"}
        transform={"translate(" + x + "," + y + ")"}
        width={w}
        height={h}
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
  w: number;
  h: number;
  clazz: string;
  show?: boolean;
  color?: string;
}

export const OuterBorder: React.FC<OuterBorderProps> = ({
  w,
  h,
  clazz,
  show = false,
  color = "gray",
}: OuterBorderProps) => {
  if (show) {
    return (
      <rect
        className={clazz + "__outer-border"}
        transform={"translate(0,0)"}
        width={w}
        height={h}
        stroke={color}
        strokeWidth="0.4"
        fill="none"
      />
    );
  } else {
    return <></>;
  }
};
