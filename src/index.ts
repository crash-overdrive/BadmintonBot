import { getClient } from "./wws-service";
import { handleGroupJoin, handleGroupLeave, handleMessage } from "./interactions";
import qrcode = require('qrcode-terminal');

const client = getClient();

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
  console.log('Client is ready!');
});

// message sent to any chat
client.on('message', async message => {
  handleMessage(message);
})

// User has joined or been added to the group.
client.on('group_join', (notification) => {
  handleGroupJoin(notification);
});

// User has left or been kicked from the group.
client.on('group_leave', (notification) => {
  handleGroupLeave(notification);
});

client.setDisplayName("Kings Court Bot")

client.initialize();