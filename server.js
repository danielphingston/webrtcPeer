const express = require('express');
var cors = require('cors');
const WebSocket = require('ws');
const GrowingFile = require('growing-file');
var fs = require('fs');

const ws = new WebSocket.Server({ port: 3000 });
const app = express();
app.use(cors());

ws.on('connection', ws => {
  const fileStream = fs.createWriteStream(
    '/home/danielphingston/Desktop/Projects/MediaRecorder/Client/files/video.webm',
    { flags: 'a' }
  );

  ws.on('message', message => {
    fileStream.write(Buffer.from(new Uint8Array(message)));
  });
  ws.send('hi');
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