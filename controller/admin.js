const bcrypt = require("bcrypt")
const mysql = require('mysql2/promise');
const config = require('../newdb')

exports.SignUp = async (req, res) => {

  const connection = await mysql.createConnection(config);
  const { user, password } = req.body;

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt);
  const sqlSearch = "SELECT * FROM admin WHERE user = ?";
  const matchemail = await connection.execute(sqlSearch, [user])

  if (matchemail[0].length != 0) {

    console.log("------> User already exists")
    res.sendStatus(409)
  } else {
    connection.execute(`INSERT INTO admin (user,password) VALUES
    (?,?)`, [
      (user || null),
      (hashedPassword || null),]);

    if (await bcrypt.compare(password, hashedPassword)) {

      const result= await connection.execute(`SELECT * FROM admin WHERE user = "${user}"`)
    if(result!=0){
      res.json({ message: "admin created successfully" ,data:result[0]});
        }else{
        res.status(404);
       }
    }
    else {
      console.log("---------> Password Incorrect")
      res.send("Password incorrect!")
    }

  }
}
