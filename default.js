const prod=require('./models/prodSchema')
const prodl=require('../infikart/src/consts/prodData')
const defaultData=async()=>{
    try{
         await prod.insertMany(prodl)
    }
    catch(error){
        console.log(error.message)
    }
}
module.exports={defaultData} 