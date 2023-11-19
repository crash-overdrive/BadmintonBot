import { Paid } from './paid';
import { isUndefined, convertTimeStampToString } from './utils';

export class SignUp {
  #isSignedIn: boolean;
  #signUpTimeStamp: number;
  #paid?: Paid;

  constructor(isSignedIn: boolean, signUpTimeStamp: number) {
    this.#isSignedIn = isSignedIn;
    this.#signUpTimeStamp = signUpTimeStamp;

    if(this.#isSignedIn) {
      this.setPaid(false, signUpTimeStamp);
    } else {
      this.removePaid();
    }
  }

  setPaid(hasPaid: boolean, paidTimeStamp: number): void {
    if (isUndefined(this.#paid)) {
      this.#paid = new Paid(hasPaid, paidTimeStamp);
    } else {
      this.#paid?.setPaid(hasPaid, paidTimeStamp);
    }
  }

  removePaid(): void {
    this.#paid = undefined;
  }

  setSignUp(isSignedIn: boolean, signUpTimeStamp: number): void {
    this.#isSignedIn = isSignedIn;
    this.#signUpTimeStamp = signUpTimeStamp;

    if(this.#isSignedIn) {
      this.setPaid(false, signUpTimeStamp);
    } else {
      this.removePaid();
    }
  }

  isSignedIn(): boolean {
    return this.#isSignedIn;
  }

  getSignUpTimeStamp(): number {
    return this.#signUpTimeStamp;
  }

  hasPaid(): boolean | undefined {
    return this.#paid?.hasPaid();
  }

  getPaidTimeStamp(): number | undefined {
    return this.#paid?.getPaidTimeStamp();
  }

  toString(): string {
    if (this.#isSignedIn) {
      return `@ ${convertTimeStampToString(this.#signUpTimeStamp)}\n[${this.#paid?.toString()}]`;
    } else {
      return `@ ${convertTimeStampToString(this.#signUpTimeStamp)}`;
    }
  }
}