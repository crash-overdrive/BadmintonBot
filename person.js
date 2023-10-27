const SignUp = require("./sign-up");

class Person {
  constructor(id, number, displayName, isGuest) {
    this.id = id;
    this.number = number;
    this.displayName = displayName;
    this.signUp = null;
    this.isGuest = isGuest;
  }

  isGuestMember() {
    return this.isGuest;
  }

  hasSignedUp() {
    return this.signUp !== null;
  }

  isSignedIn() {
    if (this.signUp === null) {
      // TODO: error out here, paid without signing up
    }
    return this.signUp.isSignedIn();
  }

  removeSignUp() {
    this.signUp = null;
  }

  addSignUp(isSignedUp, signUpTimeStamp) {
    if (this.signUp !== null && this.signUp.isSignedIn === isSignedUp) {
      throw new Error("duplicate action");
    }
    this.signUp = new SignUp(isSignedUp, signUpTimeStamp);
  }

  addPaid(hasPaid, paidTimeStamp) {
    if (this.signUp === null) {
      // TODO: error out here, paid without signing up
    }
    this.signUp.addPaid(hasPaid, paidTimeStamp)
  }

  removePaid() {
    this.signUp.removePaid();
  }

  isEqual(otherPerson) {
    return this.id === otherPerson.id;
  }

  getSignUpTimeStamp() {
    if (this.signUp === null) {
      // TODO: error out here, paid without signing up
    }
    return this.signUp.getSignUpTimeStamp();
  }

  toString() {
    if (this.displayName === null) {
      return `@${this.number}`;
    }
    return this.displayName;
  }
}

module.exports = Person;