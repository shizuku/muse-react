export default interface Codec {
  parse(json: string): void;
  stringify(): string;
}
