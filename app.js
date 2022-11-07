const cors = require('cors');
var express = require("express");
const mysql = require('mysql2/promise');
const db = require('./db')
var bodyParser = require('body-parser')

// create the connection

var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

const userRoutes = require('./Router/smtp');
const adminRoutes=require('./Router/admin');

app.use('/', userRoutes);
app.use('/admin', adminRoutes );


app.listen(3090, () => {
  console.log("ok good very good");
})