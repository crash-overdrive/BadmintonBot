import { isUndefined } from './utils';
import { getDisplayNameByContactId } from './wws-service';

export class Person {
  #id: string;
  #number: string;
  #isGuest: boolean;
  #displayName?: string;

  constructor(id: string, number: string, displayName: string, isGuest: boolean) {
    this.#id = id;
    this.#number = number;
    this.#displayName = displayName;
    this.#isGuest = isGuest;
  }

  getId(): string {
    return this.#id;
  }

  getNumber(): string {
    return this.#number;
  }

  async getDisplayName(): Promise<string | undefined> {
    if (isUndefined(this.#displayName)) {
      this.#displayName = await getDisplayNameByContactId(this.#id);
    } 
    return this.#displayName;
  }

  isGuestMember(): boolean {
    return this.#isGuest;
  }

  isEqual(otherPerson: Person): boolean {
    return this.#id === otherPerson.getId();
  }

  async toString(): Promise<string> {
    if (this.#isGuest) {
      return this.#id; // TODO: confirm what this should be
    } else {
      return await this.getDisplayName() || `@${this.#number}`;
    }
  }
}