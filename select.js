const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('example.sqlite');

db.serialize(() => {
  db.each('SELECT * FROM user', (error, row) => {
    if(error) {
      console.error('Error!', error);
      return;
    }
    
    // カラムを指定してデータを表示する
    console.log(row.name + ' … ' + row.age);
  });
});

db.close();