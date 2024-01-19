
import { Person } from "./person";
import { SignUpEntry } from "./sign-up-entry";
import { Member, getSelfId, getMembersFromGroupChat, getChatNameFromChatId, sendMessage } from "./wws-service";
import { convertTimeStampToDate } from "./utils";

function compareTimeStampsForSignUp(signUpEntryA: SignUpEntry, signUpEntryB: SignUpEntry): number {
  return (signUpEntryA.getSignUpTimeStamp()! - signUpEntryB.getSignUpTimeStamp()!);
}

function compareTimeStampsForPaid(signUpEntryA: SignUpEntry, signUpEntryB: SignUpEntry): number {
  return (signUpEntryA.getPaidTimeStamp()! - signUpEntryB.getPaidTimeStamp()!);
}

export class Session {
  #groupId: string;
  #date: number;
  #startTime: string;
  #endTime: string;
  #numCourts: number;
  #maxSignIns: number;
  #signUps: {[personId: string]: SignUpEntry};
  #subscribedGroups: string[];

  constructor(groupId: string, date: number, startTime: string, endTime: string, numCourts: number) {
    this.#groupId = groupId;
    this.#date = date;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#numCourts = numCourts;
    this.#maxSignIns = (this.#numCourts) * 6;
    this.#signUps = {};
    this.#subscribedGroups = [
      "120363045631714319@g.us", // General Chat
      "120363173483109408@g.us", // Kings Court
      "120363200803611334@g.us", // Sign Up - Monday
      "120363170998460965@g.us", // Sign Up - Wednesday
      "120363186715359663@g.us", // Sign Up - Friday
      "120363173973697808@g.us", // Kings Court

      // '120363151328519970@g.us', // Badminton Sign Up test
      // '120363202510083519@g.us', // Test Community
      // '120363185433062869@g.us' // Test Community
    ];

    this.#initSignUps().then(
      () => {},
      () => {}
    );
  }

  async #initSignUps(): Promise<void> {
    const members: Member[] = await getMembersFromGroupChat(this.#groupId);

    for (const member of members) {
      if (member.id !== getSelfId()) {
        const person = new Person(member.id, member.number, member.displayName, false);

        this.#addSignUpEntry(person);
      }
    }

    await this.#notifySignUpOpenInGroups();
  }

  #addSignUpEntry(person: Person) {
    this.#signUps[person.getId()] = new SignUpEntry(person);
  }

  async #notifySignUpOpenInGroups(): Promise<void> {
    for (const groupId of this.#subscribedGroups) {
      await this.#sendSignUpOpenMessageInGroup(groupId);
    }
  }

  async #sendSignUpOpenMessageInGroup(groupId: string): Promise<void> {
    // check for display name
    const chatName = await getChatNameFromChatId(this.#groupId);
    let signUpOpenMessage = `Hi Everyone\n\n`;
    signUpOpenMessage += `Sign ups are now open in the group @${this.#groupId}\n\n`;
    signUpOpenMessage += `Please make sure to type *"in"* or *"out"* in the group to indicate your availability\n\n`;
    signUpOpenMessage += `Session details are as follows\n\n`;
    signUpOpenMessage += this.getSessionDetails();

    await sendMessage(groupId, signUpOpenMessage, {
      groupMentions: [{ subject: chatName, id: this.#groupId }]
    });
  }

  modifySessionDetails(groupId: string, date: number, startTime: string, endTime: string, numCourts: number) {
    this.#groupId = groupId;
    this.#date = date;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#numCourts = numCourts;
  }

  getDate(): number {
    return this.#date;
  }

  addPerson(person: Person): void {
    this.#addSignUpEntry(person);
  }

  removePerson(personId: string): void {
    delete this.#signUps[personId];
  }

  isGuestMember(personId: string): boolean {
    return this.#signUps[personId].isGuestMember();
  }

  getNumber(personId: string): string {
    return this.#signUps[personId].getNumber();
  }

  async getDisplayName(personId: string): Promise<string | undefined> {
    return this.#signUps[personId].getDisplayName();
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

  async getSignedInListString(): Promise<string> {
    const inList = this.#getSignedInList();
    let stringValue = "\n*Signed In (see you soon!)*\n"
    let number = 1;

    for (const inPerson of inList) {
      if (number === this.#maxSignIns + 1) {
        stringValue += `*_Everyone below is on WAITLIST_*\n`;
      }
      stringValue += `${number}. ${await inPerson.toString()}\n`;
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

  async getSignedOutListString(): Promise<string> {
    const outList = this.#getSignedOutList();
    let stringValue = "\n*Signed Out (hope to see you next time)*\n"
    let number = 1;

    for (const outPerson of outList) {
      stringValue += `${number}. ${await outPerson.toString()}\n`;
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

  async getUndecidedListString(): Promise<string> {
    const undecidedList = this.#getUndecidedList();
    let stringValue = `\n*Undecided*\n`
    let number = 1;

    for (const undecidedPerson of undecidedList) {
      stringValue += `${number}. ${await undecidedPerson.toString()}\n`;
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

  async getPaidListString(): Promise<string> {
    const paidList = this.#getPaidList();
    let stringValue = "\n*Paid People*\n"
    let number = 1;

    for (const paidPerson of paidList) {
      stringValue += `${number}. ${await paidPerson.toString()}\n`;
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

  async getUnpaidListString(): Promise<string> {
    const unpaidList = this.#getUnpaidList();
    let stringValue = "\n*Unpaid People*\n"
    let number = 1;

    for (const unpaidPerson of unpaidList) {
      stringValue += `${number}. ${await unpaidPerson.toString()}\n`;
      number += 1;
    }

    return stringValue;
  }

  getMentionsList(): {[mentions: string] : string[]} {
    return {
      mentions: Object.keys(this.#signUps)
    };
  }

  getSessionDetails(): string {
    let sessionDetails: string = `*Date* -  ${convertTimeStampToDate(this.#date).toDateString()}\n*Time* - ${this.#startTime}-${this.#endTime}PM\n*Courts* - ${this.#numCourts}\n\n`;
    sessionDetails += `Maximum number of sign ups allowed: ${this.#maxSignIns}\n\n`;
    sessionDetails += `Sign up closes 6 hours before session starts.`;
    sessionDetails += `If sign ups are closed and you still want to come to the session then please contact host directly.\n\n`
    sessionDetails += `If you are signed up and can't make it to the session then please sign out 12 hours in advance. If there is less than 12 hours left before session starts then please find a replacement for yourself or pay the session fee.\n\n`

    return sessionDetails;
  }

  async toString(): Promise<string> {
    let stringValue: string = this.getSessionDetails();

    stringValue += await this.getSignedInListString();
    stringValue += await this.getSignedOutListString();
    stringValue += await this.getUndecidedListString();

    return stringValue;
  }
}

// const job = new CronJob(
//   '* * * * * *', // cronTime
//   function () {
//     console.log('You will see this message every second');
//   }, // onTick
//   null, // onComplete
//   true, // start
//   'America/Toronto' // timeZone
// );