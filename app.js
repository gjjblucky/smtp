const cors = require('cors');
var express = require("express");
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const db = require('./db')
var bodyParser = require('body-parser')

// create the connection

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
dotenv.config();

const smtpRoutes = require('./Router/smtp');
const adminRoutes=require('./Router/admin');
const UserRoutes=require('./Router/user');

app.use('/', smtpRoutes);
app.use('/admin', adminRoutes );
app.use('/user',UserRoutes);


app.listen(3090, () => {
  console.log("ok good very good");
})