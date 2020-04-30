# Azure IoT Central Device Bridge

NOTE: This repository was initially created as a fork of https://github.com/Azure/iotc-device-bridge, as a way to address the requirements of bridging a LoRaWAN network server to IoT Central (or potentially IoT Hub) more easily. 

The main differences/evolutions with regard to the original IoT Central Device Bridge are highlighted below:
- Runs as a full-blown Node.js application (instead of Azure functions), conveniently made available as a container. 
- Allows to bridge to multiple IoT Central applications (or more generally, multiple DPS Group Enrollments). Provides a per-device mapping device right --> IoT Central application ;
- Optionally: can be configured as a Slack bot which allows to interactively configure new mappings between a device EUI and a DPS group enrollment (in practice, and for most folks, this means a particular IoT Central app).

You may want to refer to the [documentation of the original bridge](https://github.com/Azure/iotc-device-bridge/blob/master/README.md).

# Instructions

To use the device bridge solution, you will need the following:
- an Azure account. You can create a free Azure account from [here](https://aka.ms/aft-iot)
- an Azure IoT Central application to connect the devices. Create a free app by following [these instructions](https://docs.microsoft.com/en-us/azure/iot-central/quick-deploy-iot-central)

[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fkartben%2Fiotc-device-bridge-standalone-multidps%2Fmaster%2Fazuredeploy.json)

XXX TODO


# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
