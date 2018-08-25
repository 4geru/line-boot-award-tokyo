const clova = require('@line/clova-cek-sdk-nodejs');

module.exports = {

  clovaSkillHandler: clova.Client
    .configureSkill()
    .onLaunchRequest(responseHelper => {
      const sessionId = responseHelper.getSessionId();
      console.log(responseHelper.requestObject.session.user.userId)
      console.log(responseHelper.getUser());
      console.log(sessionId)
      console.log(responseHelper)
      console.log('context')
      responseHelper.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: '観光案内するね！',
      });
    })
    .onIntentRequest(async responseHelper => {
      const intent = responseHelper.getIntentName();
      const sessionId = responseHelper.getSessionId();
      console.log(intent)
      console.log('session')
      console.log(sessionId)
      switch (intent) {
        case 'testIntent':
          // Build speechObject directly for response
          responseHelper.setSimpleSpeech({
            lang: 'ja',
            type: 'PlainText',
            value: '元気だよ',
          });
          break;
      }
    })
    .onSessionEndedRequest(responseHelper => {
      const sessionId = responseHelper.getSessionId();

      responseHelper.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'また来てね！',
      });
      // Do something on session end
    })
    .handle(),

  clovaMiddleware: clova.Middleware({ applicationId: "com.uhsog.kamakura_tourism" })
};