import type { Session } from './types';

class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, meta: Omit<Session, 'sessionID'>) {}
  findAllSessions() {}
}

export class InMemorySessionStore extends SessionStore {
  private sessions: Map<string, Omit<Session, 'sessionID'>>;
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(
    id: string,
    {
      userID,
      username,
      connected,
    }: { userID: string; username: string; connected: boolean }
  ) {
    return this.sessions.set(id, { userID, username, connected });
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
