async function connectivity(){
  try{
    const mysql = require('mysql2/promise');

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
  
  console.log(result)
  connection.end()

  }catch(error){
    console.log(error.message)
  }
 

}

connectivity()

// simple query
// connection.query(
//     'SELECT * FROM icewarp_dba',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

