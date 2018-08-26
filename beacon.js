
const messageObject = require('./message_object'); 
const items = require('./items');

const BEACON_ENTER= 'enter';
const BEACON_LEAVE= 'leave';

const BEACON_BUDDHA= '000002b737';
const BEACON_STATION= '000002b74f';

module.exports = {
  beacon: (event) => {
    const beacon_hwid=event.beacon.hwid;
    const beacon_enter_or_leave=event.beacon.type;

    if (beacon_hwid == BEACON_BUDDHA){
        if (beacon_enter_or_leave == BEACON_ENTER){ 
            returnText = "近くに大仏があります";
        } else if (beacon_enter_or_leave == BEACON_LEAVE){ 
            returnText = "大仏から遠ざかりました";
        }
        var message = messageObject.messageObject_text(returnText);

    }
        
    if (beacon_hwid == BEACON_STATION){
        if (beacon_enter_or_leave == BEACON_ENTER){ 
            //駅ビーコンの圏内に入った
            const is_AM = false
            if (is_AM == true) {
                // 午前
                var message = messageObject.messageObject_form_asktime();
            } else{
                // 午後
                return items.items;
            }
       

        }
        // [NOTE] demoで使うかも
        // else if (beacon_enter_or_leave == BEACON_LEAVE){ 
        //     returnText = "駅ビーコンの圏外に出ました";
        //     var message = messageObject.messageObject_text(returnText);
        //    return client.replyMessage(event.replyToken,messageObject);                
        // }
    }
    
    return message;
  }
}
