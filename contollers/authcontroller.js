
import { comparePassword, hashedPassword } from '../helpers/authhelper.js'
import usermodel from '../models/usermodel.js'
import orderModel from '../models/orderModel.js'
import  JWT  from 'jsonwebtoken'



const registerController = async(req,res)=>{
try{
    const {name,email,password,phone,address,answer} = req.body
    //validations
    if(!name){
        return res.send({message:'Name is required'})
    }
    if(!email){
        return res.send({message:'email is required'})
    }
    if(!password){
        return res.send({message:'Password is required'})
    }
    if(!phone){
        return res.send({message:'Phone no. is required'})
    }
    if(!address){
        return res.send({message:'Address is required'})
    }
    if(!answer){
        return res.send({message:'Answer is required'})
    }
    //existing user
    const existinguser = await usermodel.findOne({email})
    if(existinguser){
        return res.status(200).send({
            success:true,
            message:'user already exist login'
        })
    }
    //register user
    const hashed =  await hashedPassword(password)
    //save
    const user = new usermodel({name,email,phone,address,password:hashed,answer})
    await user.save()
    res.status(201).send({
    success:true,
    message:'user register successfully',
    user

   })

}catch(error){
console.log(error)
res.status(500).send({
    success:false,
    message:'error in registration',
    error
})
}
}

 const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await usermodel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };




const testController = (req,res)=>{
    res.send('protected routes')
}



//forgot password
 export const forgotPasswordController = async(req,res)=>{
  try{
    const {email,answer,newpassword} = req.body

    if(!email){
        res.status(400).send({
            message:'Email is required'
        })
    }
    if(!answer){
        res.status(400).send({
            message:'Answer is required'
        })
    }

    if(!newpassword){
        res.status(400).send({
            message:'new password  is required'
        })
    }

    //check
    const user  = await usermodel.findOne({email,answer})
    //validation
    if(!user){
        return res.status(404).send({
            success:false,
            message:'wrong email or answer'
        })
    }

    const hash =await hashedPassword(newpassword)
    await usermodel.findByIdAndUpdate(user._id,{password:hash})
    res.status(200).send({
        success:true,
        message:'password reset successfuly'
    })

  }catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:"something is wrong",
        error
    })
  }
}

export const updateProfilectrl = async(req,res)=>{
  try{
    const {name,email,password,address,phone} =  req.body

    const user =  await usermodel.findById(req.user._id)

    //password
    if(password && password.length < 6){
      return res.json({error:'Password is required and must be 6 charector long'})
    }
    const hashPassword = password ? await hashedPassword(password):undefined
    const updatedUser =  await usermodel.findByIdAndUpdate(req.user._id,{
      name:name || user.name,
      password:hashPassword || user.password,
      phone:phone || user.phone,
      address:address || user.address
    },{new:true})

    res.status(200).send({
      success:true,
      message:'Profile updated successfully',
      updatedUser
    })

  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'error in update profile',
      error
    })
  }
}

 export const getOrderController =  async(req,res)=>{
  try{
    const orders = await orderModel.find({buyer:req.user._id}).populate('products','-photo').populate('buyer','name')
    res.json(orders)
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'error in getting order on order page'
    })
  }
}




export const getAllOrderController =  async(req,res)=>{
  try{
    const orders = await orderModel.find({}).populate('products','-photo').populate('buyer','name').sort({createdAt:-1})
    res.json(orders)
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'error in getting order on order page'
    })
  }
}

export  const orderStatusctrl= async(req,res)=>{
  try{
     const {orderId} = req.params
     const{status} =  req.body
     const orders  =  await orderModel.findByIdAndUpdate(
      orderId,{status}
     )
     res.json(orders)
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'error in order status ctrl'
    })
  }
}



export {registerController,loginController,testController}