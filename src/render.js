
import { state, channels } from './state.js';

//  Avatar helper 
const createAvatar = (username, large = false) => {
  const el = document.createElement('div');
  el.className = `avatar${large ? ' avatar--large' : ''}`;
  el.textContent = username.charAt(0).toUpperCase();
  el.setAttribute('aria-hidden', 'true');
  return el;
};

// Loading screen 
export const renderLoadingScreen = () => {
  const section = document.createElement('section');
  section.className = 'loading-screen';
  const p = document.createElement('p');
  p.textContent = 'Loading ChatChannels…';
  section.appendChild(p);
  return section;
};

// Login screen 
export const renderLoginScreen = () => {
  const section = document.createElement('section');
  section.className = 'login-screen';

  const card = document.createElement('div');
  card.className = 'login-card';

  const h1 = document.createElement('h1');
  h1.textContent = 'ChannelChat';

  const desc = document.createElement('p');
  desc.textContent = 'Enter a username to join the chat';

  const label = document.createElement('label');
  label.setAttribute('for', 'username-input');
  label.textContent = 'Username';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'username-input';
  input.placeholder = 'e.g. fluffycat';
  input.maxLength = 20;
  input.autocomplete = 'off';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'login-btn';
  btn.className = 'btn-primary';
  btn.textContent = 'Join Chat';

  card.append(h1, desc, label, input, btn);
  section.appendChild(card);
  return section;
};

export const showLoginSpinner = () => {
  const card = document.querySelector('.login-card');
  if (!card || document.getElementById('login-spinner')) { return; }
  const wrap = document.createElement('div');
  wrap.className = 'login-spinner-wrap';
  const spinner = document.createElement('div');
  spinner.className = 'spinner spinner--small';
  spinner.id = 'login-spinner';
  wrap.appendChild(spinner);
  card.appendChild(wrap);
};

export const hideLoginSpinner = () => {
  const wrap = document.querySelector('.login-spinner-wrap');
  if (wrap) { wrap.remove(); }
};

// App shell 
export const renderApp = () => {
  const app = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.className = 'visually-hidden';
  h1.textContent = 'ChatChannels';
  app.className = 'app';
  app.append(renderSidebar(), renderChatArea());
  return app;
};

const renderSidebar = () => {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';

  const logo = document.createElement('div');
  logo.className = 'sidebar__logo';
  logo.textContent = 'ChatChannels';

  const channelSection = document.createElement('nav');
  const channelTitle = document.createElement('h2');
  channelTitle.className = 'sidebar__section-title';
  channelTitle.textContent = 'Channels';
  const channelUl = document.createElement('ul');
  channelUl.className = 'channel-list';
  channelUl.id = 'channel-list';
  channelSection.append(channelTitle, channelUl);

  const userSection = document.createElement('section');
  const userTitle = document.createElement('h2');
  userTitle.className = 'sidebar__section-title';
  userTitle.textContent = 'Online';
  const userUl = document.createElement('ul');
  userUl.className = 'user-list';
  userUl.id = 'user-list';
  userSection.append(userTitle, userUl);

  const logoutWrap = document.createElement('div');
  logoutWrap.className = 'sidebar__logout';
  const logoutBtn = document.createElement('button');
  logoutBtn.type = 'button';
  logoutBtn.id = 'logout-btn';
  logoutBtn.className = 'btn-logout';
  logoutBtn.textContent = 'Sign Out';
  logoutWrap.appendChild(logoutBtn);

  aside.append(logo, channelSection, userSection, logoutWrap);
  return aside;
};

const renderChatArea = () => {
  const main = document.createElement('main');
  main.className = 'chat-area';

  const header = document.createElement('header');
  header.className = 'chat-header';
  header.id = 'chat-header';
  header.textContent = `# ${state.currentChannel}`;

  const messages = document.createElement('section');
  messages.className = 'messages-container';
  messages.id = 'messages-container';
  messages.setAttribute('aria-live', 'polite');
  messages.setAttribute('aria-label', 'Messages');

  const form = document.createElement('div');
  form.className = 'message-form';
  form.id = 'message-form';

  const label = document.createElement('label');
  label.setAttribute('for', 'message-input');
  label.className = 'visually-hidden';
  label.textContent = `Message #${state.currentChannel}`;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'message-input';
  input.className = 'message-input';
  input.placeholder = `Message #${state.currentChannel}`;
  input.autocomplete = 'off';

  const sendBtn = document.createElement('button');
  sendBtn.type = 'button';
  sendBtn.id = 'send-btn';
  sendBtn.className = 'btn-send';
  sendBtn.setAttribute('aria-label', 'Send message');
  sendBtn.textContent = '➤';

  form.append(label, input, sendBtn);
  main.append(header, messages, form);
  return main;
};

// Channel list
export const renderChannelList = () => {
  const ul = document.getElementById('channel-list');
  if (!ul) { return; }
  ul.innerHTML = '';

  for (const ch of channels) {
    const li = document.createElement('li');
    li.className = `channel-item${ch === state.currentChannel ? ' channel-item--active' : ''}`;
    li.dataset.channel = ch;

    const hash = document.createElement('span');
    hash.className = 'channel-item__hash';
    hash.textContent = '#';

    const name = document.createElement('span');
    name.textContent = ch;

    li.append(hash, name);

    const count = state.unreadCounts[ch];
    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'unread-badge';
      badge.textContent = count;
      li.appendChild(badge);
    }

    ul.appendChild(li);
  }
};

// User list 
export const renderUserList = () => {
  const ul = document.getElementById('user-list');
  if (!ul) { return; }
  ul.innerHTML = '';

  for (const username of state.users) {
    const li = document.createElement('li');
    li.className = 'user-item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'user-item__name';
    nameSpan.textContent = username;

    const dot = document.createElement('span');
    dot.className = 'online-dot';
    dot.setAttribute('aria-label', 'Online');

    li.append(createAvatar(username), nameSpan, dot);
    ul.appendChild(li);
  }
};

// Single message
export const renderMessage = (msg) => {
  const isOwn = msg.username === state.currentUser;
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const row = document.createElement('article');
  row.className = `message-row${isOwn ? ' message-row--own' : ''}`;
  row.dataset.id = msg.id;

  const wrap = document.createElement('div');
  wrap.className = 'msg-bubble-wrap';

  if (!isOwn) {
    const nameEl = document.createElement('span');
    nameEl.className = 'msg-name';
    nameEl.textContent = msg.username;
    wrap.appendChild(nameEl);
  }

  const bubble = document.createElement('p');
  bubble.className = 'msg-bubble';
  bubble.textContent = escapeHtml(msg.text);

  const timeEl = document.createElement('time');
  timeEl.className = 'msg-time';
  timeEl.dateTime = msg.timestamp;
  timeEl.textContent = time;

  wrap.append(bubble, timeEl);
  row.append(createAvatar(msg.username, true), wrap);
  return row;
};

// Append new messages 
export const appendMessages = (msgs, shouldScroll) => {
  const container = document.getElementById('messages-container');
  if (!container) { return; }
  for (const msg of msgs) {
    container.appendChild(renderMessage(msg));
  }
  if (shouldScroll) {
    container.scrollTop = container.scrollHeight;
  }
};

// Skeleton loader 
export const renderSkeleton = () => {
  const container = document.getElementById('messages-container');
  if (!container) { return; }
  container.innerHTML = '';

  const widths = ['long', 'short', 'medium'];
  for (const width of widths) {
    const row = document.createElement('div');
    row.className = 'skeleton-msg';

    const avatar = document.createElement('div');
    avatar.className = 'skeleton-avatar';

    const lines = document.createElement('div');
    lines.className = 'skeleton-lines';

    const line1 = document.createElement('div');
    line1.className = `skeleton-line skeleton-line--${width}`;
    const line2 = document.createElement('div');
    line2.className = 'skeleton-line skeleton-line--short';

    lines.append(line1, line2);
    row.append(avatar, lines);
    container.appendChild(row);
  }
};

// Mount helper 
export const mountScreen = (el) => {
  const root = document.getElementById('root');
  root.innerHTML = '';
  root.appendChild(el);
};

// Toast 
export const showToast = (msg, isError = false) => {
  const toastEl = document.createElement('div');
  toastEl.className = `toast${isError ? ' toast--error' : ''}`;
  toastEl.textContent = msg;
  document.getElementById('toast-container').appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 3000);
};

//  Chat header & input placeholder update 
export const updateChatHeader = (channel) => {
  const header = document.getElementById('chat-header');
  const input = document.getElementById('message-input');
  const label = document.querySelector('.message-form label');
  if (header) { header.textContent = `# ${channel}`; }
  if (input)  { input.placeholder = `Message #${channel}`; }
  if (label)  { label.textContent = `Message #${channel}`; }
};

// isAtBottom helper 
export const isAtBottom = () => {
  const container = document.getElementById('messages-container');
  if (!container) { return true; }
  return container.scrollHeight - container.scrollTop - container.clientHeight < 60;
};