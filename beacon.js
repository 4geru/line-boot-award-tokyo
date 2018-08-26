
const messageObject = require('./message_object'); 
const BEACON_ENTER= 'enter';
const BEACON_LEAVE= 'leave';

const BEACON_BUDDHA= '000002b737';
const BEACON_STATION= '000002b74f';

const is_AM= true

module.exports = {
  beacon: (event) = {
    var beacon_hwid=event.beacon.hwid;
        var beacon_enter_or_leave=event.beacon.type;

        if (beacon_hwid == BEACON_BUDDHA){
            if (beacon_enter_or_leave == BEACON_ENTER){ 
                returnText = "大仏ビーコンの圏内に入りました";
            } else if (beacon_enter_or_leave == BEACON_LEAVE){ 
                returnText = "大仏ビーコンの圏外に出ました";
            }
            var message = messageObject.messageObject_text(returnText);

        }
            
        if (beacon_hwid == BEACON_STATION){
            if (beacon_enter_or_leave == BEACON_ENTER){ 
                //駅ビーコンの圏内に入った
                if (is_AM == true) {
                    // [TODO] 午前
                    var message = messageObject.messageObject_form_asktime();
//                    return client.replyMessage(event.replyToken,messageObject);                       
                } else{
                    // [TODO] 午後
                    //PMの処理★
                }
           

            }
            // [NOTE] demoで使うかも
            // else if (beacon_enter_or_leave == BEACON_LEAVE){ 
            //     returnText = "駅ビーコンの圏外に出ました";
            //     var message = messageObject.messageObject_text(returnText);
            //    return client.replyMessage(event.replyToken,messageObject);                
            // }
        }

        return client.replyMessage(event.replyToken,message);   
  }
}