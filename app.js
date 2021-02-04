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

// Listens to incoming messages that contain "hello"
app.message('e', async ({ message, say }) => {
    counter++;
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
                completion = completion.substring(0, completion.lastIndexOf("."));

                say(`Hey there <@${message.user}>! Let me summarize all of this great info for you:\r${completion}`);
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
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();