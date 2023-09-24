import type { Message } from './types';

class MessageStore {
  saveMessage(message: Message) {}
  findMessagesForUser(userID: string) {}
}

export class InMemoryMessageStore extends MessageStore {
  private messages: Array<Message>;
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message: Message) {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}
