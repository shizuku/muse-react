export default abstract class Codec {
  abstract parse(json: string): void;
  abstract stringify(): string;
}
