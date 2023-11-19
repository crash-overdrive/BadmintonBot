import { Person } from './person';
import { SignUp } from './sign-up';
import { isUndefined } from './utils';

export class SignUpEntry {
  #person: Person;
  #signUp?: SignUp;

  constructor(person: Person) {
    this.#person = person;
  }

  getPerson(): Person {
    return this.#person;
  }

  getPersonId(): string {
    return this.#person.getId();
  }

  isGuestMember(): boolean {
    return this.#person.isGuestMember();
  }

  getNumber(): string {
    return this.#person.getNumber();
  }

  async getDisplayName(): Promise<string | undefined> {
    return this.#person.getDisplayName();
  }

  hasSignedUp(): boolean {
    return !isUndefined(this.#signUp);
  }

  isSignedIn(): boolean | undefined {
    return this.#signUp?.isSignedIn();
  }

  getSignUpTimeStamp(): number | undefined {
    return this.#signUp?.getSignUpTimeStamp();
  }

  setSignUp(isSignedIn: boolean, signUpTimeStamp: number): void {
    if (isUndefined(this.#signUp)) {
      this.#signUp = new SignUp(isSignedIn, signUpTimeStamp*1000);
    } else if (this.#signUp?.isSignedIn() !== isSignedIn) {
      this.#signUp?.setSignUp(isSignedIn, signUpTimeStamp*1000);
    }
  }

  setPaid(hasPaid: boolean, paidTimeStamp: number): void {
    this.#signUp?.setPaid(hasPaid, paidTimeStamp*1000)
  }

  removePaid(): void {
    this.#signUp?.removePaid();
  }

  hasPaid(): boolean | undefined {
    return this.#signUp?.hasPaid();
  }

  getPaidTimeStamp(): number | undefined {
    return this.#signUp?.getPaidTimeStamp();
  }

  async toString(): Promise<string> {
    if (isUndefined(this.#signUp)) {
      return `${await this.#person.toString()}`
    } else {
      return `${await this.#person.toString()} ${this.#signUp?.toString()}`
    }
  }
}