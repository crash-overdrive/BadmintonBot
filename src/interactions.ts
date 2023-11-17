import { Message, GroupNotification } from 'whatsapp-web.js';
import { Member, getAffectedMembersContactIdFromGroupNotification, getAuthorFromMessage, getBodyFromMessage, getChatIdFromGroupNotification, getChatIdFromMessage, getMemberFromGroupNotification, getMentionIdsFromMessage, getSelfId, getTimeStampFromMessage } from './wws-service';
import { constants } from './constants';
import { Groups } from './groups';
import { Person } from './person';

const groups: Groups = new Groups();

const isBotEnrolledInGroup = (groupId: string): boolean => {
  return groups.getGroup(groupId) !== undefined;
}

const handleIfValidEnrollMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const mentionedIds: string[] = getMentionIdsFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (messageBody.startsWith(constants.COMMANDS.ADMIN.ENROLL) && author === constants.ID.OWNER && mentionedIds.includes(getSelfId())) {
    groups.addGroup(groupId);
  }
}

const handleIfValidOpenSignUpMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.OPEN_SIGN_UPS) && author === constants.ID.OWNER) {
    const splitMessage = messageBody.split(" ");
    const dateTimeStamp = new Date(`${splitMessage[1]} ${splitMessage[2]} ${splitMessage[3]}`).getTime();
    const startTime = splitMessage[4] ?? constants.SESSION_DEFAULTS.START_TIME;
    const endTime = splitMessage[5] ?? constants.SESSION_DEFAULTS.END_TIME;
    const numCourt = isNaN(Number(splitMessage[6])) ? constants.SESSION_DEFAULTS.NUM_COURTS : Number(splitMessage[6]);

    groups.addSession(groupId, dateTimeStamp, startTime, endTime, numCourt)
  }
}

const handleIfValidInMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const mentionedIds: string[] = getMentionIdsFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.IN) && author === constants.ID.OWNER) {
    for (const personId of mentionedIds) {
      groups.setSignUp(groupId, personId, true, timeStamp);
    }
  }
}

const handleIfValidOutMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const mentionedIds: string[] = getMentionIdsFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.OUT) && author === constants.ID.OWNER) {
    for (const personId of mentionedIds) {
      groups.setSignUp(groupId, personId, false, timeStamp);
    }
  }
}

const handleIfValidPaidMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const mentionedIds: string[] = getMentionIdsFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.PAID) && author === constants.ID.OWNER) {
    for (const personId of mentionedIds) {
      groups.setPaid(groupId, personId, true, timeStamp);
    }
  }
}

const handleIfValidUnpaidMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const mentionedIds: string[] = getMentionIdsFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && mentionedIds.length !== 0 && messageBody.startsWith(constants.COMMANDS.ADMIN.UNPAID) && author === constants.ID.OWNER) {
    for (const personId of mentionedIds) {
      groups.setPaid(groupId, personId, false, timeStamp);
    }
  }
}

const handleIfValidInListMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.IN_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidOutListMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.OUT_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidUndecidedListMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.UNDECIDED_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidPaidListMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.PAID_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

const handleIfValidUnpaidListMessageByAdmin = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody.startsWith(constants.COMMANDS.ADMIN.UNPAID_LIST) && author === constants.ID.OWNER) {
    // TODO: fill this out
  }
}

// user level messages
const handleIfValidInMessage = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.IN) {
    // TODO: handle guests
    groups.setSignUp(groupId, author, true, timeStamp);
  }
}

const handleIfValidOutMessage = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.OUT) {
    // TODO: handle guests
    groups.setSignUp(groupId, author, false, timeStamp);
  }
}

const handleIfValidPaidMessage = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.PAID) {
    // TODO: handle guests
    groups.setPaid(groupId, author, true, timeStamp);
  }
}

const handleIfValidUnpaidMessage = (message: Message): void => {
  const messageBody: string = getBodyFromMessage(message);
  const author: string = getAuthorFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);
  const timeStamp: number = getTimeStampFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.UNPAID) {
    // TODO: handle guests
    groups.setPaid(groupId, author, false, timeStamp);
  }
}

const handleIfValidListMessage = async (message: Message): Promise<void> => {
  const messageBody: string = getBodyFromMessage(message);
  const groupId: string = getChatIdFromMessage(message);

  if (isBotEnrolledInGroup(groupId) && messageBody === constants.COMMANDS.USER.LIST) {
    await message.reply(await groups.getGroup(groupId).toString(), groupId, groups.getGroup(groupId).getMentionsList());
  }
}

export const handleMessage = async (message: Message): Promise<void> => {
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

export const handleGroupJoin = async (notification: GroupNotification): Promise<void> => {
  try {
    const groupId: string = getChatIdFromGroupNotification(notification);
    const member: Member = await getMemberFromGroupNotification(notification);

    if (isBotEnrolledInGroup(groupId)) {
      await groups.addPerson(groupId, new Person(member.id, member.number, member.displayName, false));
    }
  } catch(error: unknown) {
    console.log(error);
  }
}

export const handleGroupLeave = (notification: GroupNotification): void => {
  try {
    const groupId: string = getChatIdFromGroupNotification(notification);
    const personId: string = getAffectedMembersContactIdFromGroupNotification(notification);

    if (isBotEnrolledInGroup(groupId)) {
      groups.removePerson(groupId, personId);
    }
  } catch(error: unknown) {
    console.log(error);
  }
}