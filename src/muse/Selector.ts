class Selector {
  static instance: Selector;
  fun: ((show: boolean) => void) | undefined;
  private constructor() {
    document.addEventListener("keydown", (ev) => {
      console.log(ev);
    });
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Selector();
    }
    return this.instance;
  }
  select(f: (show: boolean) => void) {
    if (this.fun) {
      this.fun(false);
    }
    f(true);
    this.fun = f;
  }
  clear() {
      
  }
}

export default Selector;
