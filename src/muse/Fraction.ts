export default class Fraction {
  u: number = 0;
  d: number = 1;
  parse(x: string): Fraction {
    let pos = x.search("/");
    if (pos !== -1) {
      this.u = parseInt(x.substr(0, pos));
      this.d = parseInt(x.substr(pos + 1));
    } else {
      this.u = parseInt(x);
    }
    return this;
  }
  init(u: number, d: number): Fraction {
    this.u = u;
    this.d = d;
    return this;
  }
  gcd(a: number, b: number): number {
    while (b !== 0) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  }
  simplify(): Fraction {
    let n: number;
    while ((n = this.gcd(this.u, this.d)) > 1 || n < -1) {
      this.u /= n;
      this.d /= n;
    }
    return this;
  }
  plus(f: Fraction): Fraction {
    let r = new Fraction();
    r.u = this.u * f.d + this.d * f.u;
    r.d = this.d * f.d;
    return r.simplify();
  }
  minus(f: Fraction): Fraction {
    let r = new Fraction();
    r.u = this.u * f.d - this.d * f.u;
    r.d = this.d * f.d;
    return r.simplify();
  }
  multiply(f: Fraction): Fraction {
    let r = new Fraction();
    r.u = this.u * f.u;
    r.d = this.d * f.d;
    return r.simplify();
  }
  divide(f: Fraction): Fraction {
    let r = new Fraction();
    r.u = this.u * f.d;
    r.d = this.d * f.u;
    return r.simplify();
  }
  toNumber(): number {
    return this.u / this.d;
  }
  toString(): string {
    if (this.d === 1) {
      return `${this.u}`
    } else {
      return `${this.u}/${this.d}`
    }
  }
}
