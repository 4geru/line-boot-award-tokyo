'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const clova = require('./clova'); 
const intro = require('./intro');
const items = require('./items');
const pay = require('./line-pay'); 
const messageObject = require('./message_object'); 
const beacon = require('./beacon'); 
const PORT = process.env.PORT || 5000;

// for database
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('kamakura_tourism.sqlite');  // SQLite の DB ファイル名

const BEACON_ENTER= 'enter';
const BEACON_LEAVE= 'leave';

const BEACON_BUDDHA= '000002b737';
const BEACON_STATION= '000002b74f';

const is_AM= true

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
// const response = client.pushMessage('user_id',
//   intro.intro
// );

function handleEvent(event) {
  console.log(event.type)
  if (event.type === 'join' || event.type === 'follow') {
    const response = client.replyMessage(event.replyToken,
      intro.intro
      );
    return Promise.resolve(null);
  }
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  if (event.type == 'beacon' ) {
      beacon.beacon(event)
  }

  if (event.type == 'postback') {
      // [TODO] データを保存し、お知らせする
      var form_timestamp = event.timestamp 
      var message = messageObject.messageObject_text(form_timestamp);
      return client.replyMessage(event.replyToken,message);   
  }
  console.log(event.message.text)

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}

console.log(clova)

app.post('/clova', clova.clovaMiddleware, clova.clovaSkillHandler);

// htmlをうまく見せる系
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.get("/", (req, res) => { res.render(__dirname + "/index"); })

// line paynのやつ
app.use("/pay/confirm", (req, res) => {pay.confirm(req, res)});
app.use("/pay/reserve", (req, res) => {pay.serve(req, res)});

// start server
app.listen(PORT);
console.log(`Server running at ${PORT}`);
