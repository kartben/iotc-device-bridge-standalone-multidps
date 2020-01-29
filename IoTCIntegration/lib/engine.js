/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const crypto = require('crypto');
const Device = require('azure-iot-device');
const DeviceTransport = require('azure-iot-device-mqtt');
const util = require('util');

var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

const DigitalTwinClient = require('azure-iot-digitaltwins-device').DigitalTwinClient;
const DeviceInformation = require('./deviceInformation').DeviceInformation;
const THSensor = require('./thsensor').THSensor;


const StatusError = require('../error').StatusError;

const registrationHost = 'global.azure-devices-provisioning.net';

const deviceCache = {};

/**
 * Forwards external telemetry messages for IoT Central devices.
 * @param {{ deviceEnrollments: Map, log: Function }} context 
 * @param {{ deviceId: string }} device 
 * @param {{ [field: string]: number }} measurements 
 */
module.exports = async function (context, device, measurements, timestamp) {
    if (device) {
        if (!device.deviceId || !/^[a-z0-9\-]+$/.test(device.deviceId)) {
            throw new StatusError('Invalid format: deviceId must be alphanumeric, lowercase, and may contain hyphens.', 400);
        }

        if(!context.deviceEnrollments[device.deviceId]) {
            throw new StatusError('No enrollment mapping found for this device', 400);    
        }
    } else {
        throw new StatusError('Invalid format: a device specification must be provided.', 400);
    }

    if (!validateMeasurements(measurements)) {
        throw new StatusError('Invalid format: invalid measurement list.', 400);
    }

    if (timestamp && isNaN(Date.parse(timestamp))) {
        throw new StatusError('Invalid format: if present, timestamp must be in ISO format (e.g., YYYY-MM-DDTHH:mm:ss.sssZ)', 400);
    }

    const client = Device.Client.fromConnectionString(await getDeviceConnectionString(context, device), DeviceTransport.Mqtt);

   

    try {
         // if PnP device 
        if(context.deviceEnrollments[device.deviceId].capabilityModelId) {
            const digitalTwinClient = new DigitalTwinClient(context.deviceEnrollments[device.deviceId].capabilityModelId, client);
            const thSensor = new THSensor('thsensor');
            const deviceInformation = new DeviceInformation('deviceInformation');

            digitalTwinClient.addInterfaceInstance(deviceInformation);
            digitalTwinClient.addInterfaceInstance(thSensor);

            await digitalTwinClient.register();

            thSensor.temperature.send(measurements.temperature);
            thSensor.humidity.send(measurements.humidity);

        } else {
            // send as good ol' IoT Hub telemetry
            const message = new Device.Message(JSON.stringify(measurements));

            if (timestamp) {
                message.properties.add('iothub-creation-time-utc', timestamp);
            }

            await client.open();
            context.log('[HTTP] Sending telemetry for device', device.deviceId);
            await(client.sendEvent(message));
            await client.close();    
        }

    } catch (e) {
        // If the device was deleted, we remove its cached connection string
        if (e.name === 'DeviceNotFoundError' && deviceCache[device.deviceId]) {
            delete deviceCache[device.deviceId].connectionString;
        }

        throw new Error(`Unable to send telemetry for device ${device.deviceId}: ${e.message}`);
    }
};

/**
 * @returns true if measurements object is valid, i.e., a map of field names to numbers or strings.
 */
function validateMeasurements(measurements) {
    if (!measurements || typeof measurements !== 'object') {
        return false;
    }

    return true;
}

async function getDeviceConnectionString(context, device) {
    const deviceId = device.deviceId;

    if (deviceCache[deviceId] && deviceCache[deviceId].connectionString) {
        return deviceCache[deviceId].connectionString;
    }

    var symmetricKey = await getDeviceKey(context, deviceId);
    var provisioningSecurityClient = new SymmetricKeySecurityClient(deviceId, symmetricKey);
    var provisioningClient = ProvisioningDeviceClient.create(registrationHost, context.deviceEnrollments[deviceId].idScope, new ProvisioningTransport(), provisioningSecurityClient);
    if(context.deviceEnrollments[deviceId].capabilityModelId) {
        provisioningClient.setProvisioningPayload({
            '__iot:interfaces': {
              CapabilityModelId: context.deviceEnrollments[deviceId].capabilityModelId
            }
          });
    }

    var registrationResult = await provisioningClient.register();

    const connStr = 'HostName=' + registrationResult.assignedHub + ';DeviceId=' + registrationResult.deviceId + ';SharedAccessKey=' + symmetricKey;
    deviceCache[deviceId].connectionString = connStr;
    return connStr;
}

/**
 * Computes a derived device key using the primary key.
 */
async function getDeviceKey(context, deviceId) {
    if (deviceCache[deviceId] && deviceCache[deviceId].deviceKey) {
        return deviceCache[deviceId].deviceKey;
    }

    const key = crypto.createHmac('SHA256', Buffer.from(context.deviceEnrollments[deviceId].primaryKey, 'base64'))
        .update(deviceId, 'utf8')
        .digest('base64');

    deviceCache[deviceId] = {
        ...deviceCache[deviceId],
        deviceId: key
    } 

    return key;
}