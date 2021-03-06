const express = require('express');
var cors = require('cors');
const WebSocket = require('ws');
const GrowingFile = require('growing-file');
const puppeteer = require('puppeteer');
var Peer = require('simple-peer');
var fs = require('fs');

var options = {
  headless: false,
  args: [
    // '--disable-extensions-except=/path/to/extension/',
    // '--load-extension=/path/to/extension/',
    '--use-fake-ui-for-media-stream',
    '--enable-usermedia-screen-capturing',
    '--allow-http-screen-capture',
    '--no-sandbox'
    // '--headless'
    // '--start-fullscreen',
    // '--user-data-dir=/tmp/chromedata'
  ]
};
const fileStream = fs.createWriteStream(
  '/home/danielphingston/Desktop/Projects/MediaRecorder/Client/files/video322.webm',
  { flags: 'a' }
);

(async () => {
  const videoWriter = new WebSocket.Server({ port: 2000 });

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  videoWriter.on('connection', videoWriter => {
    const fileStream = fs.createWriteStream(
      '/home/danielphingston/Desktop/Projects/MediaRecorder/Client/files/video322.webm',
      { flags: 'a' }
    );
    videoWriter.on('message', message => {
      fileStream.write(Buffer.from(new Uint8Array(message)));
    });
  });
  await page.goto(
    'file:///home/danielphingston/Desktop/Projects/MediaRecorder/Client/video.html',
    {
      waitUntil: 'networkidle2'
    }
  );
  await page.addScriptTag({
    url: 'https://cdn.jsdelivr.net/npm/simple-peer@9.5.0/simplepeer.min.js'
  });

  await page.evaluate(() => {
    window.peer1 = new SimplePeer({
      config: { iceServers: [{ urls: 'stun:stun.1.google.com:19302' }] }
    });
    window.vid = document.getElementById('remote_video');
    console.log(window.peer1);
    window.peer1.on('signal', data => {
      fetch('http://localhost:4000/newpeer?data=' + JSON.stringify(data));
    });
    window.peer1.on('data', data => {
      console.log(data);
    });
    window.peer1.on('stream', data => {
      window.vid.srcObject = data;

      window.videoWriter = new WebSocket('ws://192.168.71.70:2000');

      let mediaRecorder = new MediaRecorder(data, {
        mimeType: 'video/webm'
      });
      mediaRecorder.addEventListener('dataavailable', event => {
        window.videoWriter.send(event.data);
      });
      mediaRecorder.start(10);
    });
  });

  const ws = await new WebSocket.Server({ port: 3000 });

  ws.on('connection', ws => {
    app.get('/newpeer', (req, res) => {
      ws.send(req.query.data);
      res.send('success');
    });

    ws.on('message', message => {
      message = JSON.parse(message);
      if (message.type == 'signal') {
        page.evaluate(signal => {
          window.peer1.signal(signal);
        }, message.data);
      }
    });
  });
})();

const wrtc = require('wrtc');

var fs = require('fs');

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
