'use strict';

const channels = ['general', 'random', 'help', 'questions'];

const messages = {};
let msgCounter = 0;

for (const ch of channels) {
  messages[ch] = [];
}

const isValidChannel = (channel) => channels.includes(channel);

const getMessages = (channel, afterId) =>
  messages[channel].filter(m => m.id > afterId);

const addMessage = (channel, username, text) => {
  msgCounter += 1;
  const msg = {
    id: msgCounter,
    username,
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };
  messages[channel].push(msg);
  return msg;
};

module.exports = { channels: channels, isValidChannel, getMessages, addMessage };