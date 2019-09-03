const express = require('express');
var cors = require('cors');
const WebSocket = require('ws');
const GrowingFile = require('growing-file');
const wrtc = require('wrtc');

var fs = require('fs');

const ws = new WebSocket.Server({ port: 3000 });
const app = express();
app.use(cors());

let rooms = [];
const options = {
  OfferToReceiveVideo: true
};
var pc2 = new wrtc.RTCPeerConnection(options);

ws.on('connection', ws => {
  pc2.onicecandidate = function(e) {
    if (e.candidate !== null)
      ws.send(JSON.stringify({ type: 'candidate', data: e.candidate }));
  };

  pc2.ontrack = function(e) {
    console.log(e);
  };
  ws.on('message', message => {
    message = JSON.parse(message);
    if (message.type === 'offer') {
      pc2.setRemoteDescription(message).then(
        pc2
          .createAnswer()
          .then(answer => {
            pc2.setLocalDescription(answer);
            ws.send(
              JSON.stringify({
                type: 'description',
                data: pc2.localDescription
              })
            );
          })
          .catch(e => {
            console.log(e);
          })
      );
    }
  });
});

const port = 4000;
app.get('/video', function(req, res) {
  console.log('here');
  let growingfile = GrowingFile.open(
    '/home/danielphingston/Desktop/Projects/MediaRecorder/Client/files/video.webm'
  );
  growingfile.pipe(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
