export default class Fraction {
  u: number = 0;
  d: number = 1;
  constructor(x: string | null) {
    if (x) {
      this.parse(x);
    }
  }
  parse(x: string): void {
    let pos = x.search("/");
    if (pos !== -1) {
      this.u = parseInt(x.substr(0, pos));
      this.d = parseInt(x.substr(pos + 1));
    } else {
      this.u = parseInt(x);
    }
  }
  toString(): string {
    if (this.d === 1) {
      return this.u.toString();
    } else {
      return this.u.toString() + "/" + this.d.toString();
    }
  }
  simplify(): Fraction {
    return this;
  }
  add(f: Fraction): Fraction {
    let r = new Fraction(null);
    r.u = this.u * f.d + this.d * f.u;
    r.d = this.d * f.d;
    return r.simplify();
  }
  minus(): Fraction {
    let r = new Fraction(null);
    return r;
  }
  toNumber(): number {
    return this.u / this.d;
  }
}
