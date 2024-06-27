import slugify from "slugify";
import productModel from "../models/productModel.js"
import  categoryModel  from '../models/categoryModel.js'
import orderModel from "../models/orderModel.js";
import fs from 'fs'
import braintree from "braintree";
import dotenv from 'dotenv'
dotenv.config()


//payment configuration 
 

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });



export const createProductctrl = async(req,res)=>{
    try{
        const {name,slug,description,price,category,quantity,shipping} =  req.fields;
        const {photo} =  req.files;
       

        //validations

      switch(true){
        case !name:
            return res.status(500).send({error:'name is required'})
            case !description:
            return res.status(500).send({error:'description is required'})
            case !price:
            return res.status(500).send({error:'price is required'})
            case !quantity:
            return res.status(500).send({error:'quantity is required'})
            case !category:
            return res.status(500).send({error:'category is required'})
            case photo && photo.size > 1000000:
            return res.status(500).send({error:'photo is required and will be less than 1mb '})
           
      }
      const products =  new productModel({...req.fields,slug:slugify(name)})
      if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType = photo.type
      }

      await products.save()
      res.status(201).send({
        success:true,
        message:'product created successfully',
        products
      })



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in controlller'
        })
    }
}


export  const getProductctrl = async(req,res)=>{
    try{
        const products =  await productModel.find({}).populate('category').select('-photo').limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            totalcount:products.length,
            message:'All products',
            products,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in products req',error:error.message
        })
    }
}


export  const getSingleProductctrl = async(req,res)=>{
    try{
        const product =  await  productModel.findOne({slug:req.params.slug}).populate('category').select('-photo')
        res.status(201).send({
            success:true,
            message:'single product fetched',
            product
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in getting single product'
        })
    }
}

export const productPhotoctrl = async(req,res)=>{
    try{
       const product =  await productModel.findById(req.params.pid).select('photo')

       if(product.photo.data){
        res.set('content-type',product.photo.contentType)
        return res.status(200).send(product.photo.data)
       }
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while getting photo',
            error
        })
    }
}


export  const deleteProductctrl= async(req,res)=>{
try{
    const product =  await productModel.findByIdAndDelete(req.params.pid).select('-photo')
    res.status(200).send({
        success:true,
        message:'product deleted successfully'
    })

    

}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:'error in deleteing',
        error
    })
}
}

export const updateProductctrl =  async(req,res)=>{

    try{
        const {name,slug,description,price,category,quantity,shipping} =  req.fields;
        const {photo} =  req.files;
       

        //validations

      switch(true){
        case !name:
            return res.status(500).send({error:'name is required'})
            case !description:
            return res.status(500).send({error:'description is required'})
            case !price:
            return res.status(500).send({error:'price is required'})
            case !quantity:
            return res.status(500).send({error:'quantity is required'})
            case !category:
            return res.status(500).send({error:'category is required'})
            case photo && photo.size > 1000000:
            return res.status(500).send({error:'photo is required and will be less than 1mb '})
           
      }
      const products =  await productModel.findByIdAndUpdate(req.params.pid,{
        ...req.fields,slug:slugify(name),
      },{new:true})
      if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType = photo.type
      }

      await products.save()
      res.status(201).send({
        success:true,
        message:'product updated successfully',
        products
      })



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in controlller',
            error:error.message
        })
    }

}


export const productFilterctrl = async(req,res)=>{
    try{
     const {checked,radio}=  req.body
     const args =  {}
     if(checked.length > 0) args.category = checked
     if(radio.length)args.price = {$gte:radio[0],$lte:radio[1]}
     
     const products =  await productModel.find(args)
     res.status(200).send({
        success:true,
        products
     })

    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while filtering products',
            error
        })
    }
}


export const productCountctrl = async(req,res)=>{
    try{
        const total  =  await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in product count',
            error,
        })
    }
}
export const productListCtrl = async(req,res)=>{
    try{
        const perPage  = 6
        const page  =  req.params.page ? req.params.page:1
        const products =  await productModel.find({}).select('-photo').
                          skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})

        res.status(200).send
        ({
           success:true,
            products
         })
    }catch(error){
        console.log(error)
        res.status(400).send({
            message:'error in ctrl',
            success:false,
            error
        })
    }
}


export const searchProductctrl =  async(req,res)=>{
    try{
        const {keyword}=  req.params
        const result =  await  productModel.find({$or:[
            {
                name:{$regex:keyword,$options:'i'}
            },
            {
                description:{$regex:keyword,$options:'i'}
            }
        ]}).select('-photo')

        res.json(result)

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'erro in serchctrl',
            error
        })
    }
}

export const relatedProductctrl = async(req,res)=>{
    try{
        const{pid,cid}= req.params
        const products =  await productModel.find({
            category:cid,
            _id:{
                $ne:pid
            }
        }).select('-photo').limit(3).populate('category')

        res.status(200).send({
            success:true,
            products
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in getting related product',
            error,
        })
    }
}


export const productCategoryctrl = async(req,res)=>{
    try{
        const category =  await categoryModel.findOne({slug:req.params.slug})
        const products  =  await  productModel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            category,
            products
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in category product ctrl',
            error
        })
    }
}




//braintree payment token ctrl
export  const braintreeTokenctrl =  async(req,res)=>{
    try{
          gateway.clientToken.generate({},function(error,response){
            if(error){
                res.status(500).send(error)
            }else{
                res.send(response)
            }
          })
    }catch(error){
        console.log(error)
    }
}



export  const braintreePaymentctrl =  async(req,res)=>{
    try{
       const {cart,nonce} = req.body
       let total =0
       cart.map((i)=>{
        total += i.price
       })
       let newTransction = gateway.transaction.sale({
        amount:total,
        paymentMethodNonce:nonce,
        options:{
            submitForSettlement:true
        }
       },
       function(error,result){
        if(result){
         const order = new orderModel({
            products:cart,
            payment:result,
            buyer:req.user._id
         }).save()
         res.json({ok:true})
        }else{
            res.status(500).send(error)
        }
       }
       )
    }catch(error){
        console.log(error)
    }
}