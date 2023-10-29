// used to direct message to appropriate group
// init them from constructors and get group from constants file

import Group = require("./group");
import Person = require("./person");

class Groups {
  #groups: {[groupId: string]: Group};
  constructor() {
    this.#groups = {};
  }

  addGroup(groupId: string): void {
    if (!(groupId in this.#groups)) {
      this.#groups[groupId] = new Group(groupId);
    }
  }

  getGroup(groupId: string): Group {
    return this.#groups[groupId];
  }

  addSession(groupId: string, dateTimeStamp: number, startTime: string, endTime: string, numCourts: number): void {
    this.#groups[groupId].addSession(dateTimeStamp, startTime, endTime, numCourts);
  }

  addPerson(groupId: string, person: Person): void {
    this.#groups[groupId].addPerson(person);
  }

  removePerson(groupId: string, personId: string): void {
    this.#groups[groupId].removePerson(personId);
  }

  isGuestMember(groupId: string, personId: string): boolean | undefined {
    return this.#groups[groupId].isGuestMember( personId);
  }

  hasSignedUp(groupId: string, personId: string): boolean | undefined {
    return this.#groups[groupId].hasSignedUp(personId);
  }

  isSignedIn(groupId: string, personId: string): boolean | undefined {
    return this.#groups[groupId].isSignedIn(personId);
  }

  getSignUpTimeStamp(groupId: string, personId: string): number | undefined {
    return this.#groups[groupId].getSignUpTimeStamp(personId);
  }

  setSignUp(groupId: string, personId: string, isSignedIn: boolean, signUpTimeStamp: number): void {
    this.#groups[groupId].setSignUp(personId, isSignedIn, signUpTimeStamp);
  }

  setPaid(groupId: string, personId: string, hasPaid: boolean, paidTimeStamp: number): void {
    this.#groups[groupId].setPaid(personId, hasPaid, paidTimeStamp);
  }

  removePaid(groupId: string, personId: string): void {
    this.#groups[groupId].removePaid(personId);
  }

  hasPaid(groupId: string, personId: string): boolean | undefined {
    return this.#groups[groupId].hasPaid(personId);
  }

  getPaidTimeStamp(groupId: string, personId: string): number | undefined {
    return this.#groups[groupId].getPaidTimeStamp(personId);
  }

  getSignedInListString(groupId: string): string | undefined {
    return this.#groups[groupId].getSignedInListString();
  }

  getSignedOutListString(groupId: string): string | undefined {
    return this.#groups[groupId].getSignedOutListString();
  }

  getUndecidedListString(groupId: string): string | undefined {
    return this.#groups[groupId].getUndecidedListString();
  }

  getPaidListString(groupId: string): string | undefined {
    return this.#groups[groupId].getPaidListString();
  }

  getUnpaidListString(groupId: string): string | undefined {
    return this.#groups[groupId].getUnpaidListString();
  }

  getMentionsList(groupId: string): {[mentions: string] : string[]} | undefined {
    return this.#groups[groupId].getMentionsList();
  }

  toString(): string {
    let stringValue: string = `*Groups*\n`;

    for (const groupId in this.#groups) {
      const group = this.#groups[groupId];


      stringValue += `${groupId} ${group.toString()}`;
    }
    return stringValue;
  }
}

export = Groups;