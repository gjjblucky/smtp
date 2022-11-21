/* eslint-disable eqeqeq */
const mysql = require('mysql2/promise')
const config = require('../newdb')

exports.POST = async (req, res) => {
  const connection = await mysql.createConnection(config)

  const { domainName, companyId } = req.body

  const sqlSearch = 'SELECT * FROM domain WHERE domain_name = ?'
  const matchemail = await connection.execute(sqlSearch, [domainName])

  // eslint-disable-next-line eqeqeq
  if (matchemail[0].length != 0) {
    res.status(409).json({ status: '409 cconflict', message: 'domain already exist' })
  } else {
    await connection.execute(`INSERT INTO domain (domain_name,company_id) VALUES
          (?,?)`, [(domainName || null),
      (companyId || null)
    ])
    const result = await connection.execute(`SELECT * FROM domain WHERE domain_name = "${domainName}"`)
    if (result != 0) {
      res.status(201).json({ status: '201 created', message: 'domain created successfully', data: result[0] })
    } else {
      res.status(404).json({ status: '404 not found', message: 'domain not found' })
    }
  }
}

exports.GET = async (req, res) => {
  const id = req.params.id
  const connection = await mysql.createConnection(config)

  const result = await connection.execute(`SELECT * FROM domain WHERE company_id="${id}"`)
  if (result[0] == 0) {
    res.status(404).json({ status: '404 not found', message: 'companyId not found' })
  } else {
    res.status(200).json({ staus: '200 ok ', data: result[0], success: true })
  }
}
