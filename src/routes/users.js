const express = require("express");
const router = express.Router();
const db = require("../db");
const e = require("express");
const usersQueries = require('../queries/users');

router.post("/", async (req, res)=>{
  try{

const {name, email } = req.body;
if(name.length < 3){
  return res
  .status(400)
  .json({error: "Name should have more than 3 charanters"});
}

if(email.length < 5 || ! email.includes("@")){
  return res
  .status(400)
  .json({error: "E-mail is invalid"});
}
const query = usersQueries.findByEmail(email);
const alreadyExist = await db.query(query);

if(!alreadyExist.rows[0]){
 return res.status(403).json({error: "User already exits"});
}

 const text = "INSERT INTO users(name, email) VALUES ($1,$2) RETURNING *";
 const values = [name, email];
 const createResponse = await db.query(text, values);
 if(!createResponse.rows[0]){

  return res.status(400).json({error:"User not created" });
 }
 return res.status(200).json(createResponse.rows[0]);

  } catch(error){
    return res.status(500).json(error);

  }
});

router.put("/", async (req, res)=>{
  try{
    const oldEmail = req.headers.email;
    const {name, email } = req.body;

if(name.length < 3){
  return res
  .status(400)
  .json({error: "Name should have more than 3 charanters"});
}

if(email.length < 5 || ! email.includes("@")){
  return res
  .status(400)
  .json({error: "E-mail is invalid"});
}

if(oldEmail.length < 5 || !oldEmail.includes("@")){
  return res
  .status(400)
  .json({error: "E-mail is invalid"});
}

const query = usersQueries.findByEmail(oldEmail);
const alreadyExist = await db.query(query);

if(!alreadyExist.rows[0]){
 return res.status(404).json({error: "User already exits"});
}

const text =
 "UPDATE users SET  name=$1, email=$2 WHERE email=$3  RETURNING *";
const values = [name, email, oldEmail];

 const UpdateResponse= await db.query(text,values);

 if(!UpdateResponse.rows[0]){
  return res.status(400).json({error: "users not Update"});
 }

 return res.status(200).json(UpdateResponse.rows[0]);

  } catch(error){
    return res.status(500).json(error);
  }
});

module.exports = router;