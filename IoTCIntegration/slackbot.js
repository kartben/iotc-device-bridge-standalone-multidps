require('dotenv').config()

const { App } = require("@slack/bolt");
const payloads = require("./slackpayloads");

// Remix this project and add your own Slack app credentials to the environment
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: "DEBUG"
});

/**
Edit your App Home layout in Block Kit Builder and paste it to the `home` property in `payloads.js`

We use the `app_home_opened` event to render this view each time a user opens the home tab.
*/
app.event("app_home_opened", async ({ context, event }) => {
  if (event.tab === "home") {
    await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: payloads.home({ user: event.user })
    });
  }
});

/**
To open a modal, we listen for an interactive element with an `action_id: "open_modal"`. 

Edit your modal in Block Kit Builder and paste it to the `modal` property in `payloads.js`
*/
app.action("open_modal", async ({ ack, context, action, body }) => {
  ack();

  await app.client.views.open({
    token: context.botToken,
    trigger_id: body.trigger_id,
    view: payloads.modal({ user: body.user.id })
  });
});

// acknowledge all link button actions
app.action("url", async ({ ack }) => {
  ack();
});

// acknowledge all submitted views (with a regex) and close them
// Use `callback_id` to listen to specific views by defining `callback_id` in your `view` definition
// e.g. app.view('my_callback', ...)
app.view(/w*/, async ({ ack, context, action, body }) => {
  console.log(body.view.state)
  ack();
});

app.error(error => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

// Start your app
(async () => {
  await app.start(process.env.PORT || 3001);

  console.log("⚡️ Bolt app is running!");
})();
