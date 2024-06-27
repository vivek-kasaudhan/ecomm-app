import  express from "express";
import { forgotPasswordController, getAllOrderController, getOrderController, loginController, orderStatusctrl, registerController,testController, updateProfilectrl } from "../contollers/authcontroller.js";
import { isAdmin, requireSignin } from "./../middlewares/authMiddleware.js";

// router object
const router = express.Router()


//routing
router.post('/register',registerController)

router.post('/login',loginController)

//forgot password || post
router.post('/forgot-password',forgotPasswordController)


//protected route path user route

router.get('/user-auth',requireSignin,(req,res)=>{
    res.status(200).send({ok:true})
})

// admin route
router.get('/admin-auth',requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})


//test routes
router.get('/test',requireSignin,isAdmin,testController)



//updATE profile
router.put('/profile',requireSignin,updateProfilectrl)

////orders getting display in order comp

router.get('/orders',requireSignin,getOrderController)

router.get('/all-orders',requireSignin,getAllOrderController)

router.put('order-status/:orderId',requireSignin,orderStatusctrl )


export default router