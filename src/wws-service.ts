import { Client, GroupChat, GroupParticipant, Contact, Message, MessageContent, MessageSendOptions, GroupNotification, LocalAuth } from 'whatsapp-web.js';
import { isUndefined } from './utils';
// import Bottleneck from "bottleneck";

let client: Client;
// const rateLimiter = new Bottleneck({
//   maxConcurrent: 1,
//   minTime: 2000
// });

const getContactIdFromParticipant = (participant: GroupParticipant): string => {
  return participant.id._serialized;
}

const getGroupChatByChatId = async (chatId: string): Promise<GroupChat> => {
  return await getClient().getChatById(chatId) as GroupChat;
}

const getParticipantsFromGroupChat = async (chatId: string): Promise<GroupParticipant[]> => {
  const groupChat: GroupChat = await getGroupChatByChatId(chatId);

  return groupChat.participants;
}

const getContactByContactId = async (contactId: string): Promise<Contact> => {
  return await client.getContactById(contactId);
}

const getDisplayNameFromContact = (contact: Contact): string => {
  return contact.pushname;
}

export type Member = {
  id: string,
  number: string,
  displayName: string
}

export const getClient = (): Client =>  {
  if (isUndefined(client)) {
    client = new Client({
      authStrategy: new LocalAuth()
    });
  }
  return client;
}

export const getDisplayNameByContactId = async (contactId: string): Promise<string> => {
  const contact = await getContactByContactId(contactId);

  return getDisplayNameFromContact(contact);
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
  const members: Member[] = []
  const groupChatMembers: GroupParticipant[] = await getParticipantsFromGroupChat(groupId);

  for (const participant of groupChatMembers) {
    const contactId = getContactIdFromParticipant(participant);
    const member = await getMemberByContactId(contactId);

    members.push(member)
  }
  return members;
}

export const getChatIdFromMessage = (message: Message): string => {
  return message.from;
}

export const getChatNameFromChatId = async (chatId: string): Promise<string> => {
  return (await client.getChatById(chatId)).name;
}

export const getBodyFromMessage = (message: Message): string => {
  return message.body.trim().toLowerCase();
}

export const getMentionIdsFromMessage = (message: Message): string[] => {
  return message.mentionedIds as unknown as string[];
}

export const getAuthorFromMessage = (message: Message): string => {
  return message.author as string;
}

export const getTimeStampFromMessage = (message: Message): number => {
  return message.timestamp;
}

export const getChatIdFromGroupNotification = (notification: GroupNotification): string => {
  return notification.chatId;
}

export const getAffectedMembersContactIdFromGroupNotification = (notification: GroupNotification): string => {
  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
  const affectedMemberId = (notification.id as any).participant as string;

  return affectedMemberId;
}

export const getMemberFromGroupNotification = async (notification: GroupNotification): Promise<Member> => {
  const contactId = getAffectedMembersContactIdFromGroupNotification(notification);
  const member = await getMemberByContactId(contactId);

  return member;
}

export const getSelfId = () : string => {
  return getClient().info.wid._serialized;
}

export const sendMessage = async(chatId: string, content: MessageContent, options?: MessageSendOptions): Promise<Message> => {
  return await getClient().sendMessage(chatId, content, options);
}

// export const sendMessage = rateLimiter.wrap(sendMessageUnthrottled);