
import { Person } from "./person";
import { SignUpEntry } from "./sign-up-entry";
import { Member, sendMessage, getSelfId, getMembersFromGroupChat, getChatNameFromChatId } from "./wws-service";
import { convertTimeStampToDate, isUndefined } from "./utils";

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

  constructor(groupId: string, date: number, startTime: string, endTime: string, numCourts: number) {
    this.#groupId = groupId;
    this.#date = date;
    this.#startTime = startTime;
    this.#endTime = endTime;
    this.#numCourts = numCourts;
    this.#maxSignIns = (this.#numCourts) * 6;
    this.#signUps = {};

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

        await this.#addSignUpEntry(person);
      }
    }
  }

  async #addSignUpEntry(person: Person) {
    this.#signUps[person.getId()] = new SignUpEntry(person);
    await this.#notifySignUpOpen(person);
  }

  async #notifySignUpOpen(person: Person): Promise<void> {
    if (!person.isGuestMember()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      sendMessage(person.getId(), await this.#getSignUpOpenMessage(person));
    }
  }

  async notifyUndecidedMembers(): Promise<void> {
    // get unsigned member check for guest and send them message, check for display name as well
    const undecidedList = this.#getUndecidedList();

    for (const undecidedMember of undecidedList) {
      if (!undecidedMember.isGuestMember()) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        sendMessage(undecidedMember.getPersonId(), await this.#getUndecidedMessage(undecidedMember.getPerson()));
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
  }

  async #getSignUpOpenMessage(member: Person): Promise<string> {
    // check for display name
    const displayName = await member.getDisplayName();
    const chatName = await getChatNameFromChatId(this.#groupId);
    let signUpOpenMessage = `Hi ${displayName || member.getNumber()}\n\n`;
    signUpOpenMessage += `Sign ups are now open in the group *${chatName}*\n\n`;
    signUpOpenMessage += `Please make sure to type *"in"* or *"out"* in the group to indicate your availability\n\n`;
    signUpOpenMessage += `Session details are as follows\n\n`;
    signUpOpenMessage += this.#getSessionDetails();

    if (isUndefined(displayName)) {
      signUpOpenMessage += `*IMPORTANT*: I can't get your name from your profile, please type something in our personal chat or in the group to let me get your name from the profile`;
    }

    return signUpOpenMessage;
  }

  async #getUndecidedMessage(member: Person): Promise<string> {
    const displayName = await member.getDisplayName();
    const chatName = await getChatNameFromChatId(this.#groupId);
    let undecidedMessage = `Hi ${displayName || member.getNumber()}\n\n`;
    undecidedMessage += `You are getting this message because Sign Ups are open in the group *${chatName}* and you haven't indicated your availability\n\n`;
    undecidedMessage += `Please make sure to type *"in"* or *"out"* in the group to stop getting this message\n\n`;
    undecidedMessage += `Session details are as follows\n\n`;
    undecidedMessage += this.#getSessionDetails();

    if (isUndefined(displayName)) {
      undecidedMessage += `*IMPORTANT*: I can't get your name from your profile, please type something in our personal chat or in the group to let me get your name from the profile`;
    }

    return undecidedMessage;
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

  async addPerson(person: Person): Promise<void> {
    await this.#addSignUpEntry(person);
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

  #getSessionDetails(): string {
    let sessionDetails: string = `*Date* -  ${convertTimeStampToDate(this.#date).toDateString()}\n*Time* - ${this.#startTime}-${this.#endTime}PM\n*Courts* - ${this.#numCourts}\n`;
    sessionDetails += `Maximum number of sign ups allowed: ${this.#maxSignIns}\n`;

    return sessionDetails;
  }

  async toString(): Promise<string> {
    let stringValue: string = this.#getSessionDetails();

    stringValue += await this.getSignedInListString();
    stringValue += await this.getSignedOutListString();
    stringValue += await this.getUndecidedListString();

    return stringValue;
  }
}