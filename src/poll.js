// Controller: time-based polling for new messages and user list updates

import { fetchMessages, fetchUsers } from './services.js';
import { appendMessages, renderUserList, renderChannelList, isAtBottom } from './render.js';

let pollTimer = null;

const runPoll = () => {
  const ch = state.currentChannel;
  const atBottom = isAtBottom();

  fetchMessages(ch, state.lastMessageIds[ch])
    .then(({ messages }) => {
      if (messages.length === 0) { return; }
      const lastId = messages[messages.length - 1].id;
      updateLastMessageId(ch, lastId);
      appendMessages(messages, atBottom);
    })
    .catch(() => { /* silent poll failure */ });

  fetchUsers()
    .then(({ users }) => {
      setUsers(users);
      renderUserList();
    })
    .catch(() => { /* silent poll failure */ });
};

export const startPolling = () => {
  stopPolling();
  pollTimer = setInterval(runPoll, 5000);
};

export const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};