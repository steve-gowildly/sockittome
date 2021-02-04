const { App } = require('@slack/bolt');
let idleBuffer = null;
let summary = "";
let counter = 0;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    counter++;
    summary += "\r" + message.text;

    // Clear the existing timeout if we have one
    if (idleBuffer) {
        clearTimeout(idleBuffer);
    }
    
    // Set the idle timeout buffer again
    idleBuffer = setTimeout(() => {
        say(`Hey there <@${message.user}>! You've said hello ${counter} times :) Your summary is: ${summary}`);
        idleBuffer = null;
        summary = "";
        counter = 0;
    }, 15000);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();