module.exports = {
  home: context => {
    return {
      type: "home",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:wave: *Hello <@${context.user}>*!\n\nLet's get you connected to Azure IoT Central. Use the button below to configure a new device.`
          }
        },
        {
          type: "divider"
        },
        {
          type: "actions",
          elements: [
            {
              action_id: "open_modal",
              type: "button",
              text: {
                type: "plain_text",
                text: "Add a new TTN→IoT Central device binding"
              }
            }
          ]
        }
      ]
    };
  },
  modal: context => {
    return {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Device bridge config",
        emoji: true
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true
      },
      submit: {
        type: "plain_text",
        text: "Ok",
        emoji: true
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Enter the required information below to connect your LoRa device to Azure IoT Central.`
          }
        },
        {
          type: "divider"
        },
        {
          "type": "input",
          "block_id": "euid",
          "element": {
            "type": "plain_text_input",
            "action_id": "euid",
            "placeholder": {
              "type": "plain_text",
              "text": "2CF7F12010700028"
            }
          },
          "label": {
            "type": "plain_text",
            "text": "Device EUI",
            "emoji": true
          }
        },
        {
          "type": "input",
          "block_id": "idscope",
          "element": {
            "type": "plain_text_input",
            "action_id": "idscope",
            "placeholder": {
              "type": "plain_text",
              "text": "0ne000BA10E"
            }            
          },
          "label": {
            "type": "plain_text",
            "text": "App ID Scope",
            "emoji": true
          }
        },
        {
          "type": "input",
          "block_id": "key",
          "element": {
            "type": "plain_text_input",
            "action_id": "key",
            "placeholder": {
              "type": "plain_text",
              "text": "eVZTSZyO8th6hM4FyPQcobZEb6TYwob1Stqoxn5UIq1ldx8wwnJChbSPxq9c/yW1THz9ksXWOXMhDgkOMXR6uA=="
            }
          },
          "label": {
            "type": "plain_text",
            "text": "App primary key",
            "emoji": true
          }
        }
      ]
    };
  }
};
