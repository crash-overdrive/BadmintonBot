// used to direct message to appropriate group
// init them from constructors and get group from constants file

import { Group } from "./group";
import { Person } from "./person";

export class Groups {
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

  getNumber(groupId: string, personId: string): string | undefined {
    return this.#groups[groupId].getNumber(personId);
  }

  async getDisplayName(groupId: string, personId: string): Promise<string | undefined> {
    return this.#groups[groupId].getDisplayName(personId);
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

  async getSignedInListString(groupId: string): Promise<string | undefined> {
    return this.#groups[groupId].getSignedInListString();
  }

  async getSignedOutListString(groupId: string): Promise<string | undefined> {
    return this.#groups[groupId].getSignedOutListString();
  }

  async getUndecidedListString(groupId: string): Promise<string | undefined> {
    return this.#groups[groupId].getUndecidedListString();
  }

  async getPaidListString(groupId: string): Promise<string | undefined> {
    return this.#groups[groupId].getPaidListString();
  }

  async getUnpaidListString(groupId: string): Promise<string | undefined> {
    return this.#groups[groupId].getUnpaidListString();
  }

  // async notifyUndecidedMembers(groupId: string): Promise<void> {
  //   await this.#groups[groupId].notifyUndecidedMembers();
  // }

  getMentionsList(groupId: string): {[mentions: string] : string[]} | undefined {
    return this.#groups[groupId].getMentionsList();
  }

  async toString(): Promise<string> {
    let stringValue: string = `*Groups*\n`;

    for (const groupId in this.#groups) {
      const group = this.#groups[groupId];

      stringValue += `${groupId} ${await group.toString()}`;
    }
    return stringValue;
  }
}