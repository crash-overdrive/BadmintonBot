// function addToList(list, person) {
//   if (!list.some(e => e.isEqual(person))) {
//     list.push(person);
//   } else {
//     console.error(`${person} already exists in ${list}`)
//   }
// }

// function removeFromList(list, person) {
//   list = list.filter(e => !(e.isEqual(person)));
// }

class Session {
  date = null;
  startTime = null;
  endTime = null;
  numCourts = null;

  constructor(date, startTime, endTime, numCourts) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.numCourts = numCourts;
  }


  toString() {
    return `Session: ${this.date} ${this.startTime}-${this.endTime} courts: ${this.numCourts}`
  }
}

module.exports = Session;