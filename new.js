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
  
  console.log(result[0])
  connection.end()

  }catch(error){
    console.log(error.message)
  }


  // router.get('/getList',companyControllers.GET);


  // exports.GET=async  (req, res) => {
  //   const connection = await mysql.createConnection(config);
  //   const result=await connection.execute('select*from Users');
  //   if(result!=0){
  //     res.status(200).json({staus:"200 ok ", data: result[0], success: true })
  //   }else{
  //     res.status(404).json({status:"404 not found",message:"domain list not found"});
  //   }
  // }

 

}

connectivity();

// simple query
// connection.query(
//     'SELECT * FROM icewarp_dba',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

