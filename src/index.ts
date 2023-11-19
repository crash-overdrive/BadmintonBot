import { getClient } from "./wws-service";
import { handleGroupJoin, handleGroupLeave, handleMessage } from "./interactions";
import { generate } from 'qrcode-terminal';

const client = getClient();

client.on('qr', qr => {
  generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

// message sent to any chat
client.on('message', (message) => {
  handleMessage(message).then(
    () => {},
    () => {}
  );
})

// User has joined or been added to the group.
client.on('group_join', (notification) => {
  handleGroupJoin(notification).then(
    () => {},
    () => {}
  );
});

// User has left or been kicked from the group.
client.on('group_leave', (notification) => {
  handleGroupLeave(notification);
});

client.initialize().then(
  () => {},
  () => {}
);