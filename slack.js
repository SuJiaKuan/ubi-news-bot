const { WebClient } = require('@slack/web-api');


async function sendMessage(message, channel, token) {
  const web = new WebClient(token);

  return await web.chat.postMessage({
    channel,
    text: message,
  });
}

module.exports = {
  sendMessage,
}
