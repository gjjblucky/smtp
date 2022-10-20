const {createPool} = require('mysql')

var db= createPool({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"smtps",
    connectionLimit:10
});


module.exports=db;