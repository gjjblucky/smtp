var express = require("express");
var mysql = require('mysql');
const db = require('./db')
var bodyParser = require('body-parser')


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




var fs = require('fs');
var file = "./s20220921.txt";
var text = fs.readFileSync(file, 'utf-8');
var textByLine = text.split('\n');

// console.log(textByLine.length);


var data = 'Connected';
var count = (text.match(/data/g)).length;


// for (var i = 0; i < count; i++) {

//   var line = textByLine[i];
//   if (line.includes('Connected')) {

//     //position of ip and position of position of <<
//     var senderIps = textByLine[i].slice(textByLine[i].indexOf('IP'), textByLine[i].indexOf('<<'));
//     //  console.log(senderIps);  

//     for (var j = i; j < count; j++) {
//       var line2 = textByLine[j];

//       //print sendersmail ids
//       if (line2.includes('MAIL FROM:') || line2.includes('RCPT TO:') || line2.includes('250 2.1.0') || line2.includes('250 2.1.5') || line2.includes('550 5.1.1')) {

//         var senderMailIds = textByLine[j].slice(textByLine[j].indexOf('MAIL'), textByLine[j].indexOf('>'));
//         var receiverMailIds = textByLine[j].slice(textByLine[j].indexOf('RCPT'), textByLine[j].indexOf('>'));
//         var senderStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'), textByLine[j].indexOf('ok'));
//         var receiverStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'), textByLine[j].indexOf('ok'));
//         var unknownUserError = textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'), textByLine[j].indexOf('rejecting'));


//         // console.log(senderMailIds);


//         break;
//       }

//       // print receiver mail ids
//       //  if( line2.includes('RCPT TO:') ) {

//       //             var receiverMailIds =textByLine[j].slice(textByLine[j].indexOf('RCPT'),textByLine[j].indexOf('>'));

//       //             // console.log(receiverMailIds);


//       //               break;
//       //         }

//       //print successfully send mails from sender
//       // if( line2.includes('250 2.1.0') ) {

//       //     var senderStatusOk =textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'),textByLine[j].indexOf('ok'));

//       //     // console.log(senderStatusOk);


//       //       break;
//       // }

//       // print successfully receive mail by receiver
//       // if( line2.includes('250 2.1.5') ) {

//       //     var receiverStatusOk=textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'),textByLine[j].indexOf('ok'));

//       //     // console.log(receiverStatusOk);


//       //       break;
//       // }

//       //print unknown user error of email
//       // if( line2.includes('550 5.1.1') ) {

//       //   var unknownUserError=textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'),textByLine[j].indexOf('rejecting'));

//       //   // console.log(unknownUserError);


//       //     break;
//       // }




//       // if(line2.includes('Disconnected'))
//       // {
//       //      console.log(i + " "+ line);
//       //     console.log(j + " "+ line2);

//       //     break;
//       // }   

//     }
//   }
// }


// app.use('/',(req,res) =>{
//   res.send('hyy hello ');
// })


// app.use('/', async (req, res) => {
//   res.setHeader('Content-Type', 'text/plain')
//   var count = (text.match(/data/g)).length;


//   for (var i = 0; i < 5000; i++) {

//     var line = textByLine[i];
//     if (line.includes('Connected')) {

//       //position of ip and position of position of <<
//       var senderIps = textByLine[i].slice(textByLine[i].indexOf('IP'), textByLine[i].indexOf('<<'));
//       //  console.log(senderIps);  

//       for (var j = i; j < 5000; j++) {
//         var line2 = textByLine[j];

//         //print sendersmail ids
//         if (line2.includes('MAIL FROM:') || line2.includes('RCPT TO:') || line2.includes('250 2.1.0') || line2.includes('250 2.1.5') || line2.includes('550 5.1.1')) {

//           var senderMailIds = textByLine[j].slice(textByLine[j].indexOf('MAIL'), textByLine[j].indexOf('>'));
//           var receiverMailIds = textByLine[j].slice(textByLine[j].indexOf('RCPT'), textByLine[j].indexOf('>'));
//           var senderStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'), textByLine[j].indexOf('ok'));
//           var receiverStatusOk = textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'), textByLine[j].indexOf('ok'));
//           var unknownUserError = textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'), textByLine[j].indexOf('rejecting'));





//         await db.query(`INSERT INTO logs_data (main_id,sender_address,recipient_address,fom_ip,
//                   top_ip,email_size,status_val,date_time,jeo_location,error_notification,user_creation_date) VALUES
//                   (?,?,?,?,?,?,?,?,?,?,?)`,
//             [
//               req.body?.main_id,
//               (senderMailIds || ""),
//               (receiverMailIds || ""),
//               req.body?.fom_ip,
//               req.body?.top_ip,
//               req.body?.email_size,
//               "ok",
//               req.body?.date_time,
//               req.body?.jeo_location,
//               (unknownUserError || ""),
//               req.body?.user_creation_date
//             ], function (err, result, fields) {
//               if (err) {
//                 res.status(500).json({
//                   error: err
//                 })
//                 console.log("error@@@", err);
//               } else {
//                 console.log("mailidss", senderMailIds);
//                return res.status(200).json({
//                   data: result
//                 })
//               }
//             })


//         }

//         // print receiver mail ids
//         //  if( line2.includes('RCPT TO:') ) {

//         //             var receiverMailIds =textByLine[j].slice(textByLine[j].indexOf('RCPT'),textByLine[j].indexOf('>'));

//         //             // console.log(receiverMailIds);


//         //               break;
//         //         }

//         //print successfully send mails from sender
//         // if( line2.includes('250 2.1.0') ) {

//         //     var senderStatusOk =textByLine[j].slice(textByLine[j].indexOf('250 2.1.0'),textByLine[j].indexOf('ok'));

//         //     // console.log(senderStatusOk);


//         //       break;
//         // }

//         // print successfully receive mail by receiver
//         // if( line2.includes('250 2.1.5') ) {

//         //     var receiverStatusOk=textByLine[j].slice(textByLine[j].indexOf('250 2.1.5'),textByLine[j].indexOf('ok'));

//         //     // console.log(receiverStatusOk);


//         //       break;
//         // }

//         //print unknown user error of email
//         // if( line2.includes('550 5.1.1') ) {

//         //   var unknownUserError=textByLine[j].slice(textByLine[j].indexOf('550 5.1.1'),textByLine[j].indexOf('rejecting'));

//         //   // console.log(unknownUserError);


//         //     break;
//         // }




//         // if(line2.includes('Disconnected'))
//         // {
//         //      console.log(i + " "+ line);
//         //     console.log(j + " "+ line2);

//         //     break;
//         // }   

//       }
//     }
//   }




// })


console.log(count);


app.listen(3000, () => {
  console.log("ok good very good");
})


app.use('/fetchalldata', async(req,res)=>{
    db.query('select*from logs_data',[],function(err,result,field){
      if(err){
        res.status(500).json({
          error:err
        })
      }else{
        console.log("result@@@",result);
        res.status(200).json({
          data:result
        })
      }
    })
})


