// Controller: event listeners + app navigation logic

import {
  state, channels,
  setCurrentUser, setCurrentChannel, setUsers,
  updateLastMessageId, clearUnread, resetState,
} from './state.js';

import {
  postSession, deleteSession, fetchMessages, fetchUsers, postMessage,
} from './services.js';

import {
  mountScreen,
  renderLoadingScreen, renderLoginScreen, renderApp,
  renderChannelList, renderUserList, renderSkeleton,
  appendMessages, updateChatHeader,
  showToast,
} from './render.js';

import { startPolling, stopPolling } from './poll.js';

// Navigation 
export const showLoading = () => {
  mountScreen(renderLoadingScreen());
};

export const showLogin = () => {
  mountScreen(renderLoginScreen());
  attachLoginEvents();
};

export const initApp = (username) => {
  setCurrentUser(username);
  mountScreen(renderApp());
  renderChannelList();
  renderSkeleton();
  attachAppEvents();
  loadInitialData();
};

// Initial data load 
const loadInitialData = () => {
  const ch = state.currentChannel;

  Promise.all([fetchMessages(ch, 0), fetchUsers()])
    .then(([msgRes, userRes]) => {
      const container = document.getElementById('messages-container');
      if (container) { container.innerHTML = ''; }

      if (msgRes.messages.length > 0) {
        const lastId = msgRes.messages[msgRes.messages.length - 1].id;
        updateLastMessageId(ch, lastId);
      }

      setUsers(userRes.users);
      appendMessages(msgRes.messages, true);
      renderUserList();
      startPolling();
    })
    .catch(() => showToast('Failed to load chat data', true));
};

// Channel switch 
const switchChannel = (channel) => {
  setCurrentChannel(channel);
  clearUnread(channel);
  updateChatHeader(channel);
  renderChannelList();
  renderSkeleton();

  fetchMessages(channel, 0)
    .then(({ messages }) => {
      const container = document.getElementById('messages-container');
      if (container) { container.innerHTML = ''; }

      if (messages.length > 0) {
        updateLastMessageId(channel, messages[messages.length - 1].id);
      }

      appendMessages(messages, true);
    })
    .catch(() => showToast('Could not load messages', true));
};

// Send message 
const handleSend = () => {
  const input = document.getElementById('message-input');
  if (!input) { return; }
  const text = input.value.trim();
  if (!text) { return; }
  input.value = '';

  postMessage(state.currentChannel, text)
    .then(({ status, data }) => {
      if (status === 201) {
        updateLastMessageId(state.currentChannel, data.id);
        appendMessages([data], true);
      } else if (status === 401) {
        showToast('Session expired, please log in again', true);
        stopPolling();
        showLogin();
      } else {
        showToast(data.error || 'Failed to send message', true);
      }
    })
    .catch(() => showToast('Network error sending message', true));
};

// Login event listeners 
const attachLoginEvents = () => {
  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('username-input');

  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) { return; }

    loginBtn.disabled = true;

    postSession(username)
      .then(({ status, data }) => {
        if (status === 201) {
          initApp(data.username);
        } else if (status === 403) {
          showToast('Username not allowed', true);
        } else if (status === 400) {
          showToast(data.error || 'Invalid username', true);
        } else {
          showToast('Login failed. Please try again.', true);
        }
      })
      .catch(() => showToast('Network error during login', true))
      .finally(() => {
        loginBtn.disabled = false;
      });
  });

  usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });
};

// App event listeners 
const attachAppEvents = () => {
  const sendBtn = document.getElementById('send-btn');
  const messageInput = document.getElementById('message-input');
  const logoutBtn = document.getElementById('logout-btn');
  const channelList = document.getElementById('channel-list');

  sendBtn.addEventListener('click', handleSend);

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });

  logoutBtn.addEventListener('click', () => {
    stopPolling();
    deleteSession()
      .then(() => {
        resetState();
        showLogin();
      })
      .catch(() => showToast('Logout failed', true));
  });

  channelList.addEventListener('click', (e) => {
    const item = e.target.closest('.channel-item');
    if (!item) { return; }
    const channel = item.dataset.channel;
    if (channel && channel !== state.currentChannel) {
      switchChannel(channel);
    }
  });
};