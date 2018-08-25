const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('example.sqlite');  // SQLite の DB ファイル名

// SQL を同期的に実行する
db.serialize(() => {
  // テーブルがなければ作成する
  db.run('CREATE TABLE IF NOT EXISTS user (name TEXT, age INTEGER)');
  
  // Prepared Statement でデータを挿入する
  const stmt = db.prepare('INSERT INTO user VALUES (?, ?)');
  stmt.run(['Foo', 25]);
  stmt.run(['Bar', 39]);
  stmt.run(['Baz', 31]);
  
  // prepare() で取得した Prepared Statement オブジェクトをクローズする。これをコールしないとエラーになる
  stmt.finalize();
});

db.close();