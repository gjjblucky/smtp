const bcrypt = require("bcrypt")




const mysql = require('mysql2/promise');
const db = require('../db');

exports.SignUp=async (req,res)=>{

    const connection =await mysql.createConnection(
        {
          host: "localhost",
          user: "root",
          password: "Escale@123",
          database: "smtps"
        }
        
      );

      const{firstName,lastName,totalClientId,email,password}=req.body;
     
      const salt =  bcrypt.genSaltSync(10)
     
      const hashedPassword =  bcrypt.hashSync(password,salt);

        const sqlSearch = "SELECT * FROM admin WHERE Email = ?";
        
       const matchemail= await connection.execute(sqlSearch, [email])
    
       console.log(matchemail[0].length);
       if(matchemail[0].length != 0){
        
        console.log("------> User already exists")
        res.sendStatus(409) 
       } else {
        connection.query  (`INSERT INTO admin (FirstName,LastName,totalNoOfclientsId,
            password,Email) VALUES
    (?,?,?,?,?)`, [(firstName || null),
            (lastName || null),
            (totalClientId || null),
            (hashedPassword || null),  
            (email || null)]) ;
            res.json({message:"user created successfully"});
      }  
   
}


exports.Login=async (req,res) =>{
console.log("login")
    const connection =await mysql.createConnection(
        {
          host: "localhost",
          user: "root",
          password: "Escale@123",
          database: "smtps"
        }
        
      );
      const{email,password}=req.body;
console.log(req.body.email);
      const sqlSearch = "SELECT * FROM admin WHERE Email = ?";
        
       const matchemail= await connection.execute(sqlSearch, [email])
      
        if (matchemail[0].length == 0) {
            console.log("--------> User does not exist")
            res.sendStatus(404)
           }  else {
         const hashedPassword = matchemail[0][0].password
         console.log(matchemail[0][0].password);
         //get the hashedPassword from result
        if (await bcrypt.compare(password, hashedPassword)) {
        console.log("---------> Login Successful")

        


        
        res.send(`${email} is logged in!`)
        } 
        else {
        console.log("---------> Password Incorrect")
        res.send("Password incorrect!")
        } //end of bcrypt.compare()
      }

       

       

}