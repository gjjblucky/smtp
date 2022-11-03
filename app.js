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

//userid loop
// for(let i=0;i<textByLine.length;i++){
//   let x=textByLine;
//   if(x[i].includes('[')){
//     let y=x.slice((x[i].indexOf('[')),(x[i].indexOf(']')));
//     console.log("sd", y);
//   }
// }

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
  // var count = (text.match(/data/g)).length;

  

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
    let isdata = 0;


    // console.log("connected " + i);

    if (line[i].includes('Connected') ) {

    
  
    
      mainId=line[i].slice(line[i].indexOf('[')+1, line[i].indexOf(']'));
    
      
 
     

      senderIps = line[i].slice(line[i].indexOf('=')+1, line[i].indexOf('<<'));
      date_time=line[i].slice(line[i].indexOf('] ')+1, line[i].indexOf(' C'));
      
      for (let j = i; j <= 1000; j++){

        if(line[j].slice(line[j].indexOf('[')+1, line[j].indexOf(']'))==mainId){

          if (line[j].includes('MAIL FROM:')) {
            isdata = 1;
           
            senderMailIds = line[j].slice(line[j].indexOf(':<')+1, line[j].indexOf('>'));
            // console.log("insideloop@@",senderMailIds);
  
          } else if (line[j].includes('RCPT TO:')) {
            isdata = 1;
            receiverMailIds = line[j].slice(line[j].indexOf(':<')+1, line[j].indexOf('>'));
  
          } else if (line[j].includes('250 2.1.5')) {
            isdata = 1;
            senderStatusOk = line[j].slice(line[j].indexOf('250 2.1.0')+1, line[j].indexOf('ok'));
  
          } else if (line[j].includes('550 5.1.1')) {
            isdata = 1;
            unknownUserError = line[j].slice(line[j].indexOf('550 5.1.1')+1, line[j].indexOf('rejecting'));
  
          }
          else if (line[j].includes('Disconnected')) {
            // console.log("disconnected " + j);
            break;
          }
          receiverStatusOk = line[j].slice(line[j].indexOf('250 2.1.5')+1, line[j].indexOf('ok'));
          
        }
        // let view={
        //   mainId : [senderMailIds][receiverMailIds]
        // };
        // console.log(JSON.stringify(   view  )  );
        
      }
    }

    // console.log("outsideloop@@",senderMailIds);

    if(isdata == 1){
      isdata = 0;
      // console.log("data avialable");
      const [rows, fields] =
      await connection.execute(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
    top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
     (?,?,?,?,?,?,?,?,?,?,?)`, [(mainId || null),
        (senderMailIds || null),
        (receiverMailIds || null),
        (senderIps || null),
        null,
        null,
        'ok',
        (date_time || null),
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
        "status": true,
        data: result
      })
    }
  })
});




app.listen(3090, () => {
  console.log("ok good very good");
})