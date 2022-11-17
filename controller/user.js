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
  
     res.status(404).json({status:"404 Not Found",message:"user does not exist"})
  } else {

         const hashedPassword = matchemail[0][0].password
         const jwtToken = generateToken(matchemail[0][0].id)
      if (await bcrypt.compare(password, hashedPassword)) {

         const result=await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`)
         if (result!=0){

            let newArr = result[0]
            newArr["token"] = jwtToken
            res.status(200).json({status:"200 ok", success: "login successfully", data: newArr })
          }else  {

                 res.status(500).json({status:"500 Internal Server Error", message:"Something goes to wrong. Please try again"})
            }
      } else {
     
          res.status(401).json({status:"The HTTP 401 Unauthorized response ",message:"password incorrect"})
        } 
    }
}

function generateToken(id) {
  return jwt.sign(id, JWT_TOKEN_SECRET)
}

//send email
function sendEmail(email, token) {
  var email = email;
  var token = token;
 
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
 
  var mailOptions = {
    from: 'noreply@gajari.com',
    to:email,
    subject:'For Verification mail',
      html: '<p>You requested for reset password, kindly use this <a href="http://43.204.235.74:3090/resetPassword?token=' + token + '">link</a> to reset your password</p>'
  };

   mail.sendMail(mailOptions, function(error, info) {
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
      
         res.status(404).json({status:"404 Not Found",message:'The Email is not registered with us'})
      }
};

exports.reset = async (req, res) => {

  const connection = await mysql.createConnection(config);

    var token = req.body.token;
    var newPassword = req.body.newPassword;
 
   const useremail=await connection.execute('SELECT * FROM user WHERE forget_pass_token ="' + token + '"');

   if (useremail){
     if (useremail[0].length != 0){

         const salt = bcrypt.genSaltSync(10)
         const hash = bcrypt.hashSync(newPassword, salt);
        if(await bcrypt.compare(newPassword, useremail[0][0].password)){

           res.status(403).json({status:"403 Forbidden Error",message:'old password and new password cant be matched'})
        }else{

            await connection.execute(`UPDATE user SET password = "${hash}" WHERE email_id ="${useremail[0][0].email_id}"`);
             res.status(201).json({status:"201 created",message:'Your password has been updated successfully'})
          }
      }else {
     
        res.status(404).json({status:"404 Not Found",message:'Invalid link; please try again'})
        }
    } else{
        res.status(404).json({status:"404 Not Found",message:'does not exist '})
      }
};

exports.GET=async  (req, res) => {

  const connection = await mysql.createConnection(config);
  const result=await connection.execute('select*from user');

  if(result!=0){

    res.status(200).json({staus:"200 ok ", data: result[0], success: true })
  }else{

    res.status(404).json({status:"404 not found",message:"domain list not found"});
  }
}

exports.changePassword = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  const useremail = await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`);

  if (useremail[0].length != 0) {
  
    const hashedPassword = useremail[0][0].password
    
    if (await bcrypt.compare(oldPassword, hashedPassword)) {
       if (newPassword == confirmPassword) {
          if (oldPassword != newPassword){

              const salt = bcrypt.genSaltSync(10)
              const hash = bcrypt.hashSync(newPassword, salt);

              await connection.execute(`UPDATE user SET password = "${hash}" WHERE email_id ="${email}"`);
              res.status(201).json({status:"201 ok",message:'Your password has been changed successfully',success:true})
          } else{
     
              res.status(403).json({status:"403 Forbidden Error",message:'old password and new password cant be matched'})
            }
        }else{
     
          res.status(403).json({status:"403 Forbidden Error",message:'new and confirm passwords are not matching'})
       }
    }else{
       
      res.status(401).json({message:"password incorrect",status:"The HTTP 401 Unauthorized response "})
    }
  }else{

    res.status(404).json({status:"404 Not Found", message:"email id is not found"});
  }
};