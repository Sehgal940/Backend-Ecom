const user=require('../models/userSchema')
const products=require('../models/prodSchema')
const order=require('../models/ordersSchema')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
require('dotenv').config();
const log=async(req,res)=>{
    const exists=await user.findOne({email:req.body.email})
    if(exists)
    {
        const checkPass=await bcrypt.compare(req.body.password,exists.password)
        if(checkPass) {res.send(exists.username)}
        else res.sendStatus(401)
        
    }
    else
    {
       res.sendStatus(401)
    }
}
const sign=async(req,res)=>{
    const exists=await user.findOne({username:req.body.username})
    if(exists)
    {
        return res.status(401).json({message:'already exist'})
    }
    else
    {
        const newPass=await bcrypt.hash(req.body.password,10)
        req.body.password=newPass
        const newUser=new user(req.body)
        await newUser.save()
        res.send('user registered successfully')
    }

}
const forget=async(req,res)=>{
    const Useremail=await user.findOne({email:req.body.email})
    if(Useremail)
    {
        const id=Useremail._id
        const payload={id:Useremail._id}
        const secret='secret'+Useremail.password
        jwt.sign(payload,secret,{expiresIn:'600s'},(err,data)=>{
        const link=`${process.env.serverURL}/reset/${id}/${data}`
        res.send('done')
        const transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
             user:process.env.authEmail,
             pass:process.env.authPass
            }
        })
        const mailOptions={
            from:process.env.authEmail,
            to:Useremail.email,
            subject:'change password mail',
            text:link
        }
        transport.sendMail(mailOptions,(error)=>{
            if(error) console.log(error)
            else console.log('email sent')
        })
        })
    }
    else res.send('email not exist')
}
const reset=async(req,res)=>{
    const id=req.params.id
    const token=req.params.token
    const USER=await user.findOne({_id:id}) 
    if(USER)
    {
        const secret='secret'+USER.password
        jwt.verify(token,secret)
        res.render('forgetpass')
    }
    else
    {
        res.send('not valid')
    }
}
const resetok=async(req,res)=>{
    const id = req.params.id;
    const token = req.params.token;  
    const USER=await user.findOne({_id:id}) 
    if(USER)
    {
        const secret='secret'+USER.password
        jwt.verify(token,secret);
        const newPass=await bcrypt.hash(req.body.passSet,10)
        USER.password=newPass;
        await USER.save()
        res.end('done')
    } 
    else
    {
        res.send('not valid')
    }
       
}
const getProducts=async(req,res)=>{
try{
    const prods= await products.find()
    res.status(200).send(prods)
}
catch(error)
{
    res.status(500).json({message:'data not found'})
}
}
const getProduct=async(req,res)=>{
    try{
        const prod=await products.findOne({id:req.params.id})
        res.status(200).send(prod)
    }
    catch(error)
    {
        res.status(500).json({message:'data not found'})
    }
}
const postOrders=async(req,res)=>{
    try{
        const userName=await user.findOne({username:req.body.acc})
        if(userName)
        {
            const val=req.body.data;
            const orderId=await order.create({
                    id:val.id,
                    url:val.url,
                    title:val.title,
                    price:val.price,
                    quantity:val.quantity,
                    user:userName._id
                })
            userName.order.push(orderId._id);
            await userName.save();
            res.status(200);
        }
        res.status(500).json({message:'user not found'})
    }
    catch(error)
    {
        res.status(500).json({message:'data not found'})
    }
}
const getOrders=async(req,res)=>{
    const name=req.params.id
    const orders=await user.findOne({username:name}).populate('order')
    if(orders.order.length>0)
    {
        res.status(200).send(orders.order)
    }
    else
    {
        res.sendStatus(400)
    }
}
const cancelOrder=async(req,res)=>{
    const id=req.params.id
    await order.deleteOne({_id:id})
    
}
module.exports={cancelOrder,getOrders,postOrders,getProduct,getProducts,sign,log,forget,reset,resetok}