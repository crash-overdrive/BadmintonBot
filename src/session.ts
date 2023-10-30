
import Person = require("./person");
import SignUpEntry = require("./sign-up-entry");
import WhatsappService = require("./wws-service");
import utils = require("./utils");

function compareTimeStampsForSignUp(signUpEntryA: SignUpEntry, signUpEntryB: SignUpEntry): number {
  return (signUpEntryA.getSignUpTimeStamp()! - signUpEntryB.getSignUpTimeStamp()!);
}

function compareTimeStampsForPaid(signUpEntryA: SignUpEntry, signUpEntryB: SignUpEntry): number {
  return (signUpEntryA.getPaidTimeStamp()! - signUpEntryB.getPaidTimeStamp()!);
}


class Session {
  #groupId: string;
  #date: number;
  #startTime: string;
  #endTime: string;
  #numCourts: number;
  #maxSignIns: number;
  #signUps: {[personId: string]: SignUpEntry};

  constructor(groupId: string, date: number, startTime: string, endTime: string, numCourts: number) {
    this.#groupId = groupId;
    this.#date = date;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#numCourts = numCourts;
    this.#maxSignIns = (this.#numCourts + 1) * 4;
    this.#signUps = {};

    this.#initSignUps();
  }

  modifySessionDetails(groupId: string, date: number, startTime: string, endTime: string, numCourts: number) {
    this.#groupId = groupId;
    this.#date = date;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#numCourts = numCourts;
  }

  async #initSignUps(): Promise<void> {
    const members: WhatsappService.Member[] = await WhatsappService.getMembersFromGroupChat(this.#groupId);

    for (const index in members) {
      const member = members[index];

      if (member.id !== WhatsappService.getSelfId()) {
        const person = new Person(member.id, member.number, member.displayName, false);

        this.#signUps[person.getId()] = new SignUpEntry(person);
      }
    }
  }

  getDate(): number {
    return this.#date;
  }

  addPerson(person: Person): void {
    this.#signUps[person.getId()] = new SignUpEntry(person);
  }

  removePerson(personId: string): void {
    delete this.#signUps[personId];
  }

  isGuestMember(personId: string): boolean {
    return this.#signUps[personId].isGuestMember();
  }

  hasSignedUp(personId: string): boolean {
    return this.#signUps[personId].hasSignedUp();
  }

  isSignedIn(personId: string): boolean | undefined {
    return this.#signUps[personId].isSignedIn();
  }

  getSignUpTimeStamp(personId: string): number | undefined {
    return this.#signUps[personId].getSignUpTimeStamp();
  }

  setSignUp(personId: string, isSignedIn: boolean, signUpTimeStamp: number): void {
    // delete guest member if they are not signed up
    if (this.#signUps[personId].isGuestMember() && !isSignedIn) {
      this.removePerson(personId);
    } else {
      this.#signUps[personId].setSignUp(isSignedIn, signUpTimeStamp);
    }
  }

  setPaid(personId: string, hasPaid: boolean, paidTimeStamp: number): void {
    this.#signUps[personId].setPaid(hasPaid, paidTimeStamp)
  }

  removePaid(personId: string): void {
    this.#signUps[personId].removePaid();
  }

  hasPaid(personId: string): boolean | undefined {
    return this.#signUps[personId].hasPaid();
  }

  getPaidTimeStamp(personId: string): number | undefined {
    return this.#signUps[personId].getPaidTimeStamp();
  }

  #getSignedInList(): SignUpEntry[] {
    const inList = [];

    for (const personId in this.#signUps) {
      const person = this.#signUps[personId];

      if (person.hasSignedUp() && person.isSignedIn()) {
        inList.push(person);
      }
    }
    inList.sort(compareTimeStampsForSignUp);

    return inList;
  }

  getSignedInListString(): string {
    const inList = this.#getSignedInList();
    let stringValue = "\n*Signed In (see you soon!)*\n"
    let number = 1;

    for (const index in inList) {
      const inPerson = inList[index];

      if (number === this.#maxSignIns + 1) {
        stringValue += `*_Everyone below is on WAITLIST_*\n`;
      }
      stringValue += `${number}. ${inPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  #getSignedOutList(): SignUpEntry[] {
    const outList = [];

    for (const personId in this.#signUps) {
      const person = this.#signUps[personId];

      if (person.hasSignedUp() && (!person.isSignedIn())) {
        outList.push(person);
      }
    }
    outList.sort(compareTimeStampsForSignUp);

    return outList;
  }

  getSignedOutListString(): string {
    const outList = this.#getSignedOutList();
    let stringValue = "\n*Signed Out (hope to see you next time)*\n"
    let number = 1;

    for (const index in outList) {
      const outPerson = outList[index];

      stringValue += `${number}. ${outPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  #getUndecidedList(): SignUpEntry[] {
    const undecidedList = [];

    for (const personId in this.#signUps) {
      const person = this.#signUps[personId];

      if (!(person.hasSignedUp())) {
        undecidedList.push(person);
      }
    }

    return undecidedList;
  }

  getUndecidedListString(): string {
    const undecidedList = this.#getUndecidedList();
    let stringValue = `\n*Undecided (type _in_ or _out_ to stop getting tagged)*\n`
    let number = 1;

    for (const index in undecidedList) {
      const undecidedPerson = undecidedList[index];

      stringValue += `${number}. ${undecidedPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  #getPaidList(): SignUpEntry[] {
    const paidList = [];

    for (const personId in this.#signUps) {
      const person = this.#signUps[personId];

      if (person.hasSignedUp() && person.isSignedIn() && person.hasPaid()) {
        paidList.push(person);
      }
    }
    paidList.sort(compareTimeStampsForPaid);

    return paidList;
  }

  getPaidListString(): string {
    const paidList = this.#getPaidList();
    let stringValue = "\n*Paid People*\n"
    let number = 1;

    for (const index in paidList) {
      const paidPerson = paidList[index];

      stringValue += `${number}. ${paidPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  #getUnpaidList(): SignUpEntry[] {
    const unpaidList = [];

    for (const personId in this.#signUps) {
      const person = this.#signUps[personId];

      if (person.hasSignedUp() && person.isSignedIn() && !person.hasPaid()) {
        unpaidList.push(person);
      }
    }

    return unpaidList;
  }

  getUnpaidListString(): string {
    const unpaidList = this.#getUnpaidList();
    let stringValue = "\n*Unpaid People*\n"
    let number = 1;

    for (const index in unpaidList) {
      const unpaidPerson = unpaidList[index];

      stringValue += `${number}. ${unpaidPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  getMentionsList(): {[mentions: string] : string[]} {
    return {
      mentions: Object.keys(this.#signUps)
    };
  }

  toString(): string {
    let stringValue: string = `*Date* -  ${utils.convertTimeStampToDate(this.#date).toDateString()}\n*Time* - ${this.#startTime}-${this.#endTime}PM\n*Courts* - ${this.#numCourts}\n`;
    stringValue += `Maximum number of sign ups allowed: ${this.#maxSignIns}\n`;

    stringValue += this.getSignedInListString();
    stringValue += this.getSignedOutListString();
    stringValue += this.getUndecidedListString();

    return stringValue;
  }
}

export = Session;