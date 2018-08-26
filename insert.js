const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('kamakura_tourism.sqlite');  // SQLite の DB ファイル名

// SQL を同期的に実行する
db.serialize(() => {
  // テーブルがなければ作成する
  db.run('CREATE TABLE IF NOT EXISTS spots (id INTEGER PRIMARY KEY, name TEXT, beacon_id TEXT, detail TEXT)');

  // Prepared Statement でデータを挿入する
  let stmt = db.prepare('INSERT INTO spots VALUES (?, ?, ?, ?)');
  stmt.run([1, '鎌倉大仏', 'beaconid', 'detail',]);

  // prepare() で取得した Prepared Statement オブジェクトをクローズする。これをコールしないとエラーになる
  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS stations (id INTEGER PRIMARY KEY, name TEXT, beacon_id TEXT)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO stations VALUES (?, ?, ?)');
  stmt.run([1, '鎌倉駅', '']);

  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,user_id TEXT, spot_id INTEGER, alert_at TEXT, name TEXT, beacon_id TEXT)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([1, "Uxxxxxx", 1, '18:00', 'しげる', 'beacon_id']);

  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, station_id INTEGER, detail TEXT, image_url TEXT)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO items VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([1, 'クルミッ子', 702, 1, "", "かわいいリスが目印。クルミとキャラメルが香ばしい鎌倉土産の新定番"]);
  stmt.run([2, 'ca ca o エクレア', 400, 1, "チョコレート好きを魅了する鎌倉店限定のエクレアが人気！", ""]);
  stmt.run([3, '鳩サブレー', 600, 1, "本店限定パッケージがかわいい！鳩のモチーフと素朴な味わいが人気の定番", ""]);
  stmt.run([4, 'レーズンウイッチ', 1296, 1, "レーズンたっぷり！レトロな雰囲気が鎌倉らしい定番土産", ""]);
  stmt.run([5, 'かまくらカスター', 156, 1, "ふんわりなめらかな口当たり。季節ごとの味も試してみたい！", ""]);
  stmt.run([6, 'シェルジャン', 250, 1, "湘南の美しい海を思わせる、貝の型に仕上げたパイ菓子", ""]);
  stmt.run([7, '輪心バウム', 320, 1, "素材にこだわった、やさしい甘みのバームクーヘン", ""]);
  stmt.run([8, 'し～らす', 390, 1, "「しらす×あおさのり×メレンゲ」でサクッと香ばしい新感覚のお菓子", ""]);
  stmt.run([9, '鎌倉山ラスク', 1100, 1, "カラフルな色や形がフォトジェニックなラスク", ""]);
  stmt.run([10, 'にしかまチーズ', 843, 1, "とろけるような食感がたまらない、極上チーズケーキ", ""]);
  stmt.run([11, '日影大福', 160, 1, "絶妙なお餅のなめらかさと餡の美味しさ、その日のうちに届けたい！", ""]);
  stmt.run([12, 'かぼちゃきんつば', 1230, 1, "鎌倉っ子にも人気の素朴なおやつ", ""]);
  stmt.run([13, '鎌倉 茶の福', 500, 1, "濃厚な抹茶の香り高い、和洋折衷のお菓子", ""]);
  stmt.run([14, '大佛観音煎餅', 760, 1, "国宝をいただいちゃう！？ど迫力の大仏様＆観音様のお煎餅", ""]);
  stmt.run([15, '鎌倉ビール花', 3400, 1, "芳醇な味わいで、女性におすすめのブラウンビール", ""]);
  stmt.run([16, '鎌倉煮', 550, 1, "老舗ハムブランドのとろけるような豚の角煮をお家でも", ""]);

  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS user_items (id INTEGER PRIMARY KEY, user_id INTEGER, item_id INTEGER, count INTEGER)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO user_items VALUES (?, ?, ?, ?)');
  stmt.run([1, 1, 1, 0]);

  stmt.finalize();
});

db.close();