const mysql = require('mysql2/promise');
const db = require('../db');
const config = require('../newdb')

exports.POST = async (req, res) => {

  const connection = await mysql.createConnection(config);

  const { companyName, companyAddress } = req.body;

  const sqlSearch = "SELECT * FROM company WHERE company_name = ?";
  const matchemail = await connection.execute(sqlSearch, [companyName])

  if (matchemail[0].length != 0) {

    console.log("------> company already exists")
    res.status(409).json({status:"409 conflict",message:"company already exist"})
  } else {
    connection.execute(`INSERT INTO company (company_name,company_address) VALUES
    (?,?)`, [(companyName || null),
    (companyAddress || null),
    ]);

    const result = await connection.execute(`SELECT * FROM company WHERE company_name = "${companyName}"`);
    if(result!=0){
      res.status(201).json({status:"201 created", message: "company created successfully", data: result[0] });
    }else{
      res.status(404).json({status:"404 not found",message:"company not found"});
    }
  }
}

exports.GET=async  (req, res) => {
  const connection = await mysql.createConnection(config);
  const result=await connection.execute('select*from company');
  if(result!=0){
    res.status(200).json({staus:"200 ok ", data: result[0], success: true })
  }else{
    res.status(404).json({status:"404 not found",message:"company list not found"});
  }
}