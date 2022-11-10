const bcrypt = require("bcrypt")
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
  const { user, password } = req.body;

  const salt = bcrypt.genSaltSync(10)

  const hashedPassword = bcrypt.hashSync(password, salt);


  const sqlSearch = "SELECT * FROM admin WHERE user = ?";


  const matchemail = await connection.execute(sqlSearch, [user])
  if (matchemail[0].length != 0) {

    console.log("------> User already exists")
    res.sendStatus(409)
  } else {
    db.query(`INSERT INTO admin (user,password) VALUES
    (?,?)`, [
      (user || null),
      (hashedPassword || null),]);

    if (await bcrypt.compare(password, hashedPassword)) {

      db.query(`SELECT * FROM admin WHERE user = "${user}"`, [], function (err, result, field) {
        if (err) {
          res.status(500).json({
            error: err
          })
        } else {
          let newArr = result[0]
        
          return res.status(200).json({ success: true, data: newArr })
        }
      })
      console.log("---------> Login Successful");
    }
    else {
      console.log("---------> Password Incorrect")
      res.send("Password incorrect!")
    }

  }
}
