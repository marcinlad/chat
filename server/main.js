import http from "http";
import url from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";
import { handleUser } from "./handleUser.js";
import { saveMessage, getMessages } from "./handleMessages.js";

const env = dotenv.config().parsed;
const dbHost = env.DB_HOST;
const dbPort = env.DB_PORT;
const dbName = env.DB_NAME;
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {  
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    const { type, user } = data;

    if (type === "message" && user) {
      await saveMessage(user, data.data);

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type, data: data.data, user, date: new Date().toLocaleTimeString() }));
        }
      });
    }
  });
});


const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const parsedUrl = url.parse(req.url);
  const { pathname, query } = parsedUrl;

  if (pathname === '/login') {
    const username = query?.split('=')[1];
    if (!username) {
      res.statusCode = 400;

      res.end(JSON.stringify({ error: 'Username is required' }));
    } else {
      await handleUser(username);
      const messages = await getMessages();

      res.statusCode = 200;
      res.end(messages ? JSON.stringify(messages) : '[]');
    }
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
})
