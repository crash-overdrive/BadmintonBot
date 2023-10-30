import WhatsappClient = require('whatsapp-web.js');
import utils = require('./utils');

let client: WhatsappClient.Client;

const getContactIdFromParticipant = (participant: WhatsappClient.GroupParticipant): string => {
  return participant.id._serialized;
}

const getGroupChatByChatId = async (chatId: string): Promise<WhatsappClient.GroupChat> => {
  return await getClient().getChatById(chatId) as WhatsappClient.GroupChat;
}

const getParticipantsFromGroupChat = async (chatId: string): Promise<WhatsappClient.GroupParticipant[]> => {
  const groupChat: WhatsappClient.GroupChat = await getGroupChatByChatId(chatId);

  return groupChat.participants;
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

export const getMembersFromGroupChat = async (groupId: string): Promise<Member[]> => {
  let members: Member[] = []
  const groupChatMembers: WhatsappClient.GroupParticipant[] = await getParticipantsFromGroupChat(groupId);

  for (const index in groupChatMembers) {
    const participant = groupChatMembers[index]
    const contactId = getContactIdFromParticipant(participant);
    const member = await getMemberByContactId(contactId);

    members.push(member)
  }
  return members;
}

export const getChatIdFromMessage = (message: WhatsappClient.Message): string => {
  return message.from;
}

export const getBodyFromMessage = (message: WhatsappClient.Message): string => {
  return message.body.trim().toLowerCase();
}

export const getMentionIdsFromMessage = (message: WhatsappClient.Message): string[] => {
  return message.mentionedIds;
}

export const getAuthorFromMessage = (message: WhatsappClient.Message): string => {
  return message.author as string;
}

export const getTimeStampFromMessage = (message: WhatsappClient.Message): number => {
  return message.timestamp;
}

export const getChatIdFromGroupNotification = (notification: WhatsappClient.GroupNotification): string => {
  return notification.chatId;
}

export const getAffectedMembersContactIdFromGroupNotification = (notification: WhatsappClient.GroupNotification): string => {
  const affectedMemberId = (notification.id as any).participant;

  return affectedMemberId;
}

export const getMemberFromGroupNotification = async (notification: WhatsappClient.GroupNotification): Promise<Member> => {
  const contactId = getAffectedMembersContactIdFromGroupNotification(notification);
  const member = await getMemberByContactId(contactId);

  return member;
}

export const getSelfId = () : string => {
  return getClient().info.wid._serialized;
}