
var express = require("express");
const mysql = require('mysql2/promise');
const db = require('./db')
var bodyParser = require('body-parser')
// create the connection





var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




var fs = require('fs');
var file = "./s20220921.txt";
var text = fs.readFileSync(file, 'utf-8');
var textByLine = text.split('\n');





app.use('/', async (req, res) => {
    const connection = await mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "123456",
            database: "smtps"
        }
    );

    res.setHeader('Content-Type', 'text/plain')
    var count = (text.match(/data/g)).length;


    for (var i = 0; i < 5000; i++) {

        var line = textByLine[i];
        if (line.includes('Connected')) {

            //position of ip and position of position of <<
            var senderIps = textByLine[i].slice(textByLine[i].indexOf('IP'), textByLine[i].indexOf('<<'));
            //  console.log(senderIps);  

            for (var j = i; j < 5000; j++) {
                var line2 = textByLine[j];

                //print sendersmail ids
                if (line2.includes('MAIL FROM:') || line2.includes('RCPT TO:') || line2.includes('250 2.1.0') || line2.includes('250 2.1.5') || line2.includes('550 5.1.1')) {

                    var senderMailIds = textByLine[j].slice(textByLine[j].indexOf('MAIL'), textByLine[j].indexOf('>'));
                    var receiverMailIds = textByLine[j].slice(textByLine[j].indexOf('RCPT'), textByLine[j].indexOf('>'));
                    var senderStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'), textByLine[j].indexOf('ok'));
                    var receiverStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'), textByLine[j].indexOf('ok'));
                    var unknownUserError = textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'), textByLine[j].indexOf('rejecting'));



                    console.log("sendermail@@@", senderMailIds)

                    // await db.query(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
                    //           top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
                    //           (?,?,?,?,?,?,?,?,?,?,?)`,
                    //     [
                    //       req.body?.main_id,
                    //       (senderMailIds || ""),
                    //       (receiverMailIds || ""),
                    //       req.body?.fom_ip,
                    //       req.body?.top_ip,
                    //       req.body?.email_size,
                    //       "ok",
                    //       req.body?.date_time,
                    //       req.body?.jeo_location,
                    //       (unknownUserError || ""),
                    //       req.body?.user_creation_date
                    //     ], function (err, result, fields) {
                    //       if (err) {
                    //         res.status(500).json({
                    //           error: err
                    //         })
                    //         console.log("error@@@", err);
                    //       } else {
                    //         console.log("mailidss", senderMailIds);
                    //        return res.status(200).json({
                    //           data: result
                    //         })
                    //       }
                    //     })

                    const [rows, fields] =
                        await connection.execute(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
                       top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
                       (?,?,?,?,?,?,?,?,?,?,?)`, [null,
                            (senderMailIds || null),
                            (receiverMailIds || null),
                            null,
                            null,
                            null,
                            "ok",
                            null,
                            null,
                            null,
                            null]);

                 break;

                }


            }
        }
    }




})


//   console.log(count);


app.listen(3000, () => {
    console.log("ok good very good");
})