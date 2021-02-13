const { App } = require('@slack/bolt');
const axios = require('axios');
let idleBuffer = null;
let summary = "";
let counter = 0;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('message', async ({ event, client }) => {
  let counter = 0;
  let messages = [
    "Oh, it's your birthday on Monday!",
    "Ahem...",
    "La la la la la...",
    "Happy birthday to you.",
    "Squashed tomatoes and stew.",
    "Bread and butter in the gutter.",
    "Happy birthday to you.",
    "Happy birthday Tamar.",
    ":birthday:"
  ];

  try {
    setInterval(function(){ 
      if (counter <= 8) {
        client.chat.postMessage({
          channel: "C01M3ARHJ69",
          text: messages[counter]
        });
      }
      counter++;
    }, 3000);
  }
  catch (error) {
    console.error(error);
  }
});

// Listens to incoming messages that contain "e"
/*app.message('e', async ({ message, say }) => {
  let counter = 0;
  let messages = [
    "Oh, it's your birthday on Monday Tamar!",
    "Ahem...",
    "La la la la la...",
    "Happy birthday to you.",
    "Squashed tomatoes and stew.",
    "Bread and butter in the gutter.",
    "Happy birthday to you.",
    "Happy birthday Tamar."
  ];

  try {
    setInterval(function(){ 
      if (counter <= 3) {
        client.chat.postMessage({
          channel: "C01M3ARHJ69",
          text: messages[counter]
        });
      }
      counter++;
    }, 3000);
  }
  catch (error) {
    console.error(error);
  }*/
/*  counter++;
  summary += message.text + "\r";

  // Clear the existing timeout if we have one
  if (idleBuffer) {
      clearTimeout(idleBuffer);
  }
  
  // Set the idle timeout buffer again
  idleBuffer = setTimeout(() => {
      console.log(summary);
      axios.post(
          'https://api.openai.com/v1/engines/curie/completions',
          {
              "prompt": summary, 
              "temperature": 0.7,
              "max_tokens": 60,
              "top_p": 1,
              "stop": ["\r"]
          },
          {
            headers: {
              'Authorization': 'Bearer ' + process.env.OPEN_API_KEY,
              'Content-Type': 'application/json'
            }
          })
          .then(function (response) {
              let completion = '';
              if (response.data.choices && response.data.choices.length > 0) {
                  completion = response.data.choices[0].text;
              }

              // Chop the response down to be a single sentence
              completion = completion.substring(0, completion.lastIndexOf(".")) + ".";

              say(`Hey there <@${message.user}>! Let me pit my 178 billion parameters against your measly 100 billion neurons to summarize:\r${completion}`);
              idleBuffer = null;
              summary = "";
              counter = 0;
              console.log(response.data);
          })
          .catch(function (error) {
              idleBuffer = null;
              summary = "";
              counter = 0;
              console.log(error);
          });
  }, 15000);
});*/


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();