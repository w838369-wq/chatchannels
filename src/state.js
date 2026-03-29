// Model: single source of truth for all client state

export const channels = ['general', 'random', 'help', 'questions'];

export const state = {
  currentUser: null,
  currentChannel: 'general',
  lastMessageIds: { general: 0, random: 0, help: 0, questions: 0 },
  unreadCounts:   { general: 0, random: 0, help: 0, questions: 0 },
  users: [],
};

export const setCurrentUser = (username) => {
  state.currentUser = username;
};

export const setCurrentChannel = (channel) => {
  state.currentChannel = channel;
};

export const setUsers = (users) => {
  state.users = users;
};

export const updateLastMessageId = (channel, id) => {
  state.lastMessageIds[channel] = id;
};

export const incrementUnread = (channel) => {
  state.unreadCounts[channel] += 1;
};

export const clearUnread = (channel) => {
  state.unreadCounts[channel] = 0;
};

export const resetState = () => {
  state.currentUser = null;
  state.currentChannel = 'general';
  state.users = [];
  for (const ch of channels) {
    state.lastMessageIds[ch] = 0;
    state.unreadCounts[ch] = 0;
  }
};