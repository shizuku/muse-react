export default class Dimens {
  x: number;
  y: number;
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.marginBottom = 0;
    this.marginTop = 0;
    this.marginLeft = 0;
    this.marginRight = 0;
  }
  init(
    x: number,
    y: number,
    width: number,
    height: number,
    marginHorizontal: number,
    marginVertical: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.marginBottom = marginVertical;
    this.marginTop = marginVertical;
    this.marginLeft = marginHorizontal;
    this.marginRight = marginHorizontal;
  }
  copyFrom(d: Dimens) {
    this.x = d.x;
    this.y = d.y;
    this.width = d.width;
    this.height = d.height;
    this.marginBottom = d.marginBottom;
    this.marginTop = d.marginTop;
    this.marginLeft = d.marginLeft;
    this.marginRight = d.marginRight;
  }
}
