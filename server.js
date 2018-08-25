'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const clova = require('./clova'); 
const intro = require('./intro');
const items = require('./items');
const PORT = process.env.PORT || 5000;

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

// server起動後にメッセージを投げる
// response = client.pushMessage('user_id',
//   {
//       type: 'text',
//       text: 'hello'
//     }
// );

function handleEvent(event) {
  console.log(event.type)
  if (event.type === 'join' || event.type === 'follow') {
    return client.pushMessage(event.source.userId,
      intro.intro
      );
  }
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  console.log(event.message.text)

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

console.log(clova)

app.post('/clova', clova.clovaMiddleware, clova.clovaSkillHandler);

app.listen(PORT);
console.log(`Server running at ${PORT}`);
