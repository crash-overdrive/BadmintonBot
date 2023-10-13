const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const SignUpList = require('./SignUp');

const client = new Client({
    authStrategy: new LocalAuth()
});
const signUpList = new SignUpList();

const admin = '16478294770@c.us';
const interestedCommand = "in".toLowerCase();
const notInterestedCommand = "out".toLowerCase();
const listCommand = "list".toLowerCase();
const publishCommand = "!publish".toLowerCase();
const timeCommand = "time".toLowerCase();
const unpaidListCommand = "unpaid list".toLowerCase();
const paidCommand = "paid".toLowerCase();
const unpaidCommand = "unpaid".toLowerCase();

const groupName = "Crash Badminton Club".toLowerCase();
let groupId; // = "120363151328519970@g.us";

const isCorrectChat = message => {
  return (message.from === groupId);
}

const isInterestedMessage = message => {
  const messageBody = message.body;
  return (messageBody.toLowerCase().trim() === interestedCommand);
}

const isNotInterestedMessage = message => {
  const messageBody = message.body;
  return (messageBody.toLowerCase().trim() === notInterestedCommand);
}

const isShowListMessage = message => {
  const messageBody = message.body;
  return (messageBody.trim().toLowerCase() === listCommand);
}

const isShowTimeMessage = message => {
  const messageBody = message.body;
  return (messageBody.trim().toLowerCase() === timeCommand);
}


const isShowUnpaidListMessage = message => {
  return message.body.toLowerCase().includes(unpaidListCommand);
}

const isPaidMessage = message => {
  const messageBody = message.body;
  return (messageBody.trim().toLowerCase() === paidCommand);
}

const isUnpaidMessage = message => {
  const messageBody = message.body;
  return (messageBody.trim().toLowerCase() === unpaidCommand);
}

const isPublishMessage = (message) => {
  return message.body.toLowerCase().includes(publishCommand);
}

const isAuthorAdmin = message => {
  return message.author === admin;
}

const createEntry = async message => {
  signUpList.createEntry(message);
}

const deleteEntry = async message => {
  signUpList.deleteEntry(message);
}


const publishMessage = async (message) => {
  signUpList.newList(message);
}

const addPaidEntry = async message => {
 await signUpList.createPaidEntry(message);
}

const deletePaidEntry = async message => {
  await signUpList.deletePaidEntry(message);
}

const showList = async message => {
  await signUpList.showEntries(message);
}

const showTime = async message => {
  await signUpList.showTime(message);
}

const showUnpaidList = async message => {
  await signUpList.showUnpaidEntries(message);
}

const setGroupId = async () => {
  const chats = await client.getChats();
  groupId = chats.find(chat => chat.name.toLowerCase() === groupName).id._serialized;
  console.log(groupId);
}

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
  await setGroupId();
  console.log('Client is ready!');
});

client.on('message', async message => {
  // console.log(message);
  if (isCorrectChat(message)) {
    // console.log("message received in correct group chat");
    if (isPublishMessage(message) && isAuthorAdmin(message)) {
      await publishMessage(message);
    } else if (isShowListMessage(message)) {
      await showList(message);
    } else if (isShowTimeMessage(message)) {
      await showTime(message);
    } else if (isShowUnpaidListMessage(message) && isAuthorAdmin(message)) {
      await showUnpaidList(message);
    } else if (isPaidMessage(message)) {
      await addPaidEntry(message);
    } else if (isUnpaidMessage(message)) {
      await deletePaidEntry(message);
    } else if (isInterestedMessage(message)) {
      await createEntry(message);
    } else if (isNotInterestedMessage(message)) {
      await deleteEntry(message);
    } else {
      // console.log("message in correct group chat doesnt concern me");
    }
  } else {
    // console.log("message received in non relevant group chat");
  }
});


client.initialize();

