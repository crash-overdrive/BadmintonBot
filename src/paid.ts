import { convertTimeStampToString } from './utils';

export class Paid {
  #hasPaid: boolean;
  #paidTimeStamp: number;

  constructor(hasPaid: boolean, paidTimeStamp: number) {
    this.#hasPaid = hasPaid;
    this.#paidTimeStamp = paidTimeStamp;
  }

  setPaid(hasPaid: boolean, paidTimeStamp: number): void {
    this.#hasPaid = hasPaid;
    this.#paidTimeStamp = paidTimeStamp;
  }

  hasPaid(): boolean {
    return this.#hasPaid;
  }

  getPaidTimeStamp(): number {
    return this.#paidTimeStamp;
  }

  toString(): string {
    if (this.#hasPaid) {
      return `Paid Status: ✅ @ ${convertTimeStampToString(this.#paidTimeStamp)}`
    }
    return `Paid Status: ❌`
  }
}