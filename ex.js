const fs = require('fs');
const rsstream=fs.createReadStream("./s20220921.txt");

rsstream.on("data",(chunks)=>{
// console.log(chunks.length)
let x;
 x=chunks;

})

console.log(x)

rsstream.on("end",() =>{
  console.log('There will be no more data.');
})


  
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

