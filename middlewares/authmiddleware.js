import  JWT  from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

//protected routes token base
 export const requireSignin = async(req,res,next)=>{
   try{
    const decode = JWT.verify(req.headers.authorization,process.env.JWT_SECRET)
    req.user = decode
    next()
   }catch(error){
    console.log(error)
   }
}

//admin access  tokenization
  export const isAdmin  = async(req,res,next)=>{
    try{
   const user  = await usermodel.findById(req.user._id)
   if(user.role!==1){
    return res.status(401).send({
        success:false,
        message:'unauthorised access'
    })
   }else{
    
    next()
   }
    }catch(error){
        res.send({
            success:false,
            message:'fail'
        
        })
    }
}




