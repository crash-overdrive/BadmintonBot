const Person = require("./person");
const Session = require("./session");
const { getPersonsFromGroup, getPersonByContactId } = require("./wws-service");


function compareTimeStamps(personA, personB) {
  if (personA.getSignUpTimeStamp() > personB.getSignUpTimeStamp()) {
    return 1;
  }
  if (personB.getSignUpTimeStamp() > personA.getSignUpTimeStamp()) {
    return -1;
  }
  return 0;
}

class Group {
  personDictionary = {};
  session = null;
  groupId = null;

  constructor(groupId) {
    this.groupId = groupId;
    this.initPersonDictionary();
  }

  async initPersonDictionary() {
    const persons = await getPersonsFromGroup(this.groupId);

    for (index in persons) {
      const person = persons[index];

      this.personDictionary[person.id] = new Person(person.id, person.number, person.displayName, false);
    }
  }

  // TODO: remove the non-members and guests added each time a new session is created
  addSession(date, startTime, endTime, numCourts) {
    this.session = new Session(date, startTime, endTime, numCourts);

    for (const personId in this.personDictionary) {
      this.personDictionary[personId].removeSignUp();
    }
  }

  addPerson(person) {
    this.personDictionary[person.personId] = person;
  }

  removePerson(personId) {
    delete this.personDictionary[personId];
  }

  addPersonSignUp(personId, isSignedUp, signUpTimeStamp) {
    if (session !== null) {
      // delete guest member if they are not signed up
      if (this.personDictionary[personId].isGuestMember() && !isSignedUp) {
        delete this.personDictionary[personId];
      }
      // for group member do the normal thing
      this.personDictionary[personId].addSignUp(isSignedUp, signUpTimeStamp);
    } else {
      throw Error("Trying to sign up when no session is active");
    }
  }

  addPersonPaid(personId, hasPaid, paidTimeStamp) {
    this.personDictionary[personId].addPaid(hasPaid, paidTimeStamp);
  }

  removePersonPaid(personId) {
    this.personDictionary[personId].removePaid();
  }

  getSignedInList() {
    const inList = [];

    for (const personId in this.personDictionary) {
      const person = this.personDictionary[personId];

      if (person.hasSignedUp() && person.isSignedIn()) {
        inList.push(person);
      }
    }
    inList.sort(compareTimeStamps(personA, personB));

    return inList;
  }

  getSignedOutList() {
    const outList = [];

    for (const personId in this.personDictionary) {
      const person = this.personDictionary[personId];

      if (person.hasSignedUp() && (!person.isSignedIn())) {
        outList.push(person);
      }
    }
    outList.sort(compareTimeStamps(personA, personB));

    return outList;
  }

  getUndecidedList() {
    const undecidedList = [];

    for (const personId in this.personDictionary) {
      const person = this.personDictionary[personId];

      if (!(person.hasSignedUp())) {
        undecidedList.push(person);
      }
    }

    return undecidedList;
  }

  getMentionsList() {
    return {
      mentions: Object.keys(this.personDictionary)
    };
  }

  toString() {
    undecidedList = this.getUndecidedList();
    inList = this.getSignedInList();
    outList = this.getSignedOutList();





  }

}

module.exports = Group;