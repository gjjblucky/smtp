const mysql = require('mysql2/promise')
const fs = require('fs')
const config = require('../newdb')
const config2 = require('../managementDb')

const rsstream = fs.createReadStream('./s20220921.txt')

exports.DATA = async (req, res) => {
  const connection = await mysql.createConnection(config)
  const connection2 = await mysql.createConnection(config2)

  try {
    rsstream.on('data', async (chunks) => {
      const chunk = chunks.toString().split('\n')

      for (let i = 0; i <= chunks.length - 1; i++) {
        const line = chunk
        let name
        let senderMailIds
        let receiverMailIds
        let senderIps
        let senderStatusOk
        let unknownUserError
        let receiverStatusOk
        let dateTime
        let mainId
        let mailSize
        let sendLimit
        let mailBoxQuota
        let externalEmail
        let userActivity
        let isdata = 0
        let uId
        let lastLogin
        let lastSent
        let lastReceived

        if (line[i]?.includes('Connected')) {
          mainId = line[i]?.slice(line[i].indexOf('[') + 1, line[i].indexOf(']'))

          senderIps = line[i]?.slice(0, line[i].indexOf(' ['))

          dateTime = line[i]?.slice(line[i].indexOf('] ') + 1, line[i].indexOf(' C'))

          for (let j = i; j <= 100; j++) {
            if (line[j]?.slice(line[j].indexOf('[') + 1, line[j].indexOf(']')) === mainId) {
              if (line[j].includes('MAIL FROM:')) {
                isdata = 1

                senderMailIds = line[j].slice(line[j].indexOf(':<') + 2, line[j].indexOf('>'))

                const obj = await connection2.execute('SELECT *, CONCAT(U_Alias,\'@\',U_Domain) AS name FROM Users where  CONCAT(U_Alias,\'@\',U_Domain) ="admin@icewarpdemo.com"')
                const userObj = JSON.parse(JSON.stringify(obj[0]))
                uId = userObj[0].U_ID

                const obj2 = await connection2.execute(`SELECT * FROM UserAccess where  UA_U_ID ="${uId}"`)

                const userObj2 = JSON.parse(JSON.stringify(obj2[0]))

                name = userObj[0].U_Alias
                sendLimit = userObj[0].U_MegabyteSendLimit
                mailBoxQuota = userObj[0].U_MaxBoxSize
                externalEmail = userObj[0].U_RemoteAddress
                lastLogin = userObj2[0].UA_LastLogin
                lastSent = userObj2[0].UA_LastSent
                lastReceived = userObj2[0].UA_LastReceived

                if (userObj[0].U_AccountDisabled === 0) {
                  userActivity = 'disabled'
                } else {
                  userActivity = 'enabled'
                }

                if (line[j].includes('SIZE=')) {
                  mailSize = line[j]?.slice(line[j].indexOf('E=') + 2, line[j].indexOf('T'))
                }
              } else if (line[j].includes('RCPT TO:')) {
                isdata = 1
                receiverMailIds = line[j]?.slice(line[j].indexOf(':<') + 2, line[j].indexOf('>'))
              } else if (line[j].includes('250 2.1.5')) {
                isdata = 1
                // eslint-disable-next-line no-unused-vars
                senderStatusOk = line[j]?.slice(line[j].indexOf('250 2.1.0') + 1, line[j].indexOf('ok'))
              } else if (line[j].includes('550 5.1.1')) {
                isdata = 1
                // eslint-disable-next-line no-unused-vars
                unknownUserError = line[j]?.slice(line[j].indexOf('550 5.1.1') + 1, line[j].indexOf('rejecting'))
              } else if (line[j].includes('Disconnected')) {
                break
              }
              // eslint-disable-next-line no-unused-vars
              receiverStatusOk = line[j]?.slice(line[j].indexOf('250 2.1.5') + 1, line[j].indexOf('ok'))
            }
          }
        }

        if (isdata === 1) {
          isdata = 0
          if (senderMailIds != null && receiverMailIds != null) {
            await connection.execute(`INSERT INTO logs_data (name,main_id,sender_address,recipient_address,fom_ip,
                                       top_ip,email_size,last_login,last_sent,last_received,status_val,date_time,send_limit,mail_box_quota,external_email,jeo_location,user_activity,error_notification,user_creation_date) VALUES
                                       (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [(name || null),
              (mainId || null),
              (senderMailIds || null),
              (receiverMailIds || null),
              (senderIps || null),
              null,
              (mailSize || null),
              (lastLogin || null),
              (lastSent || null),
              (lastReceived || null),
              'ok',
              (dateTime || null),
              (sendLimit || null),
              (mailBoxQuota || null),
              (externalEmail || null),
              null,
              (userActivity || null),
              null,
              null])
          }
        }
      }
    })
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ status: '200 ok', message: 'data successfully inserted' })
  } catch (error) {
    console.log(error)
  }
}

exports.FetchAllData = async (req, res) => {
  const connection = await mysql.createConnection(config)
  const result = await connection.execute('select*from logs_data')
  if (result !== 0) {
    res.status(200).json({ status: '200 ok', data: result[0], success: true })
  } else {
    res.status(404).json({ status: '404 Not Found', message: 'smtp log data not found' })
  }
}

exports.PAGE = async (req, res) => {
  const connection = await mysql.createConnection(config)

  const { size, page } = req.query

  const limit = size
  const offset = page * limit

  await connection.execute(`SELECT * FROM logs_data  LIMIT ${offset},${limit}`).then(result => {
    res.status(200).json({ status: '200 ok', success: true, data: result[0] })
  }).catch(error => {
    res.status(404).json({ status: '404 Not Found', message: error })
    console.log('error', error)
  })
}
