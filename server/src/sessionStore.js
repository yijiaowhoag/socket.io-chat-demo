class SessionStore {
  findSession(id) {}
  saveSession(id, meta) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, meta) {
    return this.sessions.set(id, meta);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = { InMemorySessionStore };
