const bcrypt = require("bcrypt")
const mysql = require('mysql2/promise');
const config = require('../newdb');

exports.SignIn = async (req, res) => {

  const connection = await mysql.createConnection(config);

  const { user, password} = req.body;
  
  // const salt = bcrypt.genSaltSync(10)
  // const hashedPassword = bcrypt.hashSync(password, salt);

  const sqlSearch = "SELECT * FROM admin WHERE user = ?";
  const matchemail = await connection.execute(sqlSearch, [user])

  if (matchemail[0].length != 0) {
      if (await bcrypt.compare( password,matchemail[0][0].password)) {

          // connection.execute(`INSERT INTO admin (user,password) VALUES
          // (?,?)`, [
          //   (user || null),
          //   (hashedPassword || null),
          // ]);

          const result= await connection.execute(`SELECT * FROM admin WHERE user = "${user}"`)
          if (result!=0){
      
              res.status(200).json({ message: "admin login successfully" ,data:result[0],status:"The HTTP 200 OK success"});
      
          } else {
      
                  res.status(404).json({ message: "something goes wrong" ,data:result[0],status:"The HTTP 404 Not Found"});
            }
      } else {

              res.status(401).json({message:"password incorrect",status:"The HTTP 401 Unauthorized response "})
        }
  } else {

          res.status(404).json({status:"404 Not Found",message:"------> User does not  exists"});
    }
}
