const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('kamakura_tourism.sqlite');

db.serialize(() => {
  db.each('SELECT * FROM users', (error, row) => {
    if(error) {
      console.error('Error!', error);
      return;
    }

    // カラムを指定してデータを表示する
    console.log(row.name + ' … ' + row.age);
  });
});

db.close();