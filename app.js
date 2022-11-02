const cors = require('cors');
var express = require("express");
const mysql = require('mysql2/promise');
const db = require('./db')
var bodyParser = require('body-parser')
// create the connection

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(cors());

const fs = require('fs');
const file = "./s20220921.txt";
const text = fs.readFileSync(file, 'utf-8');
const textByLine = text.split('\n');

app.get('/', async (req, res) => {
    const connection = await mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "Escale@123",
            database: "smtps"
        }
    );

    res.setHeader('Content-Type', 'text/plain')
    var count = (text.match(/data/g)).length;


    for (let i = 0; i <= 100; i++) {
     
        let line = textByLine;
    //   for(let j=i;j<=250;j++){
    //     // if(line[i].includes('Connected')){
    //     //     console.log(i);
            
    //             if(line[i].includes('Connected') && line[j].includes('Disconnected')){
    //                 let line2 =[];
    //                 line2=line.slice(line[i].indexOf('Connected'), line[j].indexOf('Disconnected'))
    //                 console.log(line2);
    //             }
    //         // }
    //     }
 
if (line[i].includes('MAIL FROM:') || line[i].includes('RCPT TO:') || line[i].includes('250 2.1.0') || line[i].includes('250 2.1.5') || line[i].includes('550 5.1.1') || line[i].includes('Connected'))
 {

                 
 var senderMailIds = line[i].slice(line[i].indexOf('MAIL'), line[i].indexOf('>'));
 
 var receiverMailIds = line[i].slice(line[i].indexOf('RCPT'), line[i].indexOf('>'));
 var senderIps = line[i].slice(line[i].indexOf('IP'), line[i].indexOf('<<'));
 var senderStatusOk = line[i].slice(line[i].indexOf('250 2.1.0'), line[i].indexOf('ok'));
 var receiverStatusOk = line[i].slice(line[i].indexOf('250 2.1.5'), line[i].indexOf('ok'));
 var unknownUserError = line[i].slice(line[i].indexOf('550 5.1.1'), line[i].indexOf('rejecting'));
              
   const [rows, fields] =
    await connection.execute(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
   top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
    (?,?,?,?,?,?,?,?,?,?,?)`, [null,
     (senderMailIds || null),
     (receiverMailIds || null),
    (senderIps || null),
    null,
    null,
    "ok",
    null,
    null,
    null,
    null]);
 }

}
   res.send("data successfully inserted");
})

app.get('/fetchalldata', async (req, res) => {
    db.query('select*from logs_data', [], function (err, result, field) {
        if (err) {
            res.status(500).json({
                error: err
            })
        } else {
            // console.log("result@@@",result);
            res.status(200).json({
                "status":true,
                data: result
            })
        }
    })
});

//   console.log(count);


app.listen(3090, () => {
    console.log("ok good very good");
})