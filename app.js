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
    summary += message.text + " ";

    // Clear the existing timeout if we have one
    if (idleBuffer) {
        clearTimeout(idleBuffer);
    }
    
    // Set the idle timeout buffer again
    idleBuffer = setTimeout(() => {
        console.log("Dispatching request");
        axios.post(
            'https://api.openai.com/v1/engines/davinci/completions',
            {
                "prompt": "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.\n\nJupiter is primarily composed of hydrogen with a quarter of its mass being helium, though helium comprises only about a tenth of the number of molecules. It may also have a rocky core of heavier elements,[21] but like the other giant planets, Jupiter lacks a well-defined solid surface. Because of its rapid rotation, the planet's shape is that of an oblate spheroid (it has a slight but noticeable bulge around the equator).\n\nI rephrased this for my daughter, in plain language a second grader can understand:", 
                "temperature": 0.3,
                "max_tokens": 64,
                "top_p": 1
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

                say(`Hey there <@${message.user}>! I think you're about to say: ${completion}`);
                idleBuffer = null;
                summary = "";
                counter = 0;
                console.log("all is good");
                console.log(response.data);
            })
            .catch(function (error) {
                idleBuffer = null;
                summary = "";
                counter = 0;
                console.log(error);
            });

    }, 1500);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();