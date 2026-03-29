'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const { createSession, getSession, deleteSession, getOnlineUsers } = require('./sessions');
const { channels: channels, isValidChannel, getMessages, addMessage } = require('./messages');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

const usernamepattern = /^[a-zA-Z0-9_]{1,20}$/;
const banned_user = 'dog';

// Auth middleware 
const requireAuth = (req, res, next) => {
  const session = getSession(req.cookies.sid);
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  req.session = session;
  next();
};

// Session routes 
app.get('/api/v1/session', (req, res) => {
  const session = getSession(req.cookies.sid);
  if (!session) {
    res.status(401).json({ error: 'Not logged in' });
    return;
  }
  res.json({ username: session.username });
});

app.post('/api/v1/session', (req, res) => {
  const { username } = req.body;
  if (!username || !usernamepattern.test(username)) {
    res.status(400).json({ error: 'Invalid username. Use 1–20 letters, digits, or underscores.' });
    return;
  }
  if (username === banned_user) {
    res.status(403).json({ error: 'Username not allowed' });
    return;
  }
  const sid = createSession(username);
  res.cookie('sid', sid, { httpOnly: true });
  res.status(201).json({ username });
});

app.delete('/api/v1/session', (req, res) => {
  deleteSession(req.cookies.sid);
  res.clearCookie('sid');
  res.json({ ok: true });
});

// Users route 
app.get('/api/v1/users', requireAuth, (req, res) => {
  res.json({ users: getOnlineUsers() });
});

// Messages routes 
app.get('/api/v1/messages', requireAuth, (req, res) => {
  const { channel, after } = req.query;
  if (!isValidChannel(channel)) {
    res.status(400).json({ error: 'Invalid channel' });
    return;
  }
  const afterId = parseInt(after, 10) || 0;
  res.json({ messages: getMessages(channel, afterId) });
});

app.post('/api/v1/messages', requireAuth, (req, res) => {
  const { channel, text } = req.body;
  if (!isValidChannel(channel)) {
    res.status(400).json({ error: 'Invalid channel' });
    return;
  }
  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }
  const msg = addMessage(channel, req.session.username, text);
  res.status(201).json(msg);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});