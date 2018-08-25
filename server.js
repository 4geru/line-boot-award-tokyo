'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
require('dotenv').config();
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");

const PORT = process.env.PORT || 3000;

db.serialize(function () {
  db.run("CREATE TABLE users (user_id TEXT, count INT)");
});

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


var dbResponse = (cnd, callback) => {
  console.log('claled')
  console.log(cnd)
  db.serialize(function () {
    db.each("SELECT * FROM users WHERE user_id = ?", [cnd], function(err, row) {
      console.log(row.user_id + ":" + row.count);
    }, (err, count)=>{
        if (count == 0){
          db.run('INSERT INTO users values (?, ?)', [cnd, 1], (err, row) => {
            client.pushMessage(cnd, {
              type: 'text',
              text: `${1}頭`
            });
          });

        }else{
          db.run("UPDATE users set count = count + 1 where user_id = ?", [cnd], (row) => { console.log(row)}); 
          db.each("SELECT * FROM users WHERE user_id = ?", [cnd], function(err, row) {
            console.log(row.user_id + ":" + row.count);
            client.pushMessage(cnd, {
              type: 'text',
              text: `${row.count}頭`
            });
          });
        }
    });
  });
}

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  console.log(event.message.text)

  let mes = ''
  if(event.message.text == 'パンダ'){
    dbResponse(event.source.userId)
  }else{
    mes = event.message.text;    
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getNodeVer = async (userId, url) => {
    const res = await axios.get(encodeURI('http://b.hatena.ne.jp/api/htnto/expand?shortUrl=' + url));
    const item = res.data.data.expand[0].short_url

    await client.pushMessage(userId, {
        type: 'text',
        text: item
    });
    return 0;
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);