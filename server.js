const express = require('express');
var cors = require('cors');
const WebSocket = require('ws');
const GrowingFile = require('growing-file');
var Peer = require('simple-peer');

const wrtc = require('wrtc');

var fs = require('fs');

const ws = new WebSocket.Server({ port: 3000 });
const app = express();

app.use(cors());
app.get('/', function(req, res) {
  res.sendfile('Client/client.html');
});

const port = 4000;

app.get('/peer', (req, res) => {
  peer2.on('signal', data => {
    console.log(ws);
    res.send(JSON.stringify(data));
  });
  if (message.type == 'signal') {
    peer2.signal(message.data);
  }
});

const peer2 = new Peer({ wrtc: wrtc });

// const repeater = new Peer({ wrtc: wrtc, initiator: true });

ws.on('connection', ws => {
  peer2.on('data', data => {
    console.log(data.toString());
  });

  peer2.on('signal', data => {
    ws.send(JSON.stringify(data));
  });

  ws.on('message', message => {
    message = JSON.parse(message);
    if (message.type == 'signal') {
      peer2.signal(message.data);
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
