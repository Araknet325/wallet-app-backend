const express = require("express");
const router = express.Router();
const db = require("../db");

const find0ne = (id) =>{
  return (query ={
    name: "fetch-category",
    text: "SELECT * FROM categories WHERE id = $1",
    values: [Number(id)],

  });
};


router.get("/", (req, res) =>{
  try{
    db.query(" SELECT * FROM categories ORDER BY name ASC ", (error, response) =>{
      if (error){
        return res.status(500).json(error);
      }
      return res.status(200).json(response.rows);
    });

  }catch(error){
    return res.status(500).json(error);

  }
});

router.post("/", (req, res) =>{
  try{
    const {name } = req.body;
  if(name.length < 3){
    return res
    .status(400)
    .json({error: "Name should have more than 3 character"});
  }

  const text = "INSERT INTO categories(name) VALUES($1) RETURNING*";
  const values = ["name"];

 db.query(text,values, (error, response) =>{
  if (error){
  return res.status(500).json(error);
}
return res.status(200).json(response.rows);

 });
  } catch(error){
    return res.status(500).json(error);

  }
});
 
router.delete("/:id", async (req, res) =>{
  
  try{
    const { id } = req.params;

  if (!id){
    return res.status(400).json({ error: "Param id is mandatory."});
  }
  const query = find0ne(id);
  const category = await db.query(query);

 if(!category.rows[0]){
  return res.status(404).json({error: "Category not fund"});
 }

 const text = "DELETE FROM categories WHERE id=$1 RETURNING*";
 const values = [Number(id)];
 const deleteResponse= await db.query(text,values);
 if(!category.rows[0]){
  return res.status(400).json({error: "Category not delete"});
 }

 return res.status(200).json(deleteResponse.rows[0]);

  } catch(error){
    return res.status(500).json(error);

  }

});

router.put("/:id", async(req, res)=>{
try {
  const { id } = req.params;
  const {name } = req.body;

  if (!id){
    return res.status(400).json({ error: "Param id is mandatory."});
  }
  
  if(name.length < 3){
    return res
    .status(400)
    .json({error: "Name should have more than 3 character"});
  }

  const query = find0ne(id);
  const category = await db.query(query);

 if(!category.rows[0]){
  return res.status(404).json({error: "Category not fund"});
 }  

 const text = "UPDATE categories SET  name=$1 WHERE id=$2  RETURNING *";
 const values = [name, Number(id)];

 const UpdateResponse= await db.query(text,values);
 if(!UpdateResponse.rows[0]){
  return res.status(400).json({error: "Category not Update"});
 }

 return res.status(200).json(UpdateResponse.rows[0]);

}catch(error){
  return res.status(500).json(error);

}

});

module.exports = router;