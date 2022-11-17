const mysql = require('mysql2/promise');

 exports.GET= async (req,res)=>{

  try {

       // create the connection to database
       const connection = await mysql.createConnection({
        host: "103.161.43.86",
        user: "icewarp_dba",
        password: "Pwd@2019",
        database: "icewarp_accounts",
        port:3306
        });
  
        connection.connect()

        const result=await connection.execute('SELECT * FROM Users');
  
        console.log(result[0])

        res.status(200).json({status:"200 ok",data:result[0]})

        connection.end()
  } catch(error) {

                  console.log(error.message)
                  res.status(404).json({status:"404 Not Found",data:error.message})

     }
}

