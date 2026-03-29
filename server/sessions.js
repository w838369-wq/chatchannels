'use strict';

const crypto = require('crypto');

const sessions = {};  // { sid: { username } }

const createSession = (username) => {
  const sid = crypto.randomBytes(18).toString('hex');
  sessions[sid] = { username };
  return sid;
};

const getSession = (sid) => sessions[sid] || null;

const deleteSession = (sid) => {
  delete sessions[sid];
};

const getOnlineUsers = () => {
  const seen = new Set();
  for (const session of Object.values(sessions)) {
    seen.add(session.username);
  }
  return [...seen];
};

module.exports = { createSession, getSession, deleteSession, getOnlineUsers };