const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const JWT_TOKEN_SECRET = "NOTESAPITOKEN"


const mysql = require('mysql2/promise');
const db = require('../db');

exports.SignUp = async (req, res) => {

  const connection = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Escale@123",
      database: "smtps"
    }

  );

  const { name, email, password, role, company_id } = req.body;

  const salt = bcrypt.genSaltSync(10)

  const hashedPassword = bcrypt.hashSync(password, salt);

  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";


  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length != 0) {

    console.log("------> User already exists")
    res.sendStatus(409)
  } else {
    db.query(`INSERT INTO user (name,email_id,password,
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

  const connection = await mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "Escale@123",
      database: "smtps"
    }

  );
  const { email, password } = req.body;
  // console.log(req.body)

  const sqlSearch = "SELECT * FROM user WHERE email_id = ?";

  const matchemail = await connection.execute(sqlSearch, [email])
  // console.log(matchemail[0].length);

  if (matchemail[0].length == 0) {
    console.log("--------> User does not exist")
    res.sendStatus(404)
  } else {
    const hashedPassword = matchemail[0][0].password


    const jwtToken = generateToken(matchemail[0][0].id)

    //get the hashedPassword from result
    if (await bcrypt.compare(password, hashedPassword)) {
      // console.log("password ok")

      db.query(`SELECT * FROM user WHERE email_id = "${email}"`, [], function (err, result, field) {
        if (err) {
          res.status(500).json({
            error: err
          })
        } else {
          let newArr = result[0]
          newArr["token"] = jwtToken
          return res.status(200).json({ success: true, data: newArr })
        }
      })
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