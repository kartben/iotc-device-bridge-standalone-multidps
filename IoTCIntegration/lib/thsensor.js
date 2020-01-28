// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
'use strict';

const BaseInterface = require('azure-iot-digitaltwins-device').BaseInterface;
const Telemetry = require('azure-iot-digitaltwins-device').Telemetry;

module.exports.THSensor = class THSensor extends BaseInterface {
  constructor(name) {
    super(name, 'urn:seeedstudio:thsensor:1');
    this.temperature = new Telemetry();
    this.humidity = new Telemetry();
  }
};
