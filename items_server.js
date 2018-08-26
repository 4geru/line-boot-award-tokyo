const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('kamakura_tourism.sqlite');  // SQLite の DB ファイル名

module.exports = {
  items: (req,res,next) => {
    console.log('get')
    db.serialize(() => {

        db.each("SELECT * FROM items WHERE id = ?", [req.params.item_id], function(err, row) {
          console.log(row.price + ":" + row.name);
          res.render(__dirname + "/items", {item: {id: row.id, price: row.price, name: row.name} });
      });
    });
  }
}
