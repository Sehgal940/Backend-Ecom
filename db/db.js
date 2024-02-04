const Connection=()=>{
    const uri= process.env.dbURL
    try{
        const mongoose=require('mongoose')
        mongoose.connect(uri)
    }
    catch(error){
        console.log('not connected')
    }
}
module.exports=Connection