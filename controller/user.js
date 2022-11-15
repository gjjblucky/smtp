const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JWT_TOKEN_SECRET = "NOTESAPITOKEN"
const config = require('../newdb')
const mysql = require('mysql2/promise');
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');

exports.SignUp = async (req, res) => {

  const connection = await mysql.createConnection(config);

  const { name, email, password, role, company_id } = req.body;

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt);
  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length != 0) {
    console.log("------> User already exists")
    res.status(409).json({status:"409 conflict",message:"user already exist"})
  } else {
    connection.execute(`INSERT INTO user (name,email_id,password,
            role_type,company_id) VALUES
    (?,?,?,?,?)`, [(name || null),
    (email || null),
    (hashedPassword || null),
    (role || null),
    (company_id || null)]);

    res.status(201).json({status:"201 created", message: "user created successfully" });
  }
}

exports.Login = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const { email, password } = req.body;

  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length == 0) {
    console.log("--------> User does not exist")
    res.status(404).json({status:"404 Not Found",message:"user does not exist"})
  } else {
    const hashedPassword = matchemail[0][0].password
    const jwtToken = generateToken(matchemail[0][0].id)

    //get the hashedPassword from result
    if (await bcrypt.compare(password, hashedPassword)) {
     const result=await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`)

     if(result!=0){
      let newArr = result[0]
          newArr["token"] = jwtToken
           res.status(200).json({status:"200 ok", success: true, data: newArr })
     }else{
      res.status(500).json({status:"500 Internal Server Error", message:"Something goes to wrong. Please try again"})
     }
      console.log("---------> Login Successful");
    }

   else {
      console.log("---------> Password Incorrect")
      res.status(401).json({status:"The HTTP 401 Unauthorized response ",message:"password incorrect"})
    } //end of bcrypt.compare()
  }
}

function generateToken(id) {
  return jwt.sign(id, JWT_TOKEN_SECRET)
}

//send email
function sendEmail(email, token) {
  var email = email;
  var token = token;
  console.log("email%token")
  var mail = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user: 'noreply@gajari.com',
        pass: 'pmam ynyn zxbi sskp'
    }
  });
  console.log("mailoption")
  var mailOptions = {
    from: 'noreply@gajari.com',
    to:email,
    subject:'For Verification mail',
      html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3090/reset-password?token=' + token + '">link</a> to reset your password</p>'
  };
  console.log("sendmail")
   mail.sendMail(mailOptions, function(error, info) {
    console.log(mailOptions)
      if (info) {
       
          console.log(1)
      } else {
        
          console.log("erroroorro",error)
      }
  });
}

exports.forgot = async (req, res) => {

  const connection = await mysql.createConnection(config);

  
    const email = req.body.email;
 
   
    const useremail = await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`);
   

    // const name = JSON.stringify(useremail);
    // const a = JSON.parse(name);
    // console.log("user data --->", a);

    if (useremail[0].length != 0) {

      var token = randtoken.generate(20);
      
      var sent = sendEmail(email, token);

      if (sent != '0') {
        
      
      await connection.execute(`UPDATE user SET forget_pass_token = "${token}" WHERE email_id ="${email}"`);
     

         res.status(200).json({status:"200 ok",message:'The reset password link has been sent to your email address',token:token})
         
      }else {
         res.status(500).json({status:"500 Internal Server Error",message:'Something goes to wrong. Please try again'})
       }

    }else {
         console.log('2');
         res.status(404).json({status:"404 Not Found",message:'The Email is not registered with us'})
      }
};

exports.reset = async (req, res) => {

  const connection = await mysql.createConnection(config);

    var token = req.body.token;
    var password = req.body.password;

   
   const useremail=await connection.execute('SELECT * FROM user WHERE forget_pass_token ="' + token + '"');

   if(useremail){
   if (useremail[0].length != 0){

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt);
    console.log("hash",hash)
   
        await connection.execute(`UPDATE user SET password = "${hash}" WHERE email_id ="${useremail[0][0].email_id}"`);
     
        res.status(200).json({status:"200 ok",message:'Your password has been updated successfully'})
      
      }else {
        console.log('2');
        res.status(404).json({status:"404 Not Found",message:'Invalid link; please try again'})
        
        }
      }else{
        res.status(404).json({status:"404 Not Found",message:'does not exist '})
      }
      

   };

  const sentEmail = async (email, token) => {
    
    var transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
          user: 'noreply@gajari.com',
          pass: 'pmam ynyn zxbi sskp'
      }
    });
 
   const mailOptions= ({
          from: 'noreply@gajari.com',
          to:email,
          subject:'For Verification mail',
            html: '<p>You requested for change password, kindly use this <a href="http://localhost:3090/change-password?token=' + token + '">link</a> to change your password</p>'
        })
        transporter.sendMail(mailOptions, function(error, info) {
          console.log(mailOptions)
            if (info) {
             
                console.log(1)
            } else {
              
                console.log("erroroorro",error)
            }
        });
    
};

   exports.changePassword = async (req, res) => {

    const connection = await mysql.createConnection(config);
    const { email, password } = req.body;
  
    const useremail = await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`);
  
    if (useremail[0].length != 0) {
    
      var token = randtoken.generate(20);
     
      const hashedPassword = useremail[0][0].password
      //get the hashedPassword from result
      if (await bcrypt.compare(password, hashedPassword)) {

        const sent = await sentEmail(email, token);
     
    
      if (sent  != '0') {
        await connection.execute(`UPDATE user SET forget_pass_token = "${token}" WHERE email_id ="${email}"`);
        
        res.status(200).json({status:"200 ok",message:'The change password link has been sent to your email address',success:true,token:token})
        
         
      }else{
       
        res.status(500).json({status:"500 Internal Server Error",message:'Something goes to wrong. Please try again'})
        }
      }else{
         
        res.status(401).json({message:"password incorrect",status:"The HTTP 401 Unauthorized response "})
      }
    }
  };


  exports.updatePassword = async(req,res) => {
   
    const connection = await mysql.createConnection(config);

    var token = req.body.token;
    var newPassword=req.body.newPassword;
    var confirmPassword=req.body.confirmPassword;

    const useremail=await connection.execute('SELECT * FROM user WHERE forget_pass_token ="' + token + '"');

    if(useremail[0].length == 0){
      console.log("if")
      res.status(404).json({status:"404 Not Found",message:'user does not exist'});
    }else{
      console.log("else")
   if (newPassword == confirmPassword){

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(newPassword, salt);
    console.log("hash",hash)
   
        await connection.execute(`UPDATE user SET password = "${hash}" WHERE email_id ="${useremail[0][0].email_id}"`);
     
        res.status(200).json({status:"200 ok",message:'Your password has been updated successfully',success:true})
      
      }else {
        console.log('2');
        res.status(401).json({message:"password incorrect",status:"The HTTP 401 Unauthorized response "})
        
        }
      }
};