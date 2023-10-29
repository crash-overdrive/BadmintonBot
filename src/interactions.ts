import WhatsappClient = require('whatsapp-web.js');
import { getAuthorForMessage, getBodyForMessage, getChatIdForMessage, getMentionIdsInMessage, getTimeStampForMessage } from './wws-service';
import { constants } from './constants';
import Groups = require('./groups');

const groups: Groups = new Groups();

const isBotEnrolledInGroup = (groupId: string): boolean => {
  return groups.getGroup(groupId) !== undefined;
}

const handleIfValidEnrollMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const mentionedIds: string[] = getMentionIdsInMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (messageBody.startsWith(constants.COMMANDS.ADMIN.ENROLL) && author === constants.ID.OWNER && mentionedIds.includes(constants.ID.SELF)) {
    groups.addGroup(groupId);
  }
}

const handleIfValidOpenSignUpMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.OPEN_SIGN_UPS) && author === constants.ID.OWNER) {
    const splitMessage = messageBody.split(" ");
    const dateTimeStamp = new Date(`${splitMessage[1]} ${splitMessage[2]} ${splitMessage[3]}`).getTime();
    const startTime = splitMessage[4] ?? "9:30";
    const endTime = splitMessage[5] ?? "11:30";
    const numCourt = Number(splitMessage[6]) ?? 2;

    groups.addSession(groupId, dateTimeStamp, startTime, endTime, numCourt)
  }
}

const handleIfValidInMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const mentionedIds: string[] = getMentionIdsInMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.IN) && author === constants.ID.OWNER) {
    for (const index in mentionedIds) {
      const personId = mentionedIds[index];
      groups.setSignUp(groupId, personId, true, timeStamp);
    }
  }
}

const handleIfValidOutMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const mentionedIds: string[] = getMentionIdsInMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.OUT) && author === constants.ID.OWNER) {
    for (const index in mentionedIds) {
      const personId = mentionedIds[index];
      groups.setSignUp(groupId, personId, false, timeStamp);
    }
  }
}

const handleIfValidPaidMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const mentionedIds: string[] = getMentionIdsInMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.PAID) && author === constants.ID.OWNER) {
    for (const index in mentionedIds) {
      const personId = mentionedIds[index];
      groups.setPaid(groupId, personId, true, timeStamp);
    }
  }
}

const handleIfValidUnpaidMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const mentionedIds: string[] = getMentionIdsInMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.UNPAID) && author === constants.ID.OWNER) {
    for (const index in mentionedIds) {
      const personId = mentionedIds[index];
      groups.setPaid(groupId, personId, false, timeStamp);
    }
  }
}

const handleIfValidInListMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.IN_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidOutListMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.OUT_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidUndecidedListMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.UNDECIDED_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidPaidListMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.PAID_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidUnpaidListMessageByAdmin = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.UNPAID_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

// user level messages
const handleIfValidInMessage = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.IN) {
    // TODO: handle guests
    groups.setSignUp(groupId, author, true, timeStamp);
  }
}

const handleIfValidOutMessage = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.OUT) {
    // TODO: handle guests
    groups.setSignUp(groupId, author, false, timeStamp);
  }
}

const handleIfValidPaidMessage = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.PAID) {
    groups.setPaid(groupId, author, true, timeStamp);
  }
}

const handleIfValidUnpaidMessage = (message: WhatsappClient.Message): void => {
  const messageBody: string = getBodyForMessage(message);
  const author: string = getAuthorForMessage(message);
  const groupId: string = getChatIdForMessage(message);
  const timeStamp: number = getTimeStampForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.UNPAID) {
    groups.setPaid(groupId, author, false, timeStamp);
  }
}

const handleIfValidListMessage = async (message: WhatsappClient.Message): Promise<void> => {
  const messageBody: string = getBodyForMessage(message);
  const groupId: string = getChatIdForMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.LIST) {
    await message.reply(groups.getGroup(groupId).toString(), groupId, groups.getGroup(groupId).getMentionsList());
  }
}

export const handleMessage = async (message: WhatsappClient.Message): Promise<void> => {
  try {
    // admin/owner only message - can be sent to any group to enroll the bot in a group
    handleIfValidEnrollMessageByAdmin(message);

    // all the messages below need to be sent to groups where the bot is enrolled
    // all these messages are sent by admin to help others
    handleIfValidInMessageByAdmin(message);
    handleIfValidOutMessageByAdmin(message);
    handleIfValidPaidMessageByAdmin(message);
    handleIfValidUnpaidMessageByAdmin(message);

    // admin only messages
    handleIfValidOpenSignUpMessageByAdmin(message);
    handleIfValidInListMessageByAdmin(message);
    handleIfValidOutListMessageByAdmin(message);
    handleIfValidUndecidedListMessageByAdmin(message);
    handleIfValidPaidListMessageByAdmin(message);
    handleIfValidUnpaidListMessageByAdmin(message);
    // user wide level messages
    handleIfValidInMessage(message);
    handleIfValidOutMessage(message);
    handleIfValidPaidMessage(message);
    handleIfValidUnpaidMessage(message);
    await handleIfValidListMessage(message);

  } catch(error: unknown) {
    console.log(error);
  }
}

export const handleGroupJoin = async (notification: WhatsappClient.GroupNotification): Promise<void> => {
}

export const handleGroupLeave = async (notification: WhatsappClient.GroupNotification): Promise<void> => {
}