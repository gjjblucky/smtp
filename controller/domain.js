const mysql = require('mysql2/promise');
const config = require('../newdb')

exports.dm = async (req, res) => {

  const connection = await mysql.createConnection(config);

  const { domainName,companyId} = req.body;
  const sqlSearch = "SELECT * FROM domain WHERE domain_name = ?";
  const matchemail = await connection.execute(sqlSearch, [domainName])
 
  if (matchemail[0].length != 0) {

    console.log("------> domain already exists")
    res.sendStatus(409)
  } else {

  await  connection.execute(`INSERT INTO domain (domain_name,company_id) VALUES
    (?,?)`, [(domainName || null),
    (companyId || null),
   ]);
 
   const result= await connection.execute(`SELECT * FROM domain WHERE domain_name = "${domainName}"`)
   if(result!=0){
    res.json({ message: "domain created successfully" ,data:result[0]});
   }else{
    res.status(404);
   }
    

  }

}