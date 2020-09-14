export default interface Codec {
  decode(o: any): void;
  code(): any;
}
