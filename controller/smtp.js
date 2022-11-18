
const mysql = require('mysql2/promise');
const db = require('../db');
const fs = require('fs');
const file = "./s20220921.txt";
const text = fs.readFileSync(file, 'utf-8');
const textByLine = text.split('\n');
const config = require('../newdb');
const config2 = require('../managementDb');

async function manage(){

const x='public-folders@icewarpdemo.com'


  const connection2 = await mysql.createConnection(config2);

  const name=await connection2.execute(`SELECT * FROM Users WHERE U_Alias+@+U_Domain=x`);
  // const name=await connection2.execute('SELECT U_Name FROM Users LIMIT 3');
  console.log(name)
  
  // const sendLimit=await connection2.execute('SELECT U_MegabyteSendLimit FROM Users LIMIT 3');
  // console.log(sendLimit)
  
  // const mailBox=await connection2.execute('SELECT U_MaxBoxSize FROM Users LIMIT 3');
  // console.log("mailBox",mailBox[0])
  
  // const externalMail=await connection2.execute('SELECT U_UseRemoteAddress FROM Users LIMIT 3');
  // console.log("externalMail",externalMail[0])
  
  // const lastLogin=await connection2.execute('SELECT UA_LastLogin FROM UserAccess LIMIT 3')
  // console.log("lastlogin",lastLogin[0])
  
  // const lastSent=await connection2.execute('SELECT UA_LastSent FROM UserAccess LIMIT 3')
  // console.log("lastSend",lastSent[0])
  
  // const lastReceived=await connection2.execute('SELECT UA_LastReceived FROM UserAccess LIMIT 3')
  // console.log("lastReceived",lastReceived[0])
  
  // const disabledAccount=await connection2.execute('SELECT U_AccountDisabled FROM Users WHERE U_AccountDisabled = 0 ')
  // console.log("disable",disabledAccount[0])
  
  // const enabledAccount=await connection2.execute('SELECT U_AccountDisabled FROM Users WHERE U_AccountDisabled = 1')
  // console.log("enable",enabledAccount[0])


}
manage();





exports.DATA = (async (req, res) => {

  const connection = await mysql.createConnection(config);
  res.setHeader('Content-Type', 'text/plain')

  for (let i = 0; i <= 5000; i++) {

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
          (receiverMailIds|| null),
          (senderIps ||null),
            null,
          (mailSize|| null),
            'ok',
          (date_time|| null),
            null,
            null,
            null]);
      } 
    }
  }
  res.status(200).json({status:"200 ok", message: "data successfully inserted" });
})

exports.FetchAllData = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const result=await connection.execute('select*from logs_data');
  if(result!=0){
    res.status(200).json({status:"200 ok", data: result[0], success: true })
  }else{
    res.status(404).json({status:"404 Not Found",message:"smtp log data not found"})
  }
}







exports.PAGE=async (req,res)=>{
  const connection = await mysql.createConnection(config);

  const {size ,page}=req.query;

  const limit = size 
  const offset = page * limit 

  await connection.execute(`SELECT * FROM logs_data  LIMIT ${offset},${limit}`).then(result =>{

    res.status(200).json({status:"200 ok",success:true,data:result[0]});
   
  }).catch(error =>{
    res.status(404).json({status:"404 Not Found",message:error});
    console.log("error",error);
  })



}





