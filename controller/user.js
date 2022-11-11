const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const JWT_TOKEN_SECRET = "NOTESAPITOKEN"
const config = require('../newdb')
const mysql = require('mysql2/promise');

exports.SignUp = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const { name, email, password, role, company_id } = req.body;

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt);
  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length != 0) {
    console.log("------> User already exists")
    res.sendStatus(409)
  } else {
    connection.execute(`INSERT INTO user (name,email_id,password,
            role_type,company_id) VALUES
    (?,?,?,?,?)`, [(name || null),
    (email || null),
    (hashedPassword || null),
    (role || null),
    (company_id || null)]);

    res.json({ message: "user created successfully" });
  }
}

exports.Login = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const { email, password } = req.body;

  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length == 0) {
    console.log("--------> User does not exist")
    res.sendStatus(404)
  } else {
    const hashedPassword = matchemail[0][0].password
    const jwtToken = generateToken(matchemail[0][0].id)

    //get the hashedPassword from result
    if (await bcrypt.compare(password, hashedPassword)) {
     const result=await connection.execute(`SELECT * FROM user WHERE email_id = "${email}"`)

     if(result!=0){
      let newArr = result[0]
          newArr["token"] = jwtToken
           res.status(200).json({ success: true, data: newArr })
     }else{
      res.status(500).json({ error: err})
     }
      console.log("---------> Login Successful");
    }

   else {
      console.log("---------> Password Incorrect")
      res.send("Password incorrect!")
    } //end of bcrypt.compare()
  }

  function generateToken(id) {
    return jwt.sign(id, JWT_TOKEN_SECRET)
  }
}