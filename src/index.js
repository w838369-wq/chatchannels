// Entry point: boot the app

import { checkSession } from './services.js';
import { showLoading, showLogin, initApp } from './events.js';
import { showToast } from './render.js';

showLoading();

checkSession()
  .then(data => {
    if (data && data.username) {
      initApp(data.username);
    } else {
      showLogin();
    }
  })
  .catch(() => {
    showToast('Unexpected error. Please refresh.', true);
    showLogin();
  });