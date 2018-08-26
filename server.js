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
const item_server = require('./items_server'); 
const beacon = require('./beacon'); 
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
const response = client.pushMessage('U710c26a12186326e3d3b79924cc98a3a',
  items.items
);
// client.pushMessage('U710c26a12186326e3d3b79924cc98a3a',
//   {type: 'text',text: 'hoge'}
// );

client.pushMessage('U48e8438b0b8268ecdbe6b6fcc8ca656e',
  items.items
);
function handleEvent(event) {
  // resのuseridとDBのuserIdが一致する奴があるか。みるない場合ユーザを作る
  const userId = event.source.userId;
  var dbResponse = (userId, callback) => {
    console.log('called')
    console.log(userId)
    db.serialize(function () {
      db.each("SELECT * FROM users WHERE user_id = ?", [userId], function(err, row) {
        console.log(row.user_id + ":" + row.count);
      }, (err, count)=>{
          if (count == 0){
            db.run('INSERT INTO users values (?, ?, ?, ?, ?, ?)', [userId, 1, '', '', '']);
          }
      });
    });
  }

  console.log(event.type)
  if (event.type === 'join' || event.type === 'follow') {
    const response = client.replyMessage(event.replyToken,
      intro.intro
      );
    return Promise.resolve(null);
  }

  if (event.type == 'beacon' ) {
      //beacon.beacon(event)
      var message = beacon.beacon(event)
          return client.replyMessage(event.replyToken,message); 
  }

  if (event.type == 'postback') {
      
      
      // [TODO] データを保存し、お知らせする
      var form_timestamp = event.timestamp 
      var message = messageObject.messageObject_text(form_timestamp);
      return client.replyMessage(event.replyToken,message);   
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

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
app.use("/pay/reserve/:item_id", (req, res) => {pay.serve(req, res)});

// お土産のやつ
app.get('/items/:item_id',item_server.items);

// start server
app.listen(PORT);
console.log(`Server running at ${PORT}`);
