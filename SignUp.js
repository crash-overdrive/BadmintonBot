class SignUpList {
  constructor() {
    this.signUpList = [];
    this.paidList = [];
    this.date = NaN;
    this.startTime = NaN;
    this.endTime = NaN;
  }

  setDateAndTime (messageBody) {
    // console.log(`${messageBody.split(" ")[1]} ${messageBody.split(" ")[2]} ${messageBody.split(" ")[3]}`);
    this.date = new Date(`${messageBody.split(" ")[1]} ${messageBody.split(" ")[2]} ${messageBody.split(" ")[3]}`).toDateString('en-CA', {
      timeZone: 'America/Toronto',
    });
    this.startTime = messageBody.split(" ")[4];
    this.endTime = messageBody.split(" ")[5];
  }

  async newList(message) {
    this.signUpList = [];
    this.paidList = [];
    this.setDateAndTime(message.body);

    await message.reply(`Sign up opened for ${this.date} from ${this.startTime}-${this.endTime} PM`);

  }

  async createEntry(message) {
    const sender = await message.getContact();
    const timestamp = message.timestamp;

    if (!this.signUpList.some(e => e.sender.id.user === sender.id.user)) {
      this.signUpList.push({sender, timestamp});
      await message.react("✅");
    } else {
      await message.react("❌");
    }
    // console.log(signUpList);
  }

  async createPaidEntry(message) {
    const sender = await message.getContact();
    const timestamp = message.timestamp;

    if (!this.paidList.some(e => e.sender.id.user === sender.id.user)) {
      this.paidList.push({sender, timestamp});
      await message.react("✅");
    } else {
      await message.react("❌");
    }
  }

  async deleteEntry(message) {
    const sender = await message.getContact();

    if (this.signUpList.some(e => e.sender.id.user === sender.id.user)) {
      await message.react("✅");
      this.signUpList = this.signUpList.filter(e => e.sender.id.user !== sender.id.user);
      this.paidList = this.paidList.filter(e => e.sender.id.user !== sender.id.user);
    } else {
      await message.react("❌");
    }
  }

  async deletePaidEntry(message) {
    const sender = await message.getContact();

    if (this.paidList.some(e => e.sender.id.user === sender.id.user)) {
      await message.react("✅");
      this.paidList = this.paidList.filter(e => e.sender.id.user !== sender.id.user);
    } else {
      await message.react("❌");
    }
  }

  async showEntries(message) {
    let returnMessage = `Sign ups for ${this.date} from ${this.startTime}-${this.endTime} PM are\n`;
    let index = 1;
    let mentions = [];

    this.signUpList.forEach(element => {
      returnMessage += `${index}. @${element.sender.id.user} signed up at ${new Date(element.timestamp*1000).toLocaleString('en-CA', {
        timeZone: 'America/Toronto',
      })}\n`;
      mentions.push(element.sender.id._serialized);
      index += 1;
    });
    // console.log(returnMessage);
    // console.log(mentions);
    await message.reply(returnMessage, message.from, {mentions});
  }

  async showUnpaidEntries(message) {
    let returnMessage = `Unpaid List for ${this.date} from ${this.startTime}-${this.endTime} PM are\n`;
    let index = 1;
    let mentions = [];

    this.signUpList.forEach(element => {
      if (!(this.paidList.some(e => e.sender.id.user === element.sender.id.user))) {
        returnMessage += `${index}. @${element.sender.id.user}\n`;
        mentions.push(element.sender.id._serialized);
        index += 1;
      }
    });
    returnMessage += `Please e-transfer ${message.body.split(" ")[2]}$ to pratapshashwat@wealthsimple.me. If you have already done so, please type "paid" in chat. Thanks!`
    // console.log(returnMessage);
    // console.log(mentions);
    if (index === 1) {
      await message.reply(`Thank you everyone for paying! Hope you all had fun :)`)
    } else {
      await message.reply(returnMessage, message.from, {mentions});
    }
  }

  async showTime(message) {
    await message.reply(`Playtime for ${this.date} is from ${this.startTime}-${this.endTime} PM`);
  }

}

module.exports =  SignUpList;
