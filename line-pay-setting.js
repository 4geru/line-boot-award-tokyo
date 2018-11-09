"use strict";

console.log('line pay load')
// Import packages.
require("dotenv").config();

// Import packages.
const uuid = require("uuid/v4");
const cache = require("memory-cache");
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('kamakura_tourism.sqlite');  // SQLite の DB ファイル名

// Instanticate LINE Pay API SDK.
const line_pay = require("line-pay");
const payment = new line_pay({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
    // hostname: process.env.LINE_PAY_HOSTNAME, // 不要
    isSandbox: true
})
module.exports = {
    serve: (req, res) => {
              console.log({params: req.params})
        let options = {
            productName: "チョコレート",
            amount: 1,
            currency: "JPY",
            orderId: uuid(),
            confirmUrl: process.env.LINE_PAY_CONFIRM_URL
        }
        db.serialize(() => {
            db.each("SELECT * FROM items WHERE id = ?", [req.params.item_id], function(err, row) {
              options.productName = row.name;
              options.amount = req.params.price
              console.log({price : options.amount})
              payment.reserve(options).then((response) => {
                let reservation = options;
                reservation.transactionId = response.info.transactionId;

                console.log(`Reservation was made. Detail is following.`);
                console.log(reservation);

                // Save order information
                cache.put(reservation.transactionId, reservation);

                res.redirect(response.info.paymentUrl.web);
              })
          });
        });
    },
    confirm: (req, res) => {

        try {
            if (!req.query.transactionId){
                throw new Error("Transaction Id not found.");
            }

            // Retrieve the reservation from database.
            let reservation = cache.get(req.query.transactionId);
            if (!reservation){
                throw new Error("Reservation not found.");
            }

            console.log(`Retrieved following reservation.`);
            console.log(reservation);

            let confirmation = {
                transactionId: req.query.transactionId,
                amount: reservation.amount,
                currency: reservation.currency
            }

            console.log(`Going to confirm payment with following options.`);
            console.log(confirmation);

            payment.confirm(confirmation).then((response) => {
            });
        } catch(error) {
            res.send("決済が完了しました。");
        }
    }
};