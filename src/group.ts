import Session = require("./session");
import utils = require("./utils");
import Person = require("./person");
import SignUpEntry = require("./sign-up-entry");

class Group {
  #groupId: string;
  #activeSession?: Session;

  constructor(groupId: string) {
    this.#groupId = groupId;
  }

  addSession(dateTimeStamp: number, startTime: string, endTime: string, numCourts: number): void {
    if (dateTimeStamp === this.#activeSession?.getDate()) {
      this.#activeSession.modifySessionDetails(this.#groupId, dateTimeStamp, startTime, endTime, numCourts);
    } else {
      this.#activeSession = new Session(this.#groupId, dateTimeStamp, startTime, endTime, numCourts);
    }
  }

  addPerson(person: Person): void {
    this.#activeSession?.addPerson(person);
  }

  removePerson(personId: string): void {
    this.#activeSession?.removePerson(personId);
  }

  isGuestMember(personId: string): boolean | undefined {
    return this.#activeSession?.isGuestMember(personId);
  }

  hasSignedUp(personId: string): boolean | undefined {
    return this.#activeSession?.hasSignedUp(personId);
  }

  isSignedIn(personId: string): boolean | undefined {
    return this.#activeSession?.isSignedIn(personId);
  }

  getSignUpTimeStamp(personId: string): number | undefined {
    return this.#activeSession?.getSignUpTimeStamp(personId);
  }

  setSignUp(personId: string, isSignedIn: boolean, signUpTimeStamp: number): void {
    this.#activeSession?.setSignUp(personId, isSignedIn, signUpTimeStamp);
  }

  setPaid(personId: string, hasPaid: boolean, paidTimeStamp: number): void {
    this.#activeSession?.setPaid(personId, hasPaid, paidTimeStamp);
  }

  removePaid(personId: string): void {
    this.#activeSession?.removePaid(personId);
  }

  hasPaid(personId: string): boolean | undefined {
    return this.#activeSession?.hasPaid(personId);
  }

  getPaidTimeStamp(personId: string): number | undefined {
    return this.#activeSession?.getPaidTimeStamp(personId);
  }

  getSignedInListString(): string | undefined {
    return this.#activeSession?.getSignedInListString();
  }

  getSignedOutListString(): string | undefined {
    return this.#activeSession?.getSignedOutListString();
  }

  getUndecidedListString(): string | undefined {
    return this.#activeSession?.getUndecidedListString();
  }

  getPaidListString(): string | undefined {
    return this.#activeSession?.getPaidListString();
  }

  getUnpaidListString(): string | undefined {
    return this.#activeSession?.getUnpaidListString();
  }

  getMentionsList(): {[mentions: string] : string[]} | undefined {
    return this.#activeSession?.getMentionsList();
  }

  toString(): string {
    return `${this.#activeSession?.toString()}`;
  }

}

export = Group;