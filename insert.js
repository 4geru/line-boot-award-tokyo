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

  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, spot_id INTEGER, alert_at TEXT, name TEXT, beacon_id TEXT)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)');
  stmt.run([1, 1, '18:00', 'しげる', 'beacon_id']);

  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, price INTEGER, station_id INTEGER)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO items VALUES (?, ?, ?, ?)');
  stmt.run([1, 1, 'お土産', 1]);

  stmt.finalize();

  db.run('CREATE TABLE IF NOT EXISTS user_items (id INTEGER PRIMARY KEY, user_id INTEGER, item_id INTEGER, count INTEGER)');
  // Prepared Statement でデータを挿入する
  stmt = db.prepare('INSERT INTO user_items VALUES (?, ?, ?, ?)');
  stmt.run([1, 1, 1, 0]);

  stmt.finalize();
});

db.close();