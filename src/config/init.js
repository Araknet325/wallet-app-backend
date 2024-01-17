const db = require("../db");
const tableQueries = require("../queries/tables");

db.connect().then( async () =>{
  await db.query(tableQueries.createUsers());
  await db.query(tableQueries.createCategories());
  await db.query(tableQueries.createFinances());


})
.catch((error)=>{
 throw new Error("Error connecting to database ", error);
});