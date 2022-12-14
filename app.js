const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

// create the connection
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
dotenv.config()

const smtpRoutes = require('./router/smtp')
const adminRoutes = require('./router/admin')
const UserRoutes = require('./router/user')
const companyRoutes = require('./router/company')
const domainRoutes = require('./router/domain')
const newDb = require('./router/management.js')

app.use('/logdata', smtpRoutes)
app.use('/admin', adminRoutes)
app.use('/user', UserRoutes)
app.use('/company', companyRoutes)
app.use('/domain', domainRoutes)
app.use('/icewrap', newDb)

app.listen(3090, () => {
  console.log('server running on 3090 port')
})
