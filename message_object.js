module.exports = {
  messageObject_form_asktime: () => { 
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
  },
  messageObject_text: (returnText) => {
    var messageObject_text = {     
        type: 'text',
        text: returnText 
    }
    return messageObject_text
    
  }
}