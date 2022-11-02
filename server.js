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
            password: "123456",
            database: "smtps"
        }
    );

    res.setHeader('Content-Type', 'text/plain')
    var count = (text.match(/data/g)).length;


    for (let i = 0; i <= 250; i++) {

        let line = textByLine;
        
        if (line[i].includes('Connected')) {

            //position of ip and position of position of <<
            var senderIps = line[i].slice(line[i].indexOf('IP'), line[i].indexOf('<<'));
           
console.log(senderIps);
            for (let j = 0; j <= line[i].length; j++) {
                let line2 = textByLine[j];
                

                
                if (line2.includes('MAIL FROM:') || line2.includes('RCPT TO:') || line2.includes('250 2.1.0') || line2.includes('250 2.1.5') || line2.includes('550 5.1.1')) {

                    // var senderMailIds = textByLine[j].slice(textByLine[j].indexOf('MAIL'), textByLine[j].indexOf('>'));
                    // var receiverMailIds = textByLine[j].slice(textByLine[j].indexOf('RCPT'), textByLine[j].indexOf('>'));
                    // var senderStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'), textByLine[j].indexOf('ok'));
                    // var receiverStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'), textByLine[j].indexOf('ok'));
                    // var unknownUserError = textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'), textByLine[j].indexOf('rejecting'));
                    var senderMailIds = line2.slice(line2.indexOf('MAIL'), line2.indexOf('>'));
                    var receiverMailIds = line2.slice(line2.indexOf('RCPT'), line2.indexOf('>'));
                    var senderStatusOk = line2.slice(line2.indexOf('250 2.1.0'), line2.indexOf('ok'));
                    var receiverStatusOk = line2.slice(line2.indexOf('250 2.1.5'), line2.indexOf('ok'));
                    var unknownUserError = line2.slice(line2.indexOf('550 5.1.1'), line2.indexOf('rejecting'));



                  
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
            break;

          
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