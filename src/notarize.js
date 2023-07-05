const { notarize } = require('@electron/notarize');
require('dotenv').config();

async function notarizing() {
  return await notarize({
    tool: 'notarytool',
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};

module.exports = notarizing;