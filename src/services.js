// Model (data layer): all fetch calls to the REST API

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const checkSession = () =>
  fetch('/api/v1/session').then(res => {
    if (res.status === 401) { return null; }
    if (!res.ok) { throw new Error('Unexpected error checking session'); }
    return res.json();
  });

export const postSession = (username) =>
  fetch('/api/v1/session', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ username }),
  }).then(res => res.json().then(data => ({ status: res.status, data })));

export const deleteSession = () =>
  fetch('/api/v1/session', { method: 'DELETE' }).then(res => {
    if (!res.ok) { throw new Error('Logout failed'); }
  });

export const fetchMessages = (channel, after) =>
  fetch(`/api/v1/messages?channel=${channel}&after=${after}`).then(res => {
    if (!res.ok) { throw new Error('Failed to fetch messages'); }
    return res.json();
  });

export const fetchUsers = () =>
  fetch('/api/v1/users').then(res => {
    if (!res.ok) { throw new Error('Failed to fetch users'); }
    return res.json();
  });

export const postMessage = (channel, text) =>
  fetch('/api/v1/messages', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ channel, text }),
  }).then(res => res.json().then(data => ({ status: res.status, data })));