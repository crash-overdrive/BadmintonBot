class SignUp {
  constructor(isSignedUp, signUpTimeStamp) {
    this.isSignedUp = isSignedUp;
    this.signUpTimeStamp = signUpTimeStamp;
    this.isPaid = false;
    this.paidTimeStamp = null;
  }

  isSignedIn() {
    return this.isSignedUp;
  }

  getSignUpTimeStamp() {
    return this.signUpTimeStamp;
  }

  addPaid(hasPaid, paidTimeStamp) {
    this.hasPaid = hasPaid;
    this.paidTimeStamp = paidTimeStamp;
  }

  removePaid() {
    this.isPaid = false;
    this.paidTimeStamp = null;
  }

  hasPaid() {
    return this.isPaid;
  }

  getPaidTimeStamp() {
    return this.paidTimeStamp;
  }

  toString() {

  }
}

module.exports = SignUp;