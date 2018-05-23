var express = require('express');
var app = express();
var http = require('http').Server(app);
const path = require('path');

const port = process.env.PORT || 8080;

http.listen(port, function(){
  console.log(`hello.\nlistening on ${port}.`);
});

app.get('/', function (req, res) {
  res.send("_server running wemo test_");
});

const connectedDevicesInfo = [];
let connectedDeviceClient;

app.get('/devices', function (req, res) {
  res.send(JSON.stringify(connectedDevicesInfo));
});

app.get('/on', function (req, res) {
  let result;
  if (connectedDeviceClient) {
    connectedDeviceClient.setBinaryState(1);
    result = 'on hopefully';
  } else {
    result = 'no connected device to switch on';
  }
  res.send(result);
});

app.get('/off', function (req, res) {
  let result;
  if (connectedDeviceClient) {
    connectedDeviceClient.setBinaryState(0);
    result = 'off hopefully';
  } else {
    result = 'no connected device to switch off';
  }
  res.send(result);
});



var Wemo = require('wemo-client');
var wemo = new Wemo();

wemo.discover(function(err, deviceInfo) {
  console.log('Wemo Device Found: %j', deviceInfo);
  connectedDevicesInfo.push(deviceInfo);

  // Get the client for the found device
  var client = wemo.client(deviceInfo);
  connectedDeviceClient = client;

  // You definitely want to listen to error events (e.g. device went offline),
  // Node will throw them as an exception if they are left unhandled
  client.on('error', function(err) {
    console.log('Error: %s', err.code);
  });

  // Handle BinaryState events
  client.on('binaryState', function(value) {
    console.log('Binary State changed to: %s', value);
  });

  // Turn the switch on
  // client.setBinaryState(1);
});
