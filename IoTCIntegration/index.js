/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const request = require('request-promise-native');
const handleMessage = require('./lib/engine');

const express = require('express')
const app = express()

const DEVICE_ENROLLMENTS_MAP = {
    "device010": {
        idScope: '0ne0005CF6C',
        primaryKey: 'Ox0GtLJ+JgKnPMQwoV0XplA0j/+8m7k6ZRK2CU+U2Q0EBSpCDkjaaO5SonjL9ANCPuYR33Qpx5aYN8xPg32EgQ=='
     },    
     "device020": {
        idScope: '0ne0005CF6C',
        primaryKey: 'Ox0GtLJ+JgKnPMQwoV0XplA0j/+8m7k6ZRK2CU+U2Q0EBSpCDkjaaO5SonjL9ANCPuYR33Qpx5aYN8xPg32EgQ=='
     }
};

app.use(express.json());
app.post('/', async (req, res) => {
    try {
        await handleMessage({ deviceEnrollments: DEVICE_ENROLLMENTS_MAP, log: console.log }, req.body.device, req.body.measurements, req.body.timestamp);
        res.status(200).end();
    } catch (e) {
        console.log('[ERROR]', e);
        res.status(e.statusCode ? e.statusCode : 500).send(e.message);
    }
})
  
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
