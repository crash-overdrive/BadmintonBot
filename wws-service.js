const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth()
});


const getGroupChatByGroupId = async (groupId) => {
  return await client.getChatById(groupId);
}

const getParticipantsFromGroupChat = async (groupId) => {
  const groupChat = await getGroupChatByGroupId(groupId);

  return groupChat.groupMetadata.participants;
}

const getContactIdFromParticipant = participant => {
  return participant.id._serialized;
}

const getContactByContactId = async (contactId) => {
  return await client.getContactById(contactId);
}

const getPersonByContactId = async (contactId) => {
  const contact = await getContactByContactId(contactId);

  return {
    id: contact.id._serialized,
    number: contact.number,
    displayName: contact.pushname,
  };
}

const getPersonsFromGroup = async (groupId) => {
  participants = []
  const groupChatParticipants = await getParticipantsFromGroupChat(groupId);

  for (const index in groupChatParticipants) {
    const participant = groupChatParticipants[index]
    const contactId = getContactIdFromParticipant(participant);
    const person = getPersonByContactId(contactId);

    participants.push(person)
  }
  return participants;
}

module.exports = { getPersonByContactId, getPersonsFromGroup }