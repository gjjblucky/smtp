const mysql = require('mysql2/promise')
const config2 = require('../managementDb.js')

exports.Users = async (req, res) => {
  try {
    // create the connection to database
    const connection = await mysql.createConnection(config2)

    connection.connect()

    const result = await connection.execute('SELECT * FROM Users')

    res.status(200).json({ status: '200 ok', data: result[0] })

    connection.end()
  } catch (error) {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  }
}

exports.userAccess = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM UserAccess').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.OauthClients = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM OauthClients').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.Logins = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM Logins').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.Aliases = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM Aliases').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.Domains = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM Domains').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.MetaData = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM MetaData').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.OauthAuthorizations = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM OauthAuthorizations').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.OauthRefreshTokens = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM OauthRefreshTokens').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.OauthTokens = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM OauthTokens').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.apisessions = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM apisessions').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}

exports.demo = async (req, res) => {
  const connection = await mysql.createConnection(config2)

  connection.connect()

  await connection.execute('SELECT * FROM demo').then(result => {
    res.status(200).json({ status: '200 ok', data: result[0] })
    connection.end()
  }).catch(error => {
    console.log(error.message)
    res.status(404).json({ status: '404 Not Found', data: error.message })
  })
}
