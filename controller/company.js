const mysql = require('mysql2/promise');
const db = require('../db');
const config = require('../newdb')

exports.cmp = async (req, res) => {

  const connection = await mysql.createConnection(config);

  const { companyName, companyAddress } = req.body;

  const sqlSearch = "SELECT * FROM company WHERE company_name = ?";
  const matchemail = await connection.execute(sqlSearch, [companyName])

  if (matchemail[0].length != 0) {

    console.log("------> company already exists")
    res.sendStatus(409)
  } else {
    connection.execute(`INSERT INTO company (company_name,company_address) VALUES
    (?,?)`, [(companyName || null),
    (companyAddress || null),
    ]);

    const result = await connection.execute(`SELECT * FROM company WHERE company_name = "${companyName}"`);
    if(result!=0){
      res.json({ message: "company created successfully", data: result[0] });
    }else{
      res.status(404);
    }
  }
}