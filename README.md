---

## Messaging APIの利用
[LINE Developers](https://developers.line.me/ja/services/messaging-api/)から新しいbotを作成します。

「今すぐ始めよう」 > 「プロバイダの選択」 > 「新規チャネル作成」　をします。
![image.png](https://qiita-image-store.s3.amazonaws.com/0/64677/2f31aca4-7907-e848-1268-49b43519a8a2.png)

---
## 初期設定

1. メールアドレスの登録
1. webhookを利用
2. アクセストークンの発行
3. 自動応答メッセージ/友だち追加時あいさつ を利用しないに変更
4. Channel Secret/アクセストークンをメモ
![screencapture-developers-line-me-console-channel-1598664616-basic-2018-08-05-16_45_00.png](https://qiita-image-store.s3.amazonaws.com/0/64677/94af9b77-e93d-3113-e426-3113ccc748b0.png)


---
### npmの設定

```
npm init -y
npm i --save @line/bot-sdk express dotenv
touch server.js
```

---

### serverの中身

```
'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

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
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
```

---

## 環境変数の設定
.envファイルに設定ファイルを追記します。

```:.env
CHANNEL_SECRET=""
CHANNEL_ACCESS_TOKEN=""
```

---

## ngrokでhttps通信を可能にします。

```shell
ngrok http 3000
```

---

参考文献

- https://qiita.com/n0bisuke/items/ceaa09ef8898bee8369d#%E8%A3%9C%E8%B6%B3%E8%B3%87%E6%96%99
