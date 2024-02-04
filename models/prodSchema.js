const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    id:{type:String,unique:true},
    url:{type:String},
    detailUrl:{type:String},
    title:{type:Object},
    price:{type:Object},
    quantity:{type:Number},
    description:{type:String},
    discount:{type:String},
    tagline:{type:String}
})
const prod=mongoose.model('productDb',schema)
module.exports=prod