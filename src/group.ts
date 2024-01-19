import { Session } from "./session";
import { Person } from "./person";

export class Group {
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

  async getDisplayName(personId: string): Promise<string | undefined> {
    return this.#activeSession?.getDisplayName(personId);
  }

  getNumber(personId: string): string | undefined {
    return this.#activeSession?.getNumber(personId);
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

  async getSignedInListString(): Promise<string | undefined> {
    return this.#activeSession?.getSignedInListString();
  }

  async getSignedOutListString(): Promise<string | undefined> {
    return this.#activeSession?.getSignedOutListString();
  }

  async getUndecidedListString(): Promise<string | undefined> {
    return this.#activeSession?.getUndecidedListString();
  }

  async getPaidListString(): Promise<string | undefined> {
    return this.#activeSession?.getPaidListString();
  }

  async getUnpaidListString(): Promise<string | undefined> {
    return this.#activeSession?.getUnpaidListString();
  }

  // async notifyUndecidedMembers(): Promise<void> {
  //   await this.#activeSession?.notifyUndecidedMembers();
  // }

  getMentionsList(): {[mentions: string] : string[]} | undefined {
    return this.#activeSession?.getMentionsList();
  }

  getSessionDetails(): string | undefined {
    return this.#activeSession?.getSessionDetails();
  }

  async toString(): Promise<string> {
    return this.#activeSession?.toString() || 'No sessions active right now';
  }

}