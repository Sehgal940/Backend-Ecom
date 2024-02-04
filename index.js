const express = require('express');
const app = express();
const router = require('./routes/route');
const cors=require('cors')
app.listen(8000, () => {
  console.log(`Server is running`);
})

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(router);
app.set('view engine','ejs')
require('dotenv').config();


const {defaultData} = require('./default');
const connection = require('./db/db');

connection(); 
defaultData(); 



