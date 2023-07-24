const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on('request', app);
server.listen(3000, () => { console.log('Listening on 3000') });

/** Begin websocket */
const WebsocketServer = require('ws').Server;
const wss = new WebsocketServer({ server: server });

wss.on('connection', (ws) => {
  const numClients = wss.clients.size;
  console.log(`New client connected. Total: ${numClients}`);

  wss.broadcast(`Current clients: ${numClients}`);
  if(ws.readyState === ws.OPEN) {
    ws.send("Welcome to the websocket server");
  }

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  })
}