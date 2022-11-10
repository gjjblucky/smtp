
const mysql = require('mysql2/promise');
const db = require('../db');
const fs = require('fs');
const file = "./s20220921.txt";
const text = fs.readFileSync(file, 'utf-8');
const textByLine = text.split('\n');


exports.DATA = (async (req, res) => {


  const connection = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Escale@123",
      database: "smtps"
    }

  );

  res.setHeader('Content-Type', 'text/plain')

  for (let i = 0; i <= 1000; i++) {

    let line = textByLine;
    let senderMailIds;
    let receiverMailIds;
    let senderIps;
    let senderStatusOk;
    let unknownUserError;
    let receiverStatusOk;
    let date_time;
    let mainId;
    let mailSize;
    let isdata = 0;

    if (line[i].includes('Connected')) {

      mainId = line[i].slice(line[i].indexOf('[') + 1, line[i].indexOf(']'));

      senderIps = line[i].slice(0, line[i].indexOf(' ['));

      date_time = line[i].slice(line[i].indexOf('] ') + 1, line[i].indexOf(' C'));

      for (let j = i; j <= 1000; j++) {

        if (line[j].slice(line[j].indexOf('[') + 1, line[j].indexOf(']')) == mainId) {

          if (line[j].includes('MAIL FROM:')) {
            isdata = 1;

            senderMailIds = line[j].slice(line[j].indexOf(':<') + 2, line[j].indexOf('>'));

            if (line[j].includes('SIZE=')) {
              mailSize = line[j].slice(line[j].indexOf('E=') + 2, line[j].indexOf('T'));

            }
          }
          else if (line[j].includes('RCPT TO:')) {
            isdata = 1;
            receiverMailIds = line[j].slice(line[j].indexOf(':<') + 2, line[j].indexOf('>'));


          } else if (line[j].includes('250 2.1.5')) {
            isdata = 1;
            senderStatusOk = line[j].slice(line[j].indexOf('250 2.1.0') + 1, line[j].indexOf('ok'));

          } else if (line[j].includes('550 5.1.1')) {
            isdata = 1;
            unknownUserError = line[j].slice(line[j].indexOf('550 5.1.1') + 1, line[j].indexOf('rejecting'));

          }
          else if (line[j].includes('Disconnected')) {

            break;
          }
          receiverStatusOk = line[j].slice(line[j].indexOf('250 2.1.5') + 1, line[j].indexOf('ok'));

        }
      }
    }
    if (isdata == 1) {
      isdata = 0;
      if (senderMailIds != null && receiverMailIds != null) {
        const [rows, fields] =
          await connection.execute(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
    top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
    (?,?,?,?,?,?,?,?,?,?,?)`, [(mainId || null),
          (senderMailIds || null),
          (receiverMailIds || null),
          (senderIps || null),
            null,
          (mailSize || null),
            'ok',
          (date_time || null),
            null,
            null,
            null]);
      }

    }
  }
  res.json({ message: "data successfully inserted" });

})

exports.FetchAllData = (async (req, res) => {
  db.query('select*from logs_data', [], function (err, result, field) {
    if (err) {
      res.status(500).json({
        error: err
      })
    } else {
      return res.status(200).json({ data: result, success: true })
    }
  })
}
);