import WhatsappClient = require('whatsapp-web.js');
import utils = require('./utils');

let client: WhatsappClient.Client;

const getGroupChatByChatId = async (chatId: string): Promise<WhatsappClient.GroupChat> => {
  return await getClient().getChatById(chatId) as WhatsappClient.GroupChat;
}

const getMembersFromGroupChat = async (chatId: string): Promise<WhatsappClient.GroupParticipant[]> => {
  const groupChat: WhatsappClient.GroupChat = await getGroupChatByChatId(chatId);

  return groupChat.participants;
}

const getContactIdFromParticipant = (participant: WhatsappClient.GroupParticipant): string => {
  return participant.id._serialized;
}

const getContactByContactId = async (contactId: string): Promise<WhatsappClient.Contact> => {
  return await client.getContactById(contactId);
}

export type Member = {
  id: string,
  number: string,
  displayName: string
}

export const getClient = (): WhatsappClient.Client =>  {
  if (utils.isUndefined(client)) {
    client = new WhatsappClient.Client({
      authStrategy: new WhatsappClient.LocalAuth()
    });
  }
  return client;
}

export const getMemberByContactId = async (contactId: string): Promise<Member> => {
  const contact = await getContactByContactId(contactId);
  const member: Member = {
    id: contact.id._serialized,
    number: contact.number,
    displayName: contact.pushname,
  };

  return member;
}

export const getMemberFromGroupChat = async (groupId: string): Promise<Member[]> => {
  let members: Member[] = []
  const groupChatMembers: WhatsappClient.GroupParticipant[] = await getMembersFromGroupChat(groupId);

  for (const index in groupChatMembers) {
    const participant = groupChatMembers[index]
    const contactId = getContactIdFromParticipant(participant);
    const member = await getMemberByContactId(contactId);

    members.push(member)
  }
  return members;
}

export const getChatIdForMessage = (message: WhatsappClient.Message): string => {
  return message.from;
}

export const getBodyForMessage = (message: WhatsappClient.Message): string => {
  return message.body.trim().toLowerCase();
}

export const getMentionIdsInMessage = (message: WhatsappClient.Message): string[] => {
  return message.mentionedIds;
}

export const getAuthorForMessage = (message: WhatsappClient.Message): string => {
  return message.author as string;
}

export const getTimeStampForMessage = (message: WhatsappClient.Message): number => {
  return message.timestamp;
}

export const getChatIdForGroupNotification = (notification: WhatsappClient.GroupNotification): string => {
  return notification.chatId;
}

export const getAuthorForGroupNotification = (notification: WhatsappClient.GroupNotification): string => {
  return notification.author;
}

export const getMemberFromGroupNotification = async (notification: WhatsappClient.GroupNotification): Promise<Member> => {
  const contactId = (notification.id as any).participant;
  const member = await getMemberByContactId(contactId);

  return member;
}

export const getSelfId = () : string => {
  return getClient().info.wid._serialized;
}