'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const BEACON_ENTER= 'enter';
const BEACON_LEAVE= 'leave';

const BEACON_BUDDHA= '000002b737';
const BEACON_STATION= '000002b74f';

const is_AM= true



require('dotenv').config();
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

function handleEvent(event) {    
    var returnText = '';
     

//debug
    if (event.type == 'message' || event.message.type == 'text') {
        var messageObject = messageObject_form_asktime();
//        returnText = "てすと・駅ビーコンの圏外に出ました";
//        var messageObject = messageObject_text(returnText);
        return client.replyMessage(event.replyToken,messageObject);   
    }

    if (event.type == 'beacon' ) {
        var beacon_hwid=event.beacon.hwid;
        var beacon_enter_or_leave=event.beacon.type;

        if (beacon_hwid == BEACON_BUDDHA){
            if (beacon_enter_or_leave == BEACON_ENTER){ 
                returnText = "大仏ビーコンの圏内に入りました";
            } else if (beacon_enter_or_leave == BEACON_LEAVE){ 
                returnText = "大仏ビーコンの圏外に出ました";
            }
            var messageObject = messageObject_text(returnText);

        }
            
        if (beacon_hwid == BEACON_STATION){
            if (beacon_enter_or_leave == BEACON_ENTER){ 
                //駅ビーコンの圏内に入った
                if (is_AM == true) {
                    var messageObject = messageObject_form_asktime();
//                    return client.replyMessage(event.replyToken,messageObject);                       
                } else{
                    //PMの処理★
                }
           

            } else if (beacon_enter_or_leave == BEACON_LEAVE){ 
                returnText = "駅ビーコンの圏外に出ました";
                var messageObject = messageObject_text(returnText);
//                return client.replyMessage(event.replyToken,messageObject);                
            }
        }

        return client.replyMessage(event.replyToken,messageObject);   

    }

    
    if (event.type == 'postback') {
        var form_timestamp = event.timestamp 
        var messageObject = messageObject_text(form_timestamp);
        return client.replyMessage(event.replyToken,messageObject);   
    }

    
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
  
//    return client.replyMessage(event.replyToken, {
//      type: 'text',
//      text: event.message.text //実際に返信の言葉を入れる箇所
//      //text: "大仏が近いです" //実際に返信の言葉を入れる箇所
//
//    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);



//共通関数

function messageObject_form_asktime () { 
    var messageObject_form = {         
        "type": "template",
        "altText": "帰りの時間が決まってたら教えて！",
        "template": {
            "type": "buttons",
            "title": "帰りの時間が決まってたら教えて！",
            "text": "Please select",
            "actions": [
                {
                    "type": "datetimepicker",
                    "label": "時間登録",
    //                        "mode": "date",
    //                        "data": "action=datetemp&selectId=1"
                    "mode": "time",
                    "data": "action=datetemp&selectId=1"
                },
                {
                  "type": "postback",
                  "label": "やめとく",
                  "data": "action=cancel&selectId=2"
                },
            ]
        }
    }  
    return messageObject_form
}; 

function messageObject_text (returnText) { 
    var messageObject_text = {     
        type: 'text',
        text: returnText 
    }
    return messageObject_text
}; 

                
