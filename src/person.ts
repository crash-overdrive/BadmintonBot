import utils = require('./utils');

class Person {
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

  isGuestMember(): boolean {
    return this.#isGuest;
  }

  isEqual(otherPerson: Person): boolean {
    return this.#id === otherPerson.getId();
  }

  toString(): string {
    if (this.#isGuest) {
      return this.#id; // TODO: confirm what this should be
    } else if (utils.isUndefined(this.#displayName)) {
      return `@${this.#number}`;
    } else {
      return this.#displayName as string;
    }
  }
}

export = Person;