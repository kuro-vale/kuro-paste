export class PasteMetadataDto {
  constructor(
    count: number,
    per: number,
    first: string,
    last: string,
    previous: string,
    next: string,
    current: string,
  ) {
    this.count = count;
    this.per = per;
    this.first = first;
    this.last = last;
    this.previous = previous;
    this.next = next;
    this.current = current;
  }

  count: number;
  per: number;
  first: string;
  last: string;
  previous: string;
  next: string;
  current: string;
}
