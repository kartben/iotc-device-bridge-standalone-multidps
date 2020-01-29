/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const request = require('request-promise-native');
const handleMessage = require('./lib/engine');

const express = require('express')
const app = express()

const slackbotApp = require('./slackbot').App

const DEVICE_ENROLLMENTS_MAP = {

};

app.use(express.json());
app.post('/', async (req, res) => {
    try {
        console.log("[HTTP] Received the following body:", req.body)

        // adjust for getting TTNv3 metadata 
        req.body = {
            device: {
                deviceId: req.body.end_device_ids.device_id.toLowerCase()
            },
            measurements: req.body.uplink_message.decoded_payload
        }

        await handleMessage({ deviceEnrollments: DEVICE_ENROLLMENTS_MAP, log: console.log }, req.body.device, req.body.measurements, req.body.timestamp);
        res.status(200).end();
    } catch (e) {
        console.log('[ERROR]', e);
        res.status(e.statusCode ? e.statusCode : 500).send(e.message);
    }
})

app.get('/deviceEnrollments', async (req, res) => {
    res.status(200).json(DEVICE_ENROLLMENTS_MAP);
})

app.post('/deviceEnrollments', async (req, res) => {
    Object.assign(DEVICE_ENROLLMENTS_MAP, req.body);
    res.status(200).end();
})
  
app.listen(3000, function () {
    console.log('Device bridge listening on port 3000!')
});

// Start slackbot
(async () => {
    await slackbotApp.start(process.env.PORT || 3001);
    console.log("⚡️ Bolt app is running!");
  })();
  
